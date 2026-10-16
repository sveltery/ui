// A relative path, not `@sveltery/ui/preset`: vite.config.ts builds the registry, and Vite leaves package imports of a config to Node, which cannot load the package's .ts source.
import { PRESET_FONT_DEFINITIONS, type PresetFont, type PresetFontDefinition } from '../../../packages/cli/src/preset/index.js';
import type { RegistryItem } from './types';

/**
 * Port of upstream's `apps/v4/registry/fonts.ts`: a body item and a heading item per preset font. Every preset font is a
 * Google font on the latin subset, and `next/font/google` exports it under its title with `_` for spaces.
 */
function fontItem(name: PresetFont, definition: PresetFontDefinition, role: 'body' | 'heading', origin: string): RegistryItem {
  return {
    $schema: `${origin}/schema/registry-item.json`,
    name: role === 'body' ? `font-${name}` : `font-heading-${name}`,
    title: role === 'body' ? definition.title : `${definition.title} (Heading)`,
    type: 'registry:font',
    font: {
      family: definition.family,
      provider: 'google',
      variable: role === 'body' ? definition.variable : '--font-heading',
      ...(definition.weight && { weight: [...definition.weight] }),
      subsets: ['latin'],
      import: definition.title.replaceAll(' ', '_'),
      dependency: definition.dependency,
    },
    files: [],
  };
}

export function fontItems(origin: string): RegistryItem[] {
  const fonts = Object.entries(PRESET_FONT_DEFINITIONS) as [PresetFont, PresetFontDefinition][];
  return (['body', 'heading'] as const).flatMap((role) => fonts.map(([name, definition]) => fontItem(name, definition, role, origin)));
}
