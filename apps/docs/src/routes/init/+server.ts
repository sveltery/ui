import { error, json } from '@sveltejs/kit';
import type { CssVars } from '../../../registry/types';
import { site } from '../../lib/site';
import { buildInitItem } from './item';
import { parseInitQuery, type ServedTheme } from './query';
import type { RequestHandler } from './$types';

type AssetsBinding = { fetch: (url: URL) => Promise<Response> };

/**
 * Turns preset params into one `registry:base` item, as shadcn's `/init` route does. Published CLIs call this URL, so its
 * params and the item's shape are a public API. It reads the prerendered `/r/themes` JSON instead of bundling it, to stay
 * cheap on the Worker.
 */
export const GET: RequestHandler = async ({ url, fetch, platform }) => {
  const parsed = parseInitQuery(url.searchParams);
  if (!parsed.ok) return json({ error: parsed.error }, { status: 400 });

  // On the Worker, event.fetch would send a prerendered path out over HTTP, so read it from the assets binding.
  const assets = (platform as { env?: { ASSETS?: AssetsBinding } } | undefined)?.env?.ASSETS;
  const read = (path: string) => (assets ? assets.fetch(new URL(path, url)) : fetch(path));

  const { config } = parsed.request;
  const names = [...new Set<ServedTheme>([config.baseColor, config.theme, config.chartColor])];
  const colors = Object.fromEntries(
    await Promise.all(
      names.map(async (name) => {
        const response = await read(`/r/themes/${name}.json`);
        if (!response.ok) error(500, `Could not read the ${name} theme`);
        return [name, ((await response.json()) as { cssVars: CssVars }).cssVars] as const;
      }),
    ),
  );

  return json(buildInitItem(parsed.request, colors, site.url), { headers: { 'cache-control': 'public, max-age=3600' } });
};
