import { json } from '@sveltejs/kit';
import type { CssVars } from '../../../registry/types';
import { site } from '../../lib/site';
import { buildInitItem } from './item';
import { parseInitQuery, type ServedTheme } from './query';

/** Reads a file the site serves, such as `/r/themes/neutral.json`. */
export type ReadServed = (path: string) => Promise<Response>;

/**
 * Turns preset params into one `registry:base` item, as shadcn's `/init` route does. Published CLIs call this URL, so its
 * params and the item's shape are a public API. It reads the prerendered `/r/themes` JSON instead of bundling it, to stay
 * cheap on the Worker.
 */
export async function respondInit(url: URL, read: ReadServed): Promise<Response> {
  const parsed = parseInitQuery(url.searchParams);
  if (!parsed.ok) return json({ error: parsed.error }, { status: 400 });

  const { config } = parsed.request;
  const names = [...new Set<ServedTheme>([config.baseColor, config.theme, config.chartColor])];
  const colors: Partial<Record<ServedTheme, CssVars>> = {};
  for (const [name, response] of await Promise.all(names.map(async (name) => [name, await read(`/r/themes/${name}.json`)] as const))) {
    if (!response.ok) return json({ error: `Could not read the ${name} theme (${response.status})` }, { status: 500 });
    colors[name] = ((await response.json()) as { cssVars: CssVars }).cssVars;
  }

  return json(buildInitItem(parsed.request, colors, site.url), { headers: { 'cache-control': 'public, max-age=3600' } });
}
