import { DEFAULT_REGISTRY_URL } from './constants.js';
import { array, CliError, literal, number, object, optional, ParseError, record, refine, string, type Parser } from './parse.js';
import { PRESET_MENU_ACCENTS, PRESET_MENU_COLORS } from './preset/preset.js';
import { assertRoot, assertUniqueNames, installableItem, ownItems, rewriteFiles, sourceOf, sourceRegistry, type SourceRegistry } from './source.js';

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
  rtl: optional(literal(true, false)),
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
  docs: optional(string),
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

/** The built-in namespace: Sveltery UI's own registry, in the project's style. `registries` cannot set it. */
export const BUILTIN_NAMESPACE = '@sveltery';

const NAMESPACE = '@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?';
const namespaceUrl = refine(string, (url) => url.includes('{name}'), 'a URL with a {name} placeholder');
export const namespaceConfigs: Parser<Record<string, NamespaceConfig>> = (value, path) => {
  const configs = record<NamespaceConfig>((entry, at) =>
    typeof entry === 'string' ? namespaceUrl(entry, at) : object({ url: namespaceUrl, params: optional(record(string)), headers: optional(record(string)) })(entry, at),
  )(value, path);
  const invalid = Object.keys(configs).find((name) => !new RegExp(`^${NAMESPACE}$`).test(name));
  if (invalid !== undefined) throw new ParseError(`${path}.${invalid}: registry names must start with @, such as @acme`);
  if (BUILTIN_NAMESPACE in configs) throw new CliError(`"${BUILTIN_NAMESPACE}" is a built-in registry and cannot be overridden.`);
  return configs;
};

/** The namespaces a project can install from, and the environment their `${VAR}` placeholders read. */
export type Namespaces = { configs: Record<string, NamespaceConfig>; env: Record<string, string | undefined> };

/**
 * `items` memoizes fetched items by `itemKey`, so a command that looks at every item and then resolves some of them asks the server once.
 * `gitHubRegistries` memoizes the root registry.json of each GitHub repository and ref by URL, so its items read it once.
 * `namespaces` resolves `@namespace/item` refs.
 */
export type Registry = { url: string; manifest: RegistryManifest; items: Map<string, Promise<RegistryItem>>; gitHubRegistries: Map<string, Promise<SourceRegistry>>; namespaces: Namespaces };

/** `SVELTERY_REGISTRY_URL`, then components.json's `registry`, then the production registry. */
export function resolveRegistryUrl(configured: string | undefined): string {
  return (process.env.SVELTERY_REGISTRY_URL || configured || DEFAULT_REGISTRY_URL).replace(/\/+$/, '');
}

/** A GET the CLI sends: the URL, the headers a namespace adds, and the URL errors print, with `${VAR}` placeholders instead of their values. */
export type ItemRequest = { url: string; headers: Record<string, string>; displayUrl: string };

export const plainRequest = (url: string): ItemRequest => ({ url, headers: {}, displayUrl: url });

async function fetchOk({ url, headers, displayUrl }: ItemRequest): Promise<Response> {
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
  return response;
}

async function fetchJson<T>(request: ItemRequest, parser: Parser<T>): Promise<T> {
  const response = await fetchOk(request);
  const { displayUrl } = request;
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
  return { url, manifest: await fetchJson(index, registryManifest), items: new Map(), gitHubRegistries: new Map(), namespaces };
}

export function fetchTheme(registry: Registry, baseColor: BaseColor): Promise<RegistryItem> {
  return fetchJson(plainRequest(`${registry.url}/themes/${baseColor}.json`), registryItem);
}

/**
 * A command-line argument or a `registryDependencies` entry: an item of the configured style, any item URL,
 * `@namespace/name`, an item of a registry that components.json's `registries` names, or `owner/repo/name#ref`, an item of a GitHub registry.
 */
export type ItemRef =
  | { kind: 'name'; name: string }
  | { kind: 'url'; url: string }
  | { kind: 'namespaced'; namespace: string; name: string }
  | { kind: 'github'; source: GitHubSource; name: string };
type GitHubItemRef = Extract<ItemRef, { kind: 'github' }>;

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
  const hash = value.indexOf('#');
  const [owner = '', repo = '', ...item] = (hash === -1 ? value : value.slice(0, hash)).split('/');
  const name = item.join('/');
  if (name && isGitHubRepository(owner, repo)) return { kind: 'github', source: { owner, repo, ...(hash !== -1 && { ref: gitHubRef(value, hash, 'item address') }) }, name };
  throw new CliError(`"${value}" is neither an item name, an @namespace/item name, nor an http(s) URL.`);
}

