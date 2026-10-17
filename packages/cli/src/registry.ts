import { DEFAULT_REGISTRY_URL } from './constants.js';
import { array, CliError, literal, number, object, optional, ParseError, record, refine, string, type Parser } from './parse.js';
import { PRESET_MENU_ACCENTS, PRESET_MENU_COLORS } from './preset/preset.js';

// The served JSON contract, mirrored from apps/docs/registry/types.ts. test/registry-contract.ts fails `check` if they drift.

export const styleNames = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
export type StyleName = (typeof styleNames)[number];

export const baseColors = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;
export type BaseColor = (typeof baseColors)[number];

export const accentColors = ['amber', 'blue', 'cyan', 'emerald', 'fuchsia', 'green', 'indigo', 'lime', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'teal', 'violet', 'yellow'] as const;
export type AccentColor = (typeof accentColors)[number];

export const iconLibraryNames = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export type IconLibraryName = (typeof iconLibraryNames)[number];

export const REGISTRY_VERSION = 1;

/** A registry writes only inside the project: under its ui or components directory, or below its root. */
const isContainedPath = (target: string) => target !== '' && !/^([a-zA-Z]:)?[\\/]/.test(target) && !target.split(/[\\/]/).includes('..');

const registryFile = object({
  type: literal('registry:ui', 'registry:component', 'registry:page', 'registry:file'),
  target: refine(string, isContainedPath, 'a relative path without ".." segments'),
  content: string,
});
export type RegistryFile = ReturnType<typeof registryFile>;

const cssVars = object({ theme: optional(record(string)), light: optional(record(string)), dark: optional(record(string)) });
export type CssVars = ReturnType<typeof cssVars>;

export type CssTree = { [key: string]: CssValue };
export type CssValue = string | (string | Record<string, string>)[] | CssTree;

const cssValue: Parser<CssValue> = (value, path) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return array((entry, at) => (typeof entry === 'string' ? entry : record(string)(entry, at)))(value, path);
  return cssTree(value, path);
};
const cssTree: Parser<CssTree> = record(cssValue);

const registryBaseConfig = object({
  style: optional(literal(...styleNames)),
  iconLibrary: optional(literal(...iconLibraryNames)),
  menuColor: optional(literal(...PRESET_MENU_COLORS)),
  menuAccent: optional(literal(...PRESET_MENU_ACCENTS)),
  tailwind: optional(object({ baseColor: optional(literal(...baseColors)) })),
});
export type RegistryBaseConfig = ReturnType<typeof registryBaseConfig>;

const registryFont = object({
  family: string,
  provider: literal('google'),
  import: string,
  variable: string,
  weight: optional(array(string)),
  subsets: optional(array(string)),
  selector: optional(string),
  dependency: optional(string),
});
export type RegistryFont = ReturnType<typeof registryFont>;

const itemCommon = {
  $schema: string,
  name: string,
  title: optional(string),
  description: optional(string),
  dependencies: optional(array(string)),
  devDependencies: optional(array(string)),
  registryDependencies: optional(array(string)),
  files: array(registryFile),
  cssVars: optional(cssVars),
  css: optional(cssTree),
};

const plainItem = object({ ...itemCommon, type: literal('registry:ui', 'registry:lib', 'registry:theme', 'registry:block') });
const itemByType = {
  'registry:ui': plainItem,
  'registry:lib': plainItem,
  'registry:theme': plainItem,
  'registry:block': plainItem,
  'registry:base': object({ ...itemCommon, type: literal('registry:base'), config: optional(registryBaseConfig) }),
  'registry:font': object({ ...itemCommon, type: literal('registry:font'), font: registryFont }),
};
type ItemType = keyof typeof itemByType;
export const itemTypeNames = Object.keys(itemByType) as ItemType[];
const itemType = literal(...itemTypeNames);
export type RegistryItem = ReturnType<(typeof itemByType)[ItemType]>;

export const registryItem: Parser<RegistryItem> = (value, path) => itemByType[object({ type: itemType })(value, path).type](value, path);

const registryManifest = object({
  $schema: string,
  name: literal('sveltery'),
  registryVersion: literal(REGISTRY_VERSION),
  styles: array(literal(...styleNames)),
  baseColors: array(literal(...baseColors)),
  iconLibraries: array(literal(...iconLibraryNames)),
  items: array(object({ name: string, type: itemType, title: optional(string), description: optional(string), meta: optional(object({ links: record(string) })) })),
  blocks: array(object({ name: string, type: literal('registry:block'), title: optional(string), description: optional(string) })),
});
export type RegistryManifest = ReturnType<typeof registryManifest>;

/** A `registries` entry of components.json: an item URL template with `{name}`, or one with query parameters and headers. Values may hold `${VAR}`. */
export type NamespaceConfig = string | { url: string; params?: Record<string, string>; headers?: Record<string, string> };

