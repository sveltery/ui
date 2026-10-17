import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { log } from '@clack/prompts';
import { array, CliError, literal, object, optional, ParseError, refine, string, type Parser } from '../parse.js';
import { readJson } from '../project.js';
import { registryItem, type RegistryFile } from '../registry.js';

export type BuildOptions = { cwd: string; output: string };

const ITEM_SCHEMA = 'https://ui.sveltery.dev/schema/registry-item.json';
const MAX_INCLUDE_DEPTH = 32;

type SourceFile = { path: string; type: RegistryFile['type']; target?: string };
/** An item as registry.json declares it. `fields` is the item's JSON, kept whole so `build` passes keys it does not know through. */
type SourceItem = { name: string; files: SourceFile[]; fields: Record<string, unknown> };
/** An item and the registry.json that declares it: its file paths are relative to `dir`. */
type LoadedItem = SourceItem & { registryFile: string; index: number; dir: string };

// `add` takes only names of this form, and the name becomes the output file name, so a `/` or `..` would write outside the output directory.
const itemName = refine(string, (name) => /^[a-z0-9][a-z0-9-]*$/.test(name), 'lowercase letters, digits and hyphens, starting with a letter or digit');
const sourceFile = object({ path: string, type: literal('registry:ui', 'registry:component', 'registry:page', 'registry:file'), target: optional(string) });
const sourceItem: Parser<SourceItem> = (value, path) => {
  const { name, files } = object({ name: itemName, files: optional(array(sourceFile)) })(value, path);
  return { name, files: files ?? [], fields: value as Record<string, unknown> };
};
const sourceRegistry = object({ name: optional(string), homepage: optional(string), include: optional(array(string)), items: optional(array(sourceItem)) });
type SourceRegistry = ReturnType<typeof sourceRegistry>;

function readRegistry(file: string): { registry: SourceRegistry; json: Record<string, unknown> } {
  const json = readJson(file);
  try {
    return { registry: sourceRegistry(json, ''), json: json as Record<string, unknown> };
  } catch (error) {
    if (error instanceof ParseError) throw new CliError(`Invalid registry file at ${file}: ${error.message}`);
    throw error;
  }
}

const hasParentTraversal = (path: string) => path.split(/[\\/]+/).includes('..');
const isUrl = (path: string) => /^[a-z][a-z\d+.-]*:\/\//i.test(path);
const isPathInside = (path: string, root: string) => {
  const rel = relative(root, path);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
};
const toPosix = (path: string) => path.split(sep).join('/');
const sourceOf = (item: LoadedItem) => `${item.registryFile} items[${item.index}]`;
/** The item's files as registry.json writes them, each with `path` relative to `rootDir` and the keys `extra` returns. */
const rewriteFiles = (item: LoadedItem, rootDir: string, extra: (file: SourceFile, path: string) => object = () => ({})) =>
  (item.fields.files as Record<string, unknown>[] | undefined ?? []).map((raw, i) => {
    const file = item.files[i]!;
    const path = toPosix(relative(rootDir, resolve(item.dir, file.path)));
    return { ...raw, path, ...extra(file, path) };
  });

function validateFiles(item: SourceItem, registryFile: string, dir: string) {
  for (const { path } of item.files) {
    const invalid = (reason: string) => new CliError(`Invalid file path "${path}" for item "${item.name}" in ${registryFile}: ${reason}`);
    if (isUrl(path)) throw invalid('remote file paths are not supported by build.');
    if (isAbsolute(path)) throw invalid('file paths must be relative.');
    if (hasParentTraversal(path)) throw invalid('file paths cannot use parent-directory traversal.');
    if (!isPathInside(resolve(dir, path), dir)) throw invalid(`file paths must name a file inside ${dir}.`);
  }
}

const ownItems = (registry: SourceRegistry, registryFile: string, dir: string): LoadedItem[] =>
  (registry.items ?? []).map((item, index) => {
    validateFiles(item, registryFile, dir);
    return { ...item, registryFile, index, dir };
  });

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

const targetDirs: Partial<Record<SourceFile['type'], string>> = { 'registry:ui': 'ui', 'registry:component': 'components' };

/** Where `add` writes a file that names no `target`: below the first `ui` or `components` directory of its path from the registry root, as shadcn's `add` places it. */
function defaultTarget(item: LoadedItem, file: SourceFile, path: string): string {
  const marker = targetDirs[file.type];
  if (!marker) throw new CliError(`File "${file.path}" of item "${item.name}" (${sourceOf(item)}) needs a target: a path from the project root.`);
  const segments = path.split('/');
  const at = segments.indexOf(marker);
  return at === -1 ? segments.at(-1)! : segments.slice(at + 1).join('/');
}

function buildItem(item: LoadedItem, rootDir: string): Record<string, unknown> {
  const files = rewriteFiles(item, rootDir, (file, path) => {
    const target = file.target ?? defaultTarget(item, file, path);
    const source = resolve(item.dir, file.path);
    try {
      return { target, content: readFileSync(source, 'utf8') };
    } catch {
      throw new CliError(`Failed to read file "${file.path}" for registry item "${item.name}" (${sourceOf(item)}). Expected file at ${source}.`);
    }
  });
  const built = { $schema: ITEM_SCHEMA, ...item.fields, files };
  try {
    registryItem(built, '');
  } catch (error) {
    if (error instanceof ParseError) throw new CliError(`Item "${item.name}" (${sourceOf(item)}) is not one the CLI can install. ${error.message}`);
    throw error;
  }
  return built;
}

/** Writes `<output>/<name>.json` for each item of registry.json, with each file's content inlined, and `<output>/registry.json`. Returns the paths written, relative to `cwd`. */
export function build(registryArg: string, options: BuildOptions): string[] {
  const cwd = resolve(options.cwd);
  const registryFile = resolve(cwd, registryArg);
  const outputDir = resolve(cwd, options.output);
  if (!existsSync(registryFile)) throw new CliError(`The path ${registryFile} does not exist.`);

  const { registry, json } = readRegistry(registryFile);
  const missing = (['name', 'homepage'] as const).filter((key) => !registry[key]);
  if (missing.length > 0) {
    throw new CliError(`Invalid root registry file at ${registryFile}: root registry.json must define ${missing.map((key) => `"${key}"`).join(' and ')}. Included registry.json files may omit these fields.`);
  }
  const usesInclude = (registry.include?.length ?? 0) > 0;
  if (usesInclude && basename(registryFile) !== 'registry.json') throw new CliError(`Invalid registry file at ${registryFile}: registries that use include must be named registry.json.`);

  // Without include, file paths are relative to the working directory, as in shadcn.
  const rootDir = usesInclude ? dirname(registryFile) : cwd;
  const items = usesInclude
    ? collectItems(registryFile, registry, cwd, [], new Map())
    : ownItems(registry, registryFile, cwd);
  if (usesInclude) {
    const byName = new Map<string, LoadedItem>();
    for (const item of items) {
      const other = byName.get(item.name);
      if (other) throw new CliError(`Duplicate registry item name "${item.name}". Registry item names must be unique.\n  - ${sourceOf(other)}\n  - ${sourceOf(item)}`);
      byName.set(item.name, item);
    }
  }

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
