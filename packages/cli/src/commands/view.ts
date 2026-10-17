import { catalogStyle, openCatalog } from '../items.js';
import { assertListed, fetchRawItem, parseItemRef } from '../registry.js';

/** Prints the registry items named by `inputs` (names or URLs) as one JSON array, in argument order, exactly as the registry serves them, and returns them. Dependencies are not resolved. */
export async function view(inputs: string[], options: { cwd: string }): Promise<unknown[]> {
  const { registry, style: configured } = await openCatalog(options.cwd);
  const style = catalogStyle(configured);
  const refs = inputs.map(parseItemRef);
  assertListed(registry, refs);
  const items = await Promise.all(refs.map((ref) => fetchRawItem(registry, style, ref)));
  console.log(JSON.stringify(items, null, 2));
  return items;
}