const NAMESPACE = '@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?';
const namespaceUrl = refine(string, (url) => url.includes('{name}'), 'a URL with a {name} placeholder');
export const namespaceConfigs: Parser<Record<string, NamespaceConfig>> = (value, path) => {
  const configs = record<NamespaceConfig>((entry, at) =>
    typeof entry === 'string' ? namespaceUrl(entry, at) : object({ url: namespaceUrl, params: optional(record(string)), headers: optional(record(string)) })(entry, at),
  )(value, path);
  const invalid = Object.keys(configs).find((name) => !new RegExp(`^${NAMESPACE}$`).test(name));
  if (invalid !== undefined) throw new ParseError(`${path}.${invalid}: registry names must start with @, such as @acme`);
  return configs;
};

/** The namespaces a project can install from, and the environment their `${VAR}` placeholders read. */
export type Namespaces = { configs: Record<string, NamespaceConfig>; env: Record<string, string | undefined> };

/**
 * `items` memoizes fetched items by URL, so a command that looks at every item and then resolves some of them asks the server once.
 * `namespaces` resolves `@namespace/item` refs.
 */
export type Registry = { url: string; manifest: RegistryManifest; items: Map<string, Promise<RegistryItem>>; namespaces: Namespaces };

/** `SVELTERY_REGISTRY_URL`, then components.json's `registry`, then the production registry. */
export function resolveRegistryUrl(configured: string | undefined): string {
  return (process.env.SVELTERY_REGISTRY_URL || configured || DEFAULT_REGISTRY_URL).replace(/\/+$/, '');
}

/** A GET the CLI sends: the URL, the headers a namespace adds, and the URL errors print, with `${VAR}` placeholders instead of their values. */
export type ItemRequest = { url: string; headers: Record<string, string>; displayUrl: string };

const plainRequest = (url: string): ItemRequest => ({ url, headers: {}, displayUrl: url });

async function fetchJson<T>({ url, headers, displayUrl }: ItemRequest, parser: Parser<T>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  } catch (error) {
    // fetch rejects an invalid header with a TypeError that has no cause and quotes the expanded value.
    const reason = !(error instanceof Error) ? String(error) : error.cause instanceof Error ? error.cause.message : error instanceof TypeError ? 'a header name or value is not valid' : error.message;
    throw new CliError(`Could not reach ${displayUrl}: ${reason}`);
  }
  if (!response.ok) {
    // The /init route explains a rejected preset in `error`. Other registries may send `detail` (RFC 7807) or `message` too.
    const serverMessage = await response.json().then(
      (body: unknown) => {
        const field = (key: string) => {
          const value = (body as Record<string, unknown> | null)?.[key];
          return typeof value === 'string' ? value : undefined;
        };
        const text = field('detail') ?? field('message');
        const error = field('error');
        return error && text ? `[${error}] ${text}` : (text ?? error);
      },
      () => undefined,
    );
    if (response.status === 401 || response.status === 403) {
      const lines = [`You are not authorized to access the item at ${displayUrl}. If this is a remote registry, you may need to authenticate.`, serverMessage, 'Check your authentication credentials and environment variables.'];
      throw new CliError(lines.filter(Boolean).join('\n'));
    }
    throw new CliError(`${`GET ${displayUrl} failed with ${response.status} ${response.statusText}`.trimEnd()}${serverMessage ? `: ${serverMessage}` : ''}`);
  }
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new CliError(`${displayUrl} did not return JSON`);
  }
  try {
    return parser(json, '');
  } catch (error) {
    if (error instanceof ParseError) throw new CliError(`${displayUrl} is not a valid registry response. ${error.message}`);
    throw error;
  }
}

export async function openRegistry(url: string, namespaces: Namespaces = { configs: {}, env: process.env }): Promise<Registry> {
  const index = plainRequest(`${url}/index.json`);
  const { registryVersion } = await fetchJson(index, object({ registryVersion: number }));
  if (registryVersion > REGISTRY_VERSION) {
    throw new CliError(`The registry at ${url} uses format version ${registryVersion}, and this CLI reads version ${REGISTRY_VERSION}. Update it with \`npx @sveltery/ui@latest\`.`);
  }
  return { url, manifest: await fetchJson(index, registryManifest), items: new Map(), namespaces };
}

export function fetchTheme(registry: Registry, baseColor: BaseColor): Promise<RegistryItem> {
  return fetchJson(plainRequest(`${registry.url}/themes/${baseColor}.json`), registryItem);
}

/**
 * A command-line argument or a `registryDependencies` entry: an item of the configured style, any item URL,
 * or `@namespace/name`, an item of a registry that components.json's `registries` names.
 */
export type ItemRef = { kind: 'name'; name: string } | { kind: 'url'; url: string } | { kind: 'namespaced'; namespace: string; name: string };

/** The built-in namespace: Sveltery UI's own registry, in the project's style, unless `registries` sets it. */
const BUILTIN_NAMESPACE = '@sveltery';

