import { existsSync } from 'node:fs';
import { join } from 'node:path';
import fuzzysort from 'fuzzysort';
import { CONFIG_FILE } from '../config.js';
import { catalogStyle, readCatalog } from '../items.js';
import { CliError } from '../parse.js';
import {
  BUILTIN_NAMESPACE,
  catalogRequest,
  fetchCatalog,
  gitHubCatalogRequest,
  itemTypeNames,
  namespaceRequest,
  openRegistry,
  parseGitHubSource,
  plainRequest,
  type CatalogSearch,
  type GitHubSource,
  type ItemRequest,
  type Namespaces,
  type RegistryManifest,
  type SearchPagination,
} from '../registry.js';

/** Shaped like shadcn's search result item. `addCommandArgument` is what `add` takes: `@namespace/name`, or the bare name for the built-in `@sveltery`. */
export type SearchItem = { name: string; title?: string; type: string; description?: string; registry: string; addCommandArgument: string };
/** `errors` names the registries that a search of every registry skipped, as upstream does. */
export type SearchResults = { pagination: SearchPagination; items: SearchItem[]; errors?: { registry: string; message: string }[] };
export type SearchOptions = { cwd: string; query?: string; type?: string; limit?: string; offset?: string; json: boolean };

const shortType = (type: string) => type.replace(/^registry:/, '');
const SEARCHABLE_TYPES = itemTypeNames.map(shortType);

/** Comma-separated types, in the short (`ui`) or full (`registry:ui`) form, case-insensitive. */
function parseTypes(value: string | undefined): string[] | undefined {
  const types = value?.split(',').map((type) => type.trim()).filter(Boolean);
  if (!types?.length) return undefined;
  const unknown = types.filter((type) => !SEARCHABLE_TYPES.includes(shortType(type).toLowerCase()));
  if (unknown.length > 0) throw new CliError(`Unknown ${unknown.length === 1 ? 'type' : 'types'}: ${unknown.join(', ')}. Valid types: ${SEARCHABLE_TYPES.join(', ')}.`);
  return types.map((type) => shortType(type).toLowerCase());
}

function parseCount(flag: string, value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) throw new CliError(`${flag} must be a whole number, got "${value}".`);
  return Number(value);
}

/** At most this many registries are fetched at once, as upstream caps it. */
export const SEARCH_CONCURRENCY = 8;

