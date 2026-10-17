import fuzzysort from 'fuzzysort';
import { catalogStyle, openCatalog } from '../items.js';
import { CliError } from '../parse.js';
import { BUILTIN_NAMESPACE, catalogRequest, fetchCatalog, itemTypeNames, type CatalogSearch, type ItemRequest, type Registry, type SearchPagination } from '../registry.js';

/** Shaped like shadcn's search result item. `addCommandArgument` is what `add` takes: `@namespace/name`, or the bare name for the built-in `@sveltery`. */
export type SearchItem = { name: string; title?: string; type: string; description?: string; registry: string; addCommandArgument: string };
export type SearchResults = { pagination: SearchPagination; items: SearchItem[] };
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

function selectRegistries(registry: Registry, requested: string[]): string[] {
  const known = [...new Set([BUILTIN_NAMESPACE, ...Object.keys(registry.namespaces.configs)])];
  const addresses = requested.length > 0 ? [...new Set(requested)] : [BUILTIN_NAMESPACE];
  const unknown = addresses.filter((address) => !known.includes(address));
  if (unknown.length > 0) {
    throw new CliError(`Unknown registry ${unknown.map((value) => `"${value}"`).join(', ')}. The registries you can search are ${known.join(', ')}. Define a namespace under "registries" in your components.json file to search it.`);
  }
  return addresses;
}

/** One searched registry: its items, and `pagination` when a dynamic registry filtered and paged them itself. */
type Source = { items: SearchItem[]; pagination?: SearchPagination };

const toSearchItem = (entry: { name: string; title?: string; type: string; description?: string }, registry: string, addCommandArgument: string): SearchItem => ({
  name: entry.name,
  ...(entry.title !== undefined && { title: entry.title }),
  type: entry.type,
  ...(entry.description !== undefined && { description: entry.description }),
  registry,
  addCommandArgument,
});

/** Without a request, the registry is the built-in `@sveltery`, read from the manifest that `index.json` already holds. */
async function readSource(registry: Registry, address: string, request: ItemRequest | undefined): Promise<Source> {
  if (!request) return { items: [...registry.manifest.items, ...registry.manifest.blocks].map((entry) => toSearchItem(entry, address, entry.name)) };
  const catalog = await fetchCatalog(request, address);
  return { items: catalog.items.map((entry) => toSearchItem(entry, address, `${address}/${entry.name}`)), ...(catalog.pagination && { pagination: catalog.pagination }) };
}

/**
 * Merges the sources as shadcn does. A single dynamic registry's page is returned as it is. Otherwise the other registries' items
 * are filtered and ranked here, follow the dynamic registries' items, and are paged together.
 */
export function searchItems(sources: Source[], { query, types, limit, offset }: { query?: string; types?: string[]; limit?: number; offset?: number }): SearchResults {
  const served = sources.flatMap(({ items, pagination }) => (pagination ? [{ items, pagination }] : []));
  if (sources.length === 1 && served.length === 1) return served[0]!;
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
  const { pagination, items } = results;
  const from = (item: SearchItem) => (registries.length > 1 ? ` · ${item.registry}` : '');
  if (items.length === 0) return `No items found${scope(filters, registries)}.`;
  const lines = [
    `Found ${pagination.total} item${pagination.total === 1 ? '' : 's'}${scope(filters, registries)}`,
    `Showing ${pagination.offset + 1}-${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total}`,
    '',
    ...items.map((item) => `- ${item.addCommandArgument} (${shortType(item.type)})${from(item)}${item.description ? ` — ${shortDescription(item.description)}` : ''}`),
  ];
  if (pagination.hasMore) lines.push('', `More items available. Use --offset ${pagination.offset + pagination.limit} to see the next page.`);
  return lines.join('\n');
}

/** Prints the items of the registries matching the filters, as upstream's `search` does, and returns them. */
export async function search(requested: string[], options: SearchOptions): Promise<SearchResults> {
  const filters = { query: options.query, types: parseTypes(options.type) };
  const limit = parseCount('--limit', options.limit);
  const offset = parseCount('--offset', options.offset);
  const { registry, style } = await openCatalog(options.cwd);
  const registries = selectRegistries(registry, requested);
  // One registry pages on the server. Several are asked for every item up to the end of the page, which is then cut here.
  const types = filters.types?.map((type) => `registry:${type}`);
  const forwarded: CatalogSearch =
    registries.length === 1 ? { query: filters.query, types, limit, offset } : { query: filters.query, types, limit: limit === undefined ? undefined : (offset ?? 0) + limit };
  // A Sveltery registry serves index.json, not a registry.json for each style, so the default search reads the manifest even when `registries` sets `@sveltery`.
  const readsManifest = (address: string) => address === BUILTIN_NAMESPACE && (requested.length === 0 || !registry.namespaces.configs[BUILTIN_NAMESPACE]);
  // Every request is built, and so every environment variable checked, before any is sent.
  const requests = registries.map((address) => (readsManifest(address) ? undefined : catalogRequest(registry, catalogStyle(style), address, forwarded)));
  const sources = await Promise.all(registries.map((address, index) => readSource(registry, address, requests[index])));
  const results = searchItems(sources, { ...filters, limit, offset });
  console.log(options.json ? JSON.stringify(results, null, 2) : formatResults(results, filters, registries));
  return results;
}
