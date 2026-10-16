import { name as cli } from '@sveltery/ui/package.json';
import { PRESET_THEMES, type PresetTheme } from '@sveltery/ui/preset';
import { registry } from '$lib/registry.server';
import { BASE_COLORS } from '$lib/create/config';
import type { PageServerLoad } from './$types';

type ThemeItem = { cssVars: { dark: Record<string, string> } };

/** The dot each color picker shows: a base color's muted foreground, or an accent's primary, in dark mode, as upstream. */
function swatch(theme: PresetTheme): string | undefined {
  const item = registry.get(`themes/${theme}.json`) as ThemeItem | undefined;
  return item?.cssVars.dark[(BASE_COLORS as readonly string[]).includes(theme) ? 'muted-foreground' : 'primary'];
}

export const load: PageServerLoad = () => ({
  cli,
  swatches: Object.fromEntries(PRESET_THEMES.map((theme) => [theme, swatch(theme)])) as Partial<Record<PresetTheme, string>>,
});
