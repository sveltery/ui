import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { log } from '@clack/prompts';
import { CliError, ParseError } from '../parse.js';
import { readJson } from '../project.js';
import { registryItem } from '../registry.js';
import { assertRoot, assertUniqueNames, hasParentTraversal, installableItem, isPathInside, isUrl, ownItems, sourceOf, sourceRegistry, rewriteFiles, type LoadedItem, type SourceRegistry } from '../source.js';

export type BuildOptions = { cwd: string; output: string };

const MAX_INCLUDE_DEPTH = 32;

function readRegistry(file: string): { registry: SourceRegistry; json: Record<string, unknown> } {
  const json = readJson(file);
  try {
    return { registry: sourceRegistry(json, ''), json: json as Record<string, unknown> };
  } catch (error) {
    if (error instanceof ParseError) throw new CliError(`Invalid registry file at ${file}: ${error.message}`);
    throw error;
  }
}

function includePath(include: string, registryFile: string, cwd: string): string {
  const invalid = (reason: string) => new CliError(`Invalid include "${include}" in ${registryFile}: ${reason}`);
  if (isUrl(include)) throw invalid('remote includes are not supported by build. Use a relative path to a registry.json file in the same repository.');
  if (isAbsolute(include)) throw invalid('include paths must be relative. Use a path like "./registry/ui/registry.json".');
  if (hasParentTraversal(include)) throw invalid('include paths cannot use parent-directory traversal. Keep included registry.json files inside the registry root.');
  if (basename(include) !== 'registry.json') throw invalid('include paths must explicitly reference a registry.json file. Use a path like "./registry/ui/registry.json".');
  const resolved = resolve(dirname(registryFile), include);
  if (!isPathInside(resolved, cwd)) throw new CliError(`Invalid registry file at ${resolved}: registry includes must stay inside ${cwd}.`);
  return resolved;
}

/** The items of `registryFile` and of the registry.json files it includes, included items first. */
function collectItems(registryFile: string, registry: SourceRegistry, cwd: string, chain: string[], seen: Map<string, string>): LoadedItem[] {
  if (chain.length >= MAX_INCLUDE_DEPTH) throw new CliError(`Registry include tree is too deep at ${registryFile}. The maximum include depth is ${MAX_INCLUDE_DEPTH}.`);
  if (chain.includes(registryFile)) throw new CliError(`Registry include cycle detected:\n${[...chain, registryFile].map((file) => `  - ${file}`).join('\n')}`);
  const includedFrom = chain.at(-1) ?? registryFile;
  const first = seen.get(registryFile);
  if (first) throw new CliError(`Registry file included more than once: ${registryFile}.\n  - first included from ${first}\n  - included again from ${includedFrom}`);
  seen.set(registryFile, includedFrom);

  const included = (registry.include ?? []).flatMap((include) => {
    const file = includePath(include, registryFile, cwd);
    if (!existsSync(file)) throw new CliError(`Failed to read registry file at ${file}.`);
    return collectItems(file, readRegistry(file).registry, cwd, [...chain, registryFile], seen);
  });
  return [...included, ...ownItems(registry, registryFile, dirname(registryFile))];
}

function buildItem(item: LoadedItem, rootDir: string): Record<string, unknown> {
  const contents = item.files.map((file) => {
    const source = resolve(item.dir, file.path);
    try {
      return readFileSync(source, 'utf8');
    } catch {
      throw new CliError(`Failed to read file "${file.path}" for registry item "${item.name}" (${sourceOf(item)}). Expected file at ${source}.`);
    }
  });
  return installableItem(item, rootDir, contents, (json, path) => (registryItem(json, path), json as Record<string, unknown>));
}

/** Writes `<output>/<name>.json` for each item of registry.json, with each file's content inlined, and `<output>/registry.json`. Returns the paths written, relative to `cwd`. */
export function build(registryArg: string, options: BuildOptions): string[] {
  const cwd = resolve(options.cwd);
  const registryFile = resolve(cwd, registryArg);
  const outputDir = resolve(cwd, options.output);
  if (!existsSync(registryFile)) throw new CliError(`The path ${registryFile} does not exist.`);

  const { registry, json } = readRegistry(registryFile);
  assertRoot(registry, registryFile);
  const usesInclude = (registry.include?.length ?? 0) > 0;
  if (usesInclude && basename(registryFile) !== 'registry.json') throw new CliError(`Invalid registry file at ${registryFile}: registries that use include must be named registry.json.`);

  // Without include, file paths are relative to the working directory, as in shadcn.
  const rootDir = usesInclude ? dirname(registryFile) : cwd;
  const items = usesInclude
    ? collectItems(registryFile, registry, cwd, [], new Map())
    : ownItems(registry, registryFile, cwd);
  if (usesInclude) assertUniqueNames(items);

  const written: string[] = [];
  mkdirSync(outputDir, { recursive: true });
  for (const item of items) {
    const path = join(outputDir, `${item.name}.json`);
    writeFileSync(path, `${JSON.stringify(buildItem(item, rootDir), null, 2)}\n`);
    written.push(relative(cwd, path));
  }

  const catalog = join(outputDir, 'registry.json');
  if (usesInclude) {
    const flattened: Record<string, unknown> = { ...json, items: items.map((item) => ({ ...item.fields, files: rewriteFiles(item, rootDir) })) };
    delete flattened.include;
    writeFileSync(catalog, `${JSON.stringify(flattened, null, 2)}\n`);
  } else copyFileSync(registryFile, catalog);
  written.push(relative(cwd, catalog));

  log.success(`Built ${items.length} ${items.length === 1 ? 'item' : 'items'} in ${relative(cwd, outputDir) || '.'}.`);
  return written;
}
