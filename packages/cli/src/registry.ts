import { DEFAULT_REGISTRY_URL } from './constants.js';
import { array, CliError, literal, number, object, optional, ParseError, record, refine, string, type Parser } from './parse.js';

// The served JSON contract, mirrored from apps/docs/registry/types.ts. test/registry-contract.ts fails `check` if they drift.

export const styleNames = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
export type StyleName = (typeof styleNames)[number];

export const baseColors = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;
export type BaseColor = (typeof baseColors)[number];

export const iconLibraryNames = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export type IconLibraryName = (typeof iconLibraryNames)[number];

export const REGISTRY_VERSION = 1;

const itemType = literal('registry:ui', 'registry:lib', 'registry:theme');

/** A registry writes only inside the project's ui directory. */
const isContainedPath = (target: string) => target !== '' && !/^([a-zA-Z]:)?[\\/]/.test(target) && !target.split(/[\\/]/).includes('..');

const registryFile = object({
  type: literal('registry:ui'),
  target: refine(string, isContainedPath, 'a relative path without ".." segments'),
  content: string,
});
export type RegistryFile = ReturnType<typeof registryFile>;

const cssVars = object({ theme: optional(record(string)), light: optional(record(string)), dark: optional(record(string)) });
export type CssVars = ReturnType<typeof cssVars>;

const registryItem = object({
  $schema: string,
  name: string,
  type: itemType,
  title: optional(string),
  description: optional(string),
  dependencies: optional(array(string)),
  registryDependencies: optional(array(string)),
  files: array(registryFile),
  cssVars: optional(cssVars),
});
export type RegistryItem = ReturnType<typeof registryItem>;

const registryManifest = object({
  $schema: string,
  name: literal('sveltery'),
  registryVersion: literal(REGISTRY_VERSION),
  styles: array(literal(...styleNames)),
  baseColors: array(literal(...baseColors)),
  iconLibraries: array(literal(...iconLibraryNames)),
  items: array(object({ name: string, type: itemType, description: optional(string) })),
});
export type RegistryManifest = ReturnType<typeof registryManifest>;

/** `items` memoizes fetched items by URL, so a command that looks at every item and then resolves some of them asks the server once. */
export type Registry = { url: string; manifest: RegistryManifest; items: Map<string, Promise<RegistryItem>> };

/** `SVELTERY_REGISTRY_URL`, then components.json's `registry`, then the production registry. */
export function resolveRegistryUrl(configured: string | undefined): string {
  return (process.env.SVELTERY_REGISTRY_URL || configured || DEFAULT_REGISTRY_URL).replace(/\/+$/, '');
}

async function fetchJson<T>(url: string, parser: Parser<T>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  } catch (error) {
    throw new CliError(`Could not reach ${url}: ${error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : String(error)}`);
  }
  if (!response.ok) throw new CliError(`GET ${url} failed with ${response.status} ${response.statusText}`.trimEnd());
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new CliError(`${url} did not return JSON`);
  }
  try {
    return parser(json, '');
  } catch (error) {
    if (error instanceof ParseError) throw new CliError(`${url} is not a valid registry response. ${error.message}`);
    throw error;
  }
}

export async function openRegistry(url: string): Promise<Registry> {
  const indexUrl = `${url}/index.json`;
  const { registryVersion } = await fetchJson(indexUrl, object({ registryVersion: number }));
  if (registryVersion > REGISTRY_VERSION) {
    throw new CliError(`The registry at ${url} uses format version ${registryVersion}, and this CLI reads version ${REGISTRY_VERSION}. Update it with \`npx @sveltery/ui@latest\`.`);
  }
  return { url, manifest: await fetchJson(indexUrl, registryManifest), items: new Map() };
}

export function fetchTheme(registry: Registry, baseColor: BaseColor): Promise<RegistryItem> {
  return fetchJson(`${registry.url}/themes/${baseColor}.json`, registryItem);
}

/** A command-line argument or a `registryDependencies` entry: an item of the configured style, or any item URL. */
export type ItemRef = { kind: 'name'; name: string } | { kind: 'url'; url: string };

export function parseItemRef(value: string): ItemRef {
  if (/^https?:\/\//.test(value)) return { kind: 'url', url: value };
  if (/^[a-z0-9][a-z0-9-]*$/.test(value)) return { kind: 'name', name: value };
  throw new CliError(`"${value}" is neither an item name nor an http(s) URL.`);
}

function itemUrl(registry: Registry, style: StyleName, ref: ItemRef): string {
  return ref.kind === 'url' ? ref.url : `${registry.url}/styles/${style}/${ref.name}.json`;
}

export function fetchItem(registry: Registry, style: StyleName, ref: ItemRef): Promise<RegistryItem> {
  const url = itemUrl(registry, style, ref);
  const cached = registry.items.get(url);
  if (cached) return cached;
  const fetched = fetchJson(url, registryItem);
  registry.items.set(url, fetched);
  return fetched;
}

/** Fetches `refs` and their registry dependencies, each item once, dependencies before the items that need them. */
export async function resolveItems(registry: Registry, style: StyleName, refs: ItemRef[]): Promise<RegistryItem[]> {
  const known = new Set(registry.manifest.items.map((item) => item.name));
  const unknown = refs.flatMap((ref) => (ref.kind === 'name' && !known.has(ref.name) ? [ref.name] : []));
  if (unknown.length > 0) {
    throw new CliError(`Not in the registry: ${unknown.join(', ')}. Available items: ${[...known].join(', ')}.`);
  }
  const ordered: RegistryItem[] = [];
  const visited = new Set<string>();
  const visit = async (ref: ItemRef): Promise<void> => {
    const url = itemUrl(registry, style, ref);
    if (visited.has(url)) return;
    visited.add(url);
    const item = await fetchItem(registry, style, ref);
    for (const dependency of item.registryDependencies ?? []) await visit(parseItemRef(dependency));
    if (!ordered.some((other) => other.name === item.name)) ordered.push(item);
  };
  for (const ref of refs) await visit(ref);
  return ordered;
}