export function parseItemRef(value: string): ItemRef {
  if (/^https?:\/\//.test(value)) return { kind: 'url', url: value };
  if (/^[a-z0-9][a-z0-9-]*$/.test(value)) return { kind: 'name', name: value };
  const namespaced = new RegExp(`^(${NAMESPACE})/(.+)$`).exec(value);
  if (namespaced) {
    const name = namespaced[2]!;
    // The name goes into the namespace's URL, next to its credentials.
    if (name.includes('${') || /[?#]/.test(name) || name.split(/[\\/]/).some((segment) => /^(\.|%2e){2}$/i.test(segment))) {
      throw new CliError(`"${value}" is not a valid item name. An @namespace/item name cannot contain "\${", "?", "#" or a ".." segment.`);
    }
    return { kind: 'namespaced', namespace: namespaced[1]!, name };
  }
  throw new CliError(`"${value}" is neither an item name, an @namespace/item name, nor an http(s) URL.`);
}

const ENV_VAR = /\$\{(\w+)\}/g;

function namespaceRequest({ configs, env }: Namespaces, style: StyleName, namespace: string, name: string): ItemRequest {
  const config = configs[namespace];
  if (!config) {
    throw new CliError(`Unknown registry "${namespace}". Make sure it is defined under "registries" in your components.json file:\n{\n  "registries": {\n    "${namespace}": "[URL_TO_REGISTRY]"\n  }\n}`);
  }
  const { url, params = {}, headers = {} } = typeof config === 'string' ? { url: config } : config;
  const templates = [url, ...Object.values(params), ...Object.values(headers)];
  const missing = [...new Set(templates.flatMap((template) => [...template.matchAll(ENV_VAR)].map((match) => match[1]!)))].filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new CliError(`Registry "${namespace}" requires the following environment variables:\n\n${missing.map((key) => `  • ${key}`).join('\n')}\n\nSet the required environment variables to your .env or .env.local file.`);
  }
  const expand = (template: string) => template.replace(ENV_VAR, (_, key: string) => env[key] ?? '');
  // `{style}` goes in first: a style name holds no placeholder, and the item name is never scanned for one.
  const itemUrl = (fill: (template: string) => string) => {
    const query = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, fill(value)])).toString();
    const base = fill(url).replace('{style}', () => style).replace('{name}', () => name);
    return query ? `${base}${base.includes('?') ? '&' : '?'}${query}` : base;
  };
  return {
    url: itemUrl(expand),
    headers: Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, expand(value)])),
    // URLSearchParams escapes `${VAR}` in params, so unescape it to print it as written.
    displayUrl: itemUrl((template) => template).replace(/%24%7B(\w+)%7D/g, '${$1}'),
  };
}

/** Where `ref` is served, and the headers its namespace sends. */
export function itemRequest(registry: Registry, style: StyleName, ref: ItemRef): ItemRequest {
  switch (ref.kind) {
    case 'url':
      return plainRequest(ref.url);
    case 'name':
      return plainRequest(`${registry.url}/styles/${style}/${ref.name}.json`);
    case 'namespaced':
      if (ref.namespace === BUILTIN_NAMESPACE && !registry.namespaces.configs[BUILTIN_NAMESPACE]) return itemRequest(registry, style, { kind: 'name', name: ref.name });
      return namespaceRequest(registry.namespaces, style, ref.namespace, ref.name);
  }
}

export function fetchItem(registry: Registry, style: StyleName, ref: ItemRef): Promise<RegistryItem> {
  const request = itemRequest(registry, style, ref);
  const cached = registry.items.get(request.url);
  if (cached) return cached;
  const fetched = fetchJson(request, registryItem);
  registry.items.set(request.url, fetched);
  return fetched;
}

/** The item exactly as the registry serves it, after checking that the CLI can read it. Not cached: `view` fetches each item once. */
export function fetchRawItem(registry: Registry, style: StyleName, ref: ItemRef): Promise<unknown> {
  return fetchJson(itemRequest(registry, style, ref), (json, path) => (registryItem(json, path), json));
}

/** Throws when a named ref is not in the registry's manifest, before any item is fetched. URLs are not checked. */
export function assertListed(registry: Registry, refs: ItemRef[]): void {
  const known = new Set([...registry.manifest.items, ...registry.manifest.blocks].map((item) => item.name));
  const unknown = refs.flatMap((ref) => (ref.kind === 'name' && !known.has(ref.name) ? [ref.name] : []));
  if (unknown.length > 0) throw new CliError(`Not in the registry: ${unknown.join(', ')}. Available items: ${[...known].join(', ')}.`);
}

/** Fetches `refs` and their registry dependencies, each item once, dependencies before the items that need them. */
export async function resolveItems(registry: Registry, style: StyleName, refs: ItemRef[]): Promise<RegistryItem[]> {
  assertListed(registry, refs);
  const ordered: RegistryItem[] = [];
  const visited = new Set<string>();
  const visit = async (ref: ItemRef): Promise<void> => {
    const { url } = itemRequest(registry, style, ref);
    if (visited.has(url)) return;
    visited.add(url);
    const item = await fetchItem(registry, style, ref);
    for (const dependency of item.registryDependencies ?? []) await visit(parseItemRef(dependency));
    if (!ordered.some((other) => other.name === item.name)) ordered.push(item);
  };
  for (const ref of refs) await visit(ref);
  return ordered;
}
