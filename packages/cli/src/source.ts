import { isAbsolute, relative, resolve, sep } from 'node:path';
import { array, CliError, literal, object, optional, ParseError, refine, string, type Parser } from './parse.js';
import type { RegistryFile } from './registry.js';

// A source registry.json, the file that `build` reads and that a GitHub registry keeps at its root: items whose files have a path, not content.

const ITEM_SCHEMA = 'https://ui.sveltery.dev/schema/registry-item.json';

export type SourceFile = { path: string; type: RegistryFile['type']; target?: string };
/** An item as registry.json declares it. `fields` is the item's JSON, kept whole so keys the CLI does not know pass through. */
export type SourceItem = { name: string; files: SourceFile[]; fields: Record<string, unknown> };
/** An item and the registry.json that declares it: its file paths are relative to `dir`. */
export type LoadedItem = SourceItem & { registryFile: string; index: number; dir: string };

// `add` takes only names of this form, and the name becomes the output file name, so a `/` or `..` would write outside the output directory.
const itemName = refine(string, (name) => /^[a-z0-9][a-z0-9-]*$/.test(name), 'lowercase letters, digits and hyphens, starting with a letter or digit');
const sourceFile = object({ path: string, type: literal('registry:ui', 'registry:component', 'registry:page', 'registry:file'), target: optional(string) });
const sourceItem: Parser<SourceItem> = (value, path) => {
  const { name, files } = object({ name: itemName, files: optional(array(sourceFile)) })(value, path);
  return { name, files: files ?? [], fields: value as Record<string, unknown> };
};
export const sourceRegistry = object({ name: optional(string), homepage: optional(string), include: optional(array(string)), items: optional(array(sourceItem)) });
export type SourceRegistry = ReturnType<typeof sourceRegistry>;

export function assertRoot(registry: SourceRegistry, registryFile: string): void {
  const missing = (['name', 'homepage'] as const).filter((key) => !registry[key]);
  if (missing.length > 0) {
    throw new CliError(`Invalid root registry file at ${registryFile}: root registry.json must define ${missing.map((key) => `"${key}"`).join(' and ')}. Included registry.json files may omit these fields.`);
  }
}

export const hasParentTraversal = (path: string) => path.split(/[\\/]+/).includes('..');
export const isUrl = (path: string) => /^[a-z][a-z\d+.-]*:\/\//i.test(path);
export const isPathInside = (path: string, root: string) => {
  const rel = relative(root, path);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
};
const toPosix = (path: string) => path.split(sep).join('/');
export const sourceOf = (item: LoadedItem) => `${item.registryFile} items[${item.index}]`;

/** The item's files as registry.json writes them, each with `path` relative to `rootDir` and the keys `extra` returns. */
export const rewriteFiles = (item: LoadedItem, rootDir: string, extra: (file: SourceFile, path: string, index: number) => object = () => ({})) =>
  ((item.fields.files as Record<string, unknown>[] | undefined) ?? []).map((raw, i) => {
    const file = item.files[i]!;
    const path = toPosix(relative(rootDir, resolve(item.dir, file.path)));
    return { ...raw, path, ...extra(file, path, i) };
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

export const ownItems = (registry: SourceRegistry, registryFile: string, dir: string): LoadedItem[] =>
  (registry.items ?? []).map((item, index) => {
    validateFiles(item, registryFile, dir);
    return { ...item, registryFile, index, dir };
  });

export function assertUniqueNames(items: LoadedItem[]): void {
  const byName = new Map<string, LoadedItem>();
  for (const item of items) {
    const other = byName.get(item.name);
    if (other) throw new CliError(`Duplicate registry item name "${item.name}". Registry item names must be unique.\n  - ${sourceOf(other)}\n  - ${sourceOf(item)}`);
    byName.set(item.name, item);
  }
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

/**
 * The item JSON that `add` installs, read by `parser`: each file with its path from `rootDir`, its target, and `contents`, in file order, as its content.
 * `parser` is the CLI's item parser, which this module cannot import.
 */
export function installableItem<T>(item: LoadedItem, rootDir: string, contents: string[], parser: Parser<T>): T {
  const files = rewriteFiles(item, rootDir, (file, path, index) => ({ target: file.target ?? defaultTarget(item, file, path), content: contents[index] }));
  try {
    return parser({ $schema: ITEM_SCHEMA, ...item.fields, files }, '');
  } catch (error) {
    if (error instanceof ParseError) throw new CliError(`Item "${item.name}" (${sourceOf(item)}) is not one the CLI can install. ${error.message}`);
    throw error;
  }
}