const ENV_VAR = /\$\{(\w+)\}/g;

export function namespaceRequest({ configs, env }: Namespaces, style: StyleName, namespace: string, name: string): ItemRequest {
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

/** Where `ref` is served, and the headers its namespace sends. A GitHub item has no URL of its own: `fetchGitHubItem` builds it from its repository. */
function itemRequest(registry: Registry, style: StyleName, ref: Exclude<ItemRef, GitHubItemRef>): ItemRequest {
  switch (ref.kind) {
    case 'url':
      return plainRequest(ref.url);
    case 'name':
      return plainRequest(`${registry.url}/styles/${style}/${ref.name}.json`);
    case 'namespaced':
      if (ref.namespace === BUILTIN_NAMESPACE) return itemRequest(registry, style, { kind: 'name', name: ref.name });
      return namespaceRequest(registry.namespaces, style, ref.namespace, ref.name);
  }
}

/** What identifies `ref` in one run: its URL, or for a GitHub item its registry.json URL with the item name after `#`. */
function itemKey(registry: Registry, style: StyleName, ref: ItemRef): string {
  return ref.kind === 'github' ? `${gitHubFileRequest(ref.source, 'registry.json').url}#${ref.name}` : itemRequest(registry, style, ref).url;
}

function fetchParsedItem<T>(registry: Registry, style: StyleName, ref: ItemRef, parser: Parser<T>): Promise<T> {
  return ref.kind === 'github' ? fetchGitHubItem(registry, ref, parser) : fetchJson(itemRequest(registry, style, ref), parser);
}

export function fetchItem(registry: Registry, style: StyleName, ref: ItemRef): Promise<RegistryItem> {
  const key = itemKey(registry, style, ref);
  const cached = registry.items.get(key);
  if (cached) return cached;
  const fetched = fetchParsedItem(registry, style, ref, registryItem);
  registry.items.set(key, fetched);
  return fetched;
}

/** The item exactly as the registry serves it, or as a GitHub registry's files make it, after checking that the CLI can read it. Not cached: `view` fetches each item once. */
export function fetchRawItem(registry: Registry, style: StyleName, ref: ItemRef): Promise<unknown> {
  return fetchParsedItem(registry, style, ref, (json, path) => (registryItem(json, path), json));
}

const catalogItem = object({ name: string, type: string, title: optional(string), description: optional(string) });
const searchPagination = object({ total: number, offset: number, limit: number, hasMore: literal(true, false) });
export type SearchPagination = ReturnType<typeof searchPagination>;

/** A registry's catalog: a registry.json, or a dynamic registry's search answer, which has `pagination`. Only the fields `search` reads are checked. */
const registryCatalog = object({ name: string, homepage: string, include: optional(array(string)), items: array(catalogItem), pagination: optional(searchPagination) });
export type RegistryCatalog = ReturnType<typeof registryCatalog>;

/** What `search` forwards to a namespace or URL, so a dynamic registry can filter and page on the server. `types` are full names such as `registry:ui`. */
export type CatalogSearch = { query?: string; types?: string[]; limit?: number; offset?: number };

/** `request` with the search as `q`, `type`, `limit` and `offset`, so a dynamic registry can filter and page on the server. */
export function catalogRequest(request: ItemRequest, search: CatalogSearch): ItemRequest {
  const fields = { q: search.query || undefined, type: search.types?.length ? search.types.join(',') : undefined, limit: search.limit, offset: search.offset };
  const entries = Object.entries(fields).flatMap(([key, value]): [string, string][] => (value === undefined ? [] : [[key, String(value)]]));
  // As upstream, each field replaces a parameter of the same name. The display URL keeps `${VAR}` unparsed, so it appends them.
  // A URL that does not parse goes to fetch as it is, which reports it.
  const url = URL.canParse(request.url) ? new URL(request.url) : undefined;
  for (const [key, value] of entries) url?.searchParams.set(key, value);
  const query = new URLSearchParams(entries).toString();
  const displayUrl = query ? `${request.displayUrl}${request.displayUrl.includes('?') ? '&' : '?'}${query}` : request.displayUrl;
  return { ...request, url: url && entries.length > 0 ? url.toString() : request.url, displayUrl };
}

export function fetchCatalog(request: ItemRequest): Promise<RegistryCatalog> {
  return fetchJson(request, registryCatalog);
}

/** A GitHub repository whose root `registry.json` is a registry, written `owner/repo` or `owner/repo#ref`. */
export type GitHubSource = { owner: string; repo: string; ref?: string };

const GITHUB_OWNER = /^(?!.*--)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const GITHUB_REPO = /^[a-zA-Z0-9._-]+$/;

const isGitHubRepository = (owner: string, repo: string) => GITHUB_OWNER.test(owner) && GITHUB_REPO.test(repo) && repo !== '.' && repo !== '..';

/** The ref after `#` at `hash` in `value`, or an error when it could not name a branch, tag or commit. `address` is what upstream calls `value` in the error. */
function gitHubRef(value: string, hash: number, address: 'registry source' | 'item address'): string {
  const ref = value.slice(hash + 1);
  // A . or .. segment would resolve, in the URL, into another repository.
  // eslint-disable-next-line no-control-regex -- a ref goes into a URL, so control characters are rejected as upstream does.
  if (!ref || /[\x00-\x1F\x7F\s]/.test(ref) || ref.startsWith('-') || ref.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new CliError(`Invalid GitHub ref in ${address} "${value}". Use a non-empty branch, tag, or commit SHA without whitespace, control characters, leading dashes, or . or .. segments.`);
  }
  return ref;
}

/** Upstream's reading of a GitHub source: undefined when `value` is not one, and an error when its ref could not name a branch, tag or commit. */
export function parseGitHubSource(value: string): GitHubSource | undefined {
  const hash = value.indexOf('#');
  const parts = (hash === -1 ? value : value.slice(0, hash)).split('/');
  if (parts.length !== 2) return undefined;
  const [owner, repo] = parts as [string, string];
  if (!isGitHubRepository(owner, repo)) return undefined;
  return hash === -1 ? { owner, repo } : { owner, repo, ref: gitHubRef(value, hash, 'registry source') };
}

const encodePath = (path: string) => path.split('/').map((segment) => encodeURIComponent(segment)).join('/');

/** The file at `path` from the repository's root, at `ref` or at the default branch. */
export function gitHubFileRequest({ owner, repo, ref = 'HEAD' }: GitHubSource, path: string): ItemRequest {
  return plainRequest(`https://raw.githubusercontent.com/${owner}/${repo}/${encodePath(ref)}/${encodePath(path)}`);
}

/** The item `name` of a GitHub registry, read by `parser`: its entry in the root registry.json, with each file read from the repository at the same ref, as upstream's `fetchGitHubRegistryItem`. */
async function fetchGitHubItem<T>(registry: Registry, { source, name }: GitHubItemRef, parser: Parser<T>): Promise<T> {
  const catalog = gitHubFileRequest(source, 'registry.json');
  let loading = registry.gitHubRegistries.get(catalog.url);
  if (!loading) {
    loading = fetchJson(catalog, sourceRegistry);
    registry.gitHubRegistries.set(catalog.url, loading);
  }
  const root = await loading;
  if (root.include?.length) throw new CliError(`Registry ${source.owner}/${source.repo} uses "include", which the CLI does not resolve in a GitHub registry yet.`);
  assertRoot(root, `${source.owner}/${source.repo}#${source.ref ?? 'HEAD'}/registry.json`);
  const items = ownItems(root, 'registry.json', '.');
  assertUniqueNames(items);
  const item = items.find((entry) => entry.name === name);
  if (!item) throw new CliError(`Registry item "${name}" was not found. Check that the item name exists in the resolved registry catalog.`);
  const contents = await Promise.all(
    rewriteFiles(item, '.').map(({ path }, index) =>
      fetchOk(gitHubFileRequest(source, path)).then(
        (response) => response.text(),
        (error: unknown) => {
          if (!(error instanceof CliError)) throw error;
          throw new CliError(`Failed to read file "${item.files[index]!.path}" for registry item "${name}" (${sourceOf(item)}). Expected file at ${path}. ${error.message}`);
        },
      ),
    ),
  );
  return installableItem(item, '.', contents, parser);
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
    const key = itemKey(registry, style, ref);
    if (visited.has(key)) return;
    visited.add(key);
    const item = await fetchItem(registry, style, ref);
    for (const dependency of item.registryDependencies ?? []) await visit(parseItemRef(dependency));
    if (!ordered.some((other) => other.name === item.name)) ordered.push(item);
  };
  for (const ref of refs) await visit(ref);
  return ordered;
}
