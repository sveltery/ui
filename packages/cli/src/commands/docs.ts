import { openCatalog } from '../items.js';
import { CliError } from '../parse.js';

/** `base` is always `base`: the Base UI variant is the only one, and it keeps the JSON shaped like shadcn's. */
export type DocsResult = { component: string; base: 'base'; links: Record<string, string> };
export type DocsReport = { base: 'base'; results: DocsResult[] };

/** The links the registry's manifest gives each named item, as upstream's `docs` prints them. An item with no links is skipped with a warning. */
export async function docs(components: string[], options: { cwd: string; json: boolean }): Promise<DocsReport> {
  const { registry } = await openCatalog(options.cwd);
  const results: DocsResult[] = [];
  const skipped: string[] = [];
  for (const component of components) {
    const entry = [...registry.manifest.items, ...registry.manifest.blocks].find((item) => item.name === component);
    if (!entry) throw new CliError(`Component ${component} not found in the Sveltery registry.`);
    const links = ('meta' in entry ? entry.meta?.links : undefined) ?? {};
    if (Object.keys(links).length === 0) skipped.push(component);
    else results.push({ component, base: 'base', links });
  }
  const report: DocsReport = { base: 'base', results };
  for (const component of skipped) console.warn(`No documentation links available for ${component}.`);
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return report;
  }
  const width = Math.max(...results.flatMap((result) => Object.keys(result.links).map((key) => key.length)));
  for (const { component, links } of results) {
    console.log(component);
    for (const [key, value] of Object.entries(links)) console.log(`  - ${key.padEnd(width + 2)}${value}`);
    console.log('');
  }
  return report;
}