/** Like `Promise.allSettled` of `fn` over `items`, in their order, but with at most `limit` running at once, as upstream's `mapSettledWithConcurrency`. */
async function mapSettled<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = { status: 'fulfilled', value: await fn(items[index]!) };
      } catch (reason) {
        results[index] = { status: 'rejected', reason };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const SEARCH_EXAMPLE = '`npx @sveltery/ui@latest search @sveltery`';

const isUrl = (value: string) => /^https?:\/\//.test(value);

/** Throws, before any request, for an argument that is no URL, GitHub source or namespace that components.json defines. */
function assertSearchable(namespaces: Namespaces, requested: string[]): void {
  const invalid = requested.find((address) => !address.startsWith('@') && !isUrl(address) && !parseGitHubSource(address));
  if (invalid !== undefined) throw new CliError(`Invalid registry namespace: "${invalid}". Registry names must start with @ (e.g., @sveltery, @acme), or pass a registry URL or a GitHub source such as owner/repo.`);
  const known = [...new Set([BUILTIN_NAMESPACE, ...Object.keys(namespaces.configs)])];
  const unknown = requested.filter((address) => address.startsWith('@') && !known.includes(address));
  if (unknown.length > 0) {
    throw new CliError(`Unknown registry ${unknown.map((value) => `"${value}"`).join(', ')}. The namespaces you can search are ${known.join(', ')}. Define a namespace under "registries" in your components.json file to search it.`);
  }
}

/** A registry to search, by how it is read: the built-in `@sveltery` from its manifest, or a catalog fetched from a namespace, a URL or a GitHub repository. */
type Target =
  | { kind: 'manifest'; address: string }
  | { kind: 'namespace' | 'url'; address: string; request: ItemRequest }
  | { kind: 'github'; address: string; request: ItemRequest; source: GitHubSource };

/** One searched registry: its items, and `pagination` when a dynamic registry filtered and paged them itself. */
type Source = { items: SearchItem[]; pagination?: SearchPagination };

/** The argument `add` takes for the item `name` of `target`, as upstream's `buildRegistryItemNameFromRegistry` builds it. */
function addCommandArgument(target: Target, name: string): string {
  switch (target.kind) {
    case 'manifest':
      return name;
    case 'namespace':
      return `${target.address}/${name}`;
    case 'github':
      return `${target.source.owner}/${target.source.repo}/${name}${target.source.ref ? `#${target.source.ref}` : ''}`;
    case 'url':
      return itemUrl(target.address, name);
  }
}

/** The registry URL with its last `registry` path segment, and every `registry` word of its query, replaced by the item name. */
function itemUrl(url: string, name: string): string {
  const hostEnd = url.indexOf('/', url.indexOf('://') + 3);
  if (hostEnd === -1) {
    const queryStart = url.indexOf('?', url.indexOf('://') + 3);
    return queryStart === -1 ? url : url.slice(0, queryStart) + url.slice(queryStart).replace(/\bregistry\b/g, name);
  }
  const rest = url.slice(hostEnd);
  const pathEnd = rest.includes('?') ? rest.indexOf('?') : rest.length;
  const path = rest.slice(0, pathEnd);
  const last = path.lastIndexOf('registry');
  const named = last === -1 ? path : path.slice(0, last) + name + path.slice(last + 'registry'.length);
  return url.slice(0, hostEnd) + named + rest.slice(pathEnd).replace(/\bregistry\b/g, name);
}

const toSearchItem = (entry: { name: string; title?: string; type: string; description?: string }, target: Target): SearchItem => ({
  name: entry.name,
  ...(entry.title !== undefined && { title: entry.title }),
  type: entry.type,
  ...(entry.description !== undefined && { description: entry.description }),
  registry: target.address,
  addCommandArgument: addCommandArgument(target, entry.name),
});

async function readSource(readManifest: () => Promise<RegistryManifest>, target: Target): Promise<Source> {
  if (target.kind === 'manifest') {
    const { items, blocks } = await readManifest();
    return { items: [...items, ...blocks].map((entry) => toSearchItem(entry, target)) };
  }
  const catalog = await fetchCatalog(target.request);
  if (catalog.include?.length) {
    throw new CliError(
      target.kind === 'github'
        ? `Registry ${target.address} uses "include", which search does not resolve in a GitHub registry yet.`
        : `Registry catalog "${target.kind === 'namespace' ? `${target.address}/registry` : target.address}" uses "include", but a registry must serve the resolved catalog. Run \`npx @sveltery/ui@latest build\` and serve the registry.json it writes.`,
    );
  }
  return { items: catalog.items.map((entry) => toSearchItem(entry, target)), ...(catalog.pagination && { pagination: catalog.pagination }) };
}

/**
 * Merges the sources as shadcn does. The page of a dynamic registry searched `alone` is returned as it is. Otherwise the other registries' items
 * are filtered and ranked here, follow the dynamic registries' items, and are paged together.
 */
function searchItems(sources: Source[], alone: boolean, { query, types, limit, offset }: { query?: string; types?: string[]; limit?: number; offset?: number }): SearchResults {
  const served = sources.flatMap(({ items, pagination }) => (pagination ? [{ items, pagination }] : []));
  if (alone && served.length === 1) return served[0]!;
  let items = sources.flatMap((source) => (source.pagination ? [] : source.items));
  if (types) items = items.filter((item) => types.includes(shortType(item.type).toLowerCase()));
  if (query) items = fuzzysort.go(query, items, { keys: ['name', 'title', 'description'], threshold: -10000, limit: items.length }).map((result) => result.obj);
  const all = [...served.flatMap((source) => source.items), ...items];
  const start = offset ?? 0;
  const size = limit || all.length;
  // Each dynamic registry was asked for `offset + limit` items. One that sent fewer has nothing past them.
  const requested = limit === undefined ? undefined : start + limit;
  const serverHasMore = served.some((source) => source.pagination.hasMore && requested !== undefined && source.items.length >= requested);
  const total = served.reduce((sum, source) => sum + source.pagination.total, 0) + items.length;
  return { pagination: { total, offset: start, limit: size, hasMore: start + size < all.length || serverHasMore }, items: all.slice(start, start + size) };
}

const MAX_DESCRIPTION = 80;

function shortDescription(description: string): string {
  const text = description.trim().replace(/\s+/g, ' ');
  if (text.length <= MAX_DESCRIPTION) return text;
  const cut = text.slice(0, MAX_DESCRIPTION - 3).trimEnd();
  const space = cut.lastIndexOf(' ');
  return `${(space > MAX_DESCRIPTION * 0.6 ? cut.slice(0, space) : cut).trimEnd()}...`;
}

function scope({ query, types }: { query?: string; types?: string[] }, registries: string[]): string {
  return `${types ? ` of type ${types.join(', ')}` : ''}${query ? ` matching "${query}"` : ''} in ${registries.join(', ')}`;
}

export function formatResults(results: SearchResults, filters: { query?: string; types?: string[] }, registries: string[]): string {
  const { pagination, items, errors = [] } = results;
  const from = (item: SearchItem) => (registries.length > 1 ? ` · ${item.registry}` : '');
  const skipped = errors.length > 0 ? [...errors.map(({ registry, message }) => `Skipped ${registry}: ${message}`), ''] : [];
  if (items.length === 0) return [...skipped, `No items found${scope(filters, registries)}.`].join('\n');
  const lines = [
    ...skipped,
    `Found ${pagination.total} item${pagination.total === 1 ? '' : 's'}${scope(filters, registries)}`,
    `Showing ${pagination.offset + 1}-${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total}`,
    '',
    ...items.map((item) => `- ${item.addCommandArgument} (${shortType(item.type)})${from(item)}${item.description ? ` — ${shortDescription(item.description)}` : ''}`),
  ];
  if (pagination.hasMore) lines.push('', `More items available. Use --offset ${pagination.offset + pagination.limit} to see the next page.`);
  return lines.join('\n');
}

/**
 * Prints the items of the registries matching the filters, as upstream's `search` does, and returns them.
 * With no registry, it searches every namespace in components.json except the built-in `@sveltery`, skips one that fails, and sets exit code 1 when all fail.
 */
export async function search(requested: string[], options: SearchOptions): Promise<SearchResults> {
  const filters = { query: options.query, types: parseTypes(options.type) };
  const limit = parseCount('--limit', options.limit);
  const offset = parseCount('--offset', options.offset);
  const searchAll = requested.length === 0;
  if (searchAll && !existsSync(join(options.cwd, CONFIG_FILE))) {
    throw new CliError(`Provide a registry or namespace to search, e.g. ${SEARCH_EXAMPLE}.\n\nIf you have a ${CONFIG_FILE} with registries configured, run \`npx @sveltery/ui@latest search\` with no arguments to search all of them.`);
  }
  const { url, namespaces, style } = readCatalog(options.cwd);
  if (!searchAll) assertSearchable(namespaces, requested);
  // As upstream, a registry named twice is searched twice.
  const registries = searchAll ? Object.keys(namespaces.configs).filter((namespace) => namespace !== BUILTIN_NAMESPACE) : requested;
  if (registries.length === 0) throw new CliError(`No registries are configured in ${CONFIG_FILE}.\nProvide a registry or namespace to search, e.g. ${SEARCH_EXAMPLE}.`);
  // One registry pages on the server. Several are asked for every item up to the end of the page, which is then cut here.
  const types = filters.types?.map((type) => `registry:${type}`);
  const forwarded: CatalogSearch =
    registries.length === 1 ? { query: filters.query, types, limit, offset } : { query: filters.query, types, limit: limit === undefined ? undefined : (offset ?? 0) + limit };
  const toTarget = (address: string): Target => {
    if (address === BUILTIN_NAMESPACE && !namespaces.configs[BUILTIN_NAMESPACE]) return { kind: 'manifest', address };
    if (isUrl(address)) return { kind: 'url', address, request: catalogRequest(plainRequest(address), forwarded) };
    // A GitHub registry is a file, with no server to search, so nothing is forwarded.
    const source = parseGitHubSource(address);
    if (source) return { kind: 'github', address, source, request: gitHubCatalogRequest(source) };
    return { kind: 'namespace', address, request: catalogRequest(namespaceRequest(namespaces, catalogStyle(style), address, 'registry'), forwarded) };
  };
  type Outcome = { source: Source } | { error: string };
  // As upstream, a search of every registry skips one that fails, even for a missing environment variable. A search of the
  // registries passed builds every target, and so checks every environment variable, before it sends any request.
  const skip = (error: unknown): { error: string } => {
    if (!searchAll || !(error instanceof CliError)) throw error;
    return { error: error.message };
  };
  const targets = registries.map((address) => {
    try {
      return toTarget(address);
    } catch (error) {
      return skip(error);
    }
  });
  // Sveltery's index.json is fetched only when @sveltery is searched.
  let manifest: Promise<RegistryManifest> | undefined;
  const readManifest = () => (manifest ??= openRegistry(url, namespaces).then((registry) => registry.manifest));
  const settled = await mapSettled(targets, SEARCH_CONCURRENCY, async (target): Promise<Outcome> => ('error' in target ? target : { source: await readSource(readManifest, target) }));
  const outcomes = settled.map((outcome) => (outcome.status === 'fulfilled' ? outcome.value : skip(outcome.reason)));
  const sources = outcomes.flatMap((outcome) => ('source' in outcome ? [outcome.source] : []));
  const errors = outcomes.flatMap((outcome, index) => ('error' in outcome ? [{ registry: registries[index]!, message: outcome.error }] : []));
  const results = { ...searchItems(sources, registries.length === 1, { ...filters, limit, offset }), ...(errors.length > 0 && { errors }) };
  console.log(options.json ? JSON.stringify(results, null, 2) : formatResults(results, filters, registries));
  // As upstream, a search of every registry fails when no registry answered.
  if (errors.length === registries.length) process.exitCode = 1;
  return results;
}
