import { CliError, literal, object, optional, ParseError, string, type InferShape } from './parse.js';
import { baseColors, iconLibraryNames, styleNames, type BaseColor, type IconLibraryName, type StyleName } from './registry.js';

export const CONFIG_FILE = 'components.json';

/** Each style's defaults, from shadcn-svelte's presets. */
export const stylePresets: Record<StyleName, { title: string; hint: string; iconLibrary: IconLibraryName; baseColor: BaseColor }> = {
  nova: { title: 'Nova', hint: 'Reduced spacing for compact layouts.', iconLibrary: 'lucide', baseColor: 'neutral' },
  vega: { title: 'Vega', hint: 'The classic shadcn/ui look.', iconLibrary: 'lucide', baseColor: 'neutral' },
  maia: { title: 'Maia', hint: 'Soft and rounded, with generous spacing.', iconLibrary: 'hugeicons', baseColor: 'neutral' },
  lyra: { title: 'Lyra', hint: 'Boxy and sharp. Pairs well with mono fonts.', iconLibrary: 'phosphor', baseColor: 'neutral' },
  mira: { title: 'Mira', hint: 'Compact. Made for dense interfaces.', iconLibrary: 'hugeicons', baseColor: 'neutral' },
  luma: { title: 'Luma', hint: 'Rounded geometry. Soft elevation. Breathable layouts.', iconLibrary: 'lucide', baseColor: 'neutral' },
  sera: { title: 'Sera', hint: 'Editorial and typographic.', iconLibrary: 'lucide', baseColor: 'taupe' },
  rhea: { title: 'Rhea', hint: 'Like Luma but compact.', iconLibrary: 'lucide', baseColor: 'neutral' },
};

/** `lib` is `#lib` in SvelteKit 3 apps, which map it through package.json `imports`, and `$lib` before that. */
export const defaultAliases = (lib: '$lib' | '#lib') => ({
  components: `${lib}/components`,
  ui: `${lib}/components/ui`,
  utils: `${lib}/utils`,
  lib,
  hooks: `${lib}/hooks`,
});

const configShape = {
  $schema: optional(string),
  style: literal(...styleNames),
  iconLibrary: literal(...iconLibraryNames),
  menuColor: literal('default'),
  tailwind: object({ css: string, baseColor: literal(...baseColors) }),
  aliases: object({ components: string, ui: string, utils: string, lib: string, hooks: string }),
  registry: optional(string),
  typescript: literal(true),
};

/** components.json, in shadcn-svelte's format, limited to what this CLI supports. */
export type Config = InferShape<typeof configShape>;

const hints: Record<string, string> = {
  menuColor: 'Only "default" is supported.',
  typescript: 'Only TypeScript projects are supported.',
};

export function parseConfig(json: unknown): Config {
  try {
    return object(configShape)(json, '');
  } catch (error) {
    if (!(error instanceof ParseError)) throw error;
    const key = error.message.split(/[.:[]/)[0] ?? '';
    throw new CliError(`${CONFIG_FILE} is invalid. ${error.message}. ${hints[key] ?? 'Run `sveltery init` to repair it.'}`.trimEnd());
  }
}
