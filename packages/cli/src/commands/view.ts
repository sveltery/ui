import { openCatalog } from '../items.js';
import { assertListed, fetchItem, parseItemRef, type RegistryItem } from '../registry.js';

/** Prints the registry items named by `inputs` (names or URLs) as one JSON array, in argument order, and returns them. Dependencies are not resolved. */
export async function view(inputs: string[], options: { cwd: string }): Promise<RegistryItem[]> {
  const { registry, style } = await openCatalog(options.cwd);
  const refs = inputs.map(parseItemRef);
  assertListed(registry, refs);
  const items = await Promise.all(refs.map((ref) => fetchItem(registry, style, ref)));
  console.log(JSON.stringify(items, null, 2));
  return items;
}
