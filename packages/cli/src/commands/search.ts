import fuzzysort from 'fuzzysort';
import { openCatalog } from '../items.js';
import { CliError } from '../parse.js';
import { itemTypeNames, type Registry } from '../registry.js';

/** Shaped like shadcn's search result item. `addCommandArgument` is what `add` takes: a bare name, because `add` has no namespaced addresses. */
export type SearchItem = { name: string; title?: string; type: string; description?: string; registry: string; addCommandArgument: string };
export type SearchResults = { pagination: { total: number; offset: number; limit: number; hasMore: boolean }; items: SearchItem[] };
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

/** The registry's address as `search` takes it. Namespaced registries are not supported yet, so there is exactly one. */
const registryAddress = (registry: Registry) => `@${registry.manifest.name}`;

function selectRegistries(registry: Registry, requested: string[]): string[] {
  const address = registryAddress(registry);
  const unknown = requested.filter((value) => value !== address);
  if (unknown.length > 0) throw new CliError(`Unknown registry ${unknown.map((value) => `"${value}"`).join(', ')}. The only registry is ${address}.`);
  return [address];
}

const itemsOf = (registry: Registry): SearchItem[] =>
  [...registry.manifest.items, ...registry.manifest.blocks].map((entry) => ({
    name: entry.name,
    ...(entry.title !== undefined && { title: entry.title }),
    type: entry.type,
    ...(entry.description !== undefined && { description: entry.description }),
    registry: registryAddress(registry),
    addCommandArgument: entry.name,
  }));

export function searchItems(registry: Registry, { query, types, limit, offset }: { query?: string; types?: string[]; limit?: number; offset?: number }): SearchResults {
  let items = itemsOf(registry);
  if (types) items = items.filter((item) => types.includes(shortType(item.type)));
  if (query) items = fuzzysort.go(query, items, { keys: ['name', 'title', 'description'], threshold: -10000, limit: items.length }).map((result) => result.obj);
  const start = offset ?? 0;
  const size = limit || items.length;
  return { pagination: { total: items.length, offset: start, limit: size, hasMore: start + size < items.length }, items: items.slice(start, start + size) };
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
  if (items.length === 0) return `No items found${scope(filters, registries)}.`;
  const lines = [
    `Found ${pagination.total} item${pagination.total === 1 ? '' : 's'}${scope(filters, registries)}`,
    `Showing ${pagination.offset + 1}-${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total}`,
    '',
    ...items.map((item) => `- ${item.addCommandArgument} (${shortType(item.type)})${item.description ? ` — ${shortDescription(item.description)}` : ''}`),
  ];
  if (pagination.hasMore) lines.push('', `More items available. Use --offset ${pagination.offset + pagination.limit} to see the next page.`);
  return lines.join('\n');
}

/** Prints the registry's items matching the filters, as upstream's `search` does, and returns them. */
export async function search(requested: string[], options: SearchOptions): Promise<SearchResults> {
  const filters = { query: options.query, types: parseTypes(options.type) };
  const limit = parseCount('--limit', options.limit);
  const offset = parseCount('--offset', options.offset);
  const { registry } = await openCatalog(options.cwd);
  const registries = selectRegistries(registry, requested);
  const results = searchItems(registry, { ...filters, limit, offset });
  console.log(options.json ? JSON.stringify(results, null, 2) : formatResults(results, filters, registries));
  return results;
}
