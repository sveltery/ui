// Labels and icons from shadcn's apps/v4/registry (styles.tsx, themes.ts, config.ts), packages/registry/src/icons/libraries.ts and
// apps/v4/app/(app)/(create)/components at af983e8.
import { PRESET_FONT_DEFINITIONS, type PresetFont, type PresetIconLibrary, type PresetMenuAccent, type PresetMenuColor, type PresetRadius, type PresetStyle, type PresetTheme } from '@sveltery/ui/preset';

/** The markup inside a 24 by 24 (or `viewBox`) SVG. Static and authored here, so rendering it with `{@html}` is safe. */
export type Icon = { viewBox: string; body: string };

export type Option<Value extends string> = { value: Value; label: string; disabled?: boolean };

/** A run of options under an optional heading. Groups are separated in the menu. */
export type OptionGroup<Value extends string> = { label?: string; options: Option<Value>[] };

const stroke = (body: string, width = 2) => `<g stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;

export const STYLES: Record<PresetStyle, { label: string; icon: Icon }> = {
  vega: { label: 'Vega', icon: { viewBox: '0 0 24 24', body: '<path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="2" />' } },
  nova: { label: 'Nova', icon: { viewBox: '0 0 24 24', body: '<path d="M2 12C2 9.19974 2 7.79961 2.54497 6.73005C3.02433 5.78924 3.78924 5.02433 4.73005 4.54497C5.79961 4 7.19974 4 10 4H14C16.8003 4 18.2004 4 19.27 4.54497C20.2108 5.02433 20.9757 5.78924 21.455 6.73005C22 7.79961 22 9.19974 22 12C22 14.8003 22 16.2004 21.455 17.27C20.9757 18.2108 20.2108 18.9757 19.27 19.455C18.2004 20 16.8003 20 14 20H10C7.19974 20 5.79961 20 4.73005 19.455C3.78924 18.9757 3.02433 18.2108 2.54497 17.27C2 16.2004 2 14.8003 2 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />' } },
  maia: { label: 'Maia', icon: { viewBox: '0 0 24 24', body: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />' } },
  lyra: { label: 'Lyra', icon: { viewBox: '0 0 24 24', body: '<path d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z" stroke="currentColor" stroke-width="2" />' } },
  mira: { label: 'Mira', icon: { viewBox: '0 0 24 24', body: '<path d="M5.92089 5.92089C8.15836 3.68342 9.2771 2.56468 10.5857 2.19562C11.5105 1.93479 12.4895 1.93479 13.4143 2.19562C14.7229 2.56468 15.8416 3.68342 18.0791 5.92089C20.3166 8.15836 21.4353 9.2771 21.8044 10.5857C22.0652 11.5105 22.0652 12.4895 21.8044 13.4143C21.4353 14.7229 20.3166 15.8416 18.0791 18.0791C15.8416 20.3166 14.7229 21.4353 13.4143 21.8044C12.4895 22.0652 11.5105 22.0652 10.5857 21.8044C9.2771 21.4353 8.15836 20.3166 5.92089 18.0791C3.68342 15.8416 2.56468 14.7229 2.19562 13.4143C1.93479 12.4895 1.93479 11.5105 2.19562 10.5857C2.56468 9.2771 3.68342 8.15836 5.92089 5.92089Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />' } },
  luma: { label: 'Luma', icon: { viewBox: '0 0 24 24', body: '<path d="M2 12C2 8.134 5.134 5 9 5H15C18.866 5 22 8.134 22 12C22 15.866 18.866 19 15 19H9C5.134 19 2 15.866 2 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />' } },
  sera: { label: 'Sera', icon: { viewBox: '0 0 24 24', body: '<rect x="3" y="3" width="18" height="18" stroke="currentColor" stroke-width="2" />' } },
  rhea: { label: 'Rhea', icon: { viewBox: '0 0 24 24', body: '<path d="M3 12C3 9.79086 4.79086 8 7 8H17C19.2091 8 21 9.79086 21 12C21 14.2091 19.2091 16 17 16H7C4.79086 16 3 14.2091 3 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />' } },
};

export const THEME_LABELS: Record<PresetTheme, string> = {
  neutral: 'Neutral',
  stone: 'Stone',
  zinc: 'Zinc',
  gray: 'Gray',
  mauve: 'Mauve',
  olive: 'Olive',
  mist: 'Mist',
  taupe: 'Taupe',
  amber: 'Amber',
  blue: 'Blue',
  cyan: 'Cyan',
  emerald: 'Emerald',
  fuchsia: 'Fuchsia',
  green: 'Green',
  indigo: 'Indigo',
  lime: 'Lime',
  orange: 'Orange',
  pink: 'Pink',
  purple: 'Purple',
  red: 'Red',
  rose: 'Rose',
  sky: 'Sky',
  teal: 'Teal',
  violet: 'Violet',
  yellow: 'Yellow',
};

/** Upstream's picker order, which differs from the codec's order. */
export const FONTS: readonly PresetFont[] = [
  'geist',
  'inter',
  'noto-sans',
  'nunito-sans',
  'figtree',
  'roboto',
  'raleway',
  'dm-sans',
  'public-sans',
  'outfit',
  'oxanium',
  'manrope',
  'space-grotesk',
  'montserrat',
  'ibm-plex-sans',
  'source-sans-3',
  'instrument-sans',
  'geist-mono',
  'jetbrains-mono',
  'noto-serif',
  'roboto-slab',
  'merriweather',
  'lora',
  'playfair-display',
  'eb-garamond',
  'instrument-serif',
];

/** The fonts grouped by type, with upstream's "Sans", "Mono" and "Serif" headings. */
export const FONT_GROUPS: OptionGroup<PresetFont>[] = (['sans', 'mono', 'serif'] as const).map((type) => ({
  label: `${type[0]!.toUpperCase()}${type.slice(1)}`,
  options: FONTS.filter((font) => PRESET_FONT_DEFINITIONS[font].type === type).map((font) => ({ value: font, label: PRESET_FONT_DEFINITIONS[font].title })),
}));

export const ICON_LIBRARIES: Record<PresetIconLibrary, { label: string; icon: Icon }> = {
  lucide: { label: 'Lucide', icon: { viewBox: '0 0 24 24', body: stroke('<path d="M14 12a4 4 0 0 0-8 0 8 8 0 1 0 16 0 11.97 11.97 0 0 0-4-8.944" /><path d="M10 12a4 4 0 0 0 8 0 8 8 0 1 0-16 0 11.97 11.97 0 0 0 4.063 9" />') } },
  tabler: { label: 'Tabler Icons', icon: { viewBox: '0 0 32 32', body: '<path fill="currentColor" d="M31.288 7.107A8.83 8.83 0 0 0 24.893.712a55.9 55.9 0 0 0-17.786 0A8.83 8.83 0 0 0 .712 7.107a55.9 55.9 0 0 0 0 17.786 8.83 8.83 0 0 0 6.395 6.395c5.895.95 11.89.95 17.786 0a8.83 8.83 0 0 0 6.395-6.395c.95-5.895.95-11.89 0-17.786" /><path fill="#fff" d="m17.884 9.076 1.5-2.488 6.97 6.977-2.492 1.494zm-7.96 3.127 7.814-.909 3.91 3.66-.974 7.287-9.582 2.159a3.06 3.06 0 0 1-2.17-.329l5.244-4.897c.91.407 2.003.142 2.587-.626.584-.77.488-1.818-.226-2.484s-1.84-.755-2.664-.21c-.823.543-1.107 1.562-.67 2.412l-5.245 4.89a2.53 2.53 0 0 1-.339-2.017z" />' } },
  hugeicons: { label: 'HugeIcons', icon: { viewBox: '0 0 24 24', body: stroke('<path d="M2 9.5H22" /><path d="M20.5 9.5H3.5L4.23353 15.3682C4.59849 18.2879 4.78097 19.7477 5.77343 20.6239C6.76589 21.5 8.23708 21.5 11.1795 21.5H12.8205C15.7629 21.5 17.2341 21.5 18.2266 20.6239C19.219 19.7477 19.4015 18.2879 19.7665 15.3682L20.5 9.5Z" /><path d="M5 9C5 5.41015 8.13401 2.5 12 2.5C15.866 2.5 19 5.41015 19 9" />') } },
  phosphor: { label: 'Phosphor Icons', icon: { viewBox: '0 0 32 32', body: stroke('<path d="M9 5h9v16H9zm9 16v9a9 9 0 0 1-9-9M9 5l9 16m0 0h1a8 8 0 0 0 0-16h-1" />') } },
  remixicon: { label: 'Remix Icon', icon: { viewBox: '0 0 24 24', body: '<path fill="currentColor" d="M12 2C17.5228 2 22 6.47715 22 12C22 15.3137 19.3137 18 16 18C12.6863 18 10 15.3137 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 16.4183 11.5817 20 16 20C16.8708 20 17.7084 19.8588 18.4932 19.6016C16.7458 21.0956 14.4792 22 12 22C6.6689 22 2.3127 17.8283 2.0166 12.5713C2.23647 9.45772 4.83048 7 8 7C11.3137 7 14 9.68629 14 13C14 13.5523 14.4477 14 15 14C15.5523 14 16 13.5523 16 13C16 8.58172 12.4183 5 8 5C6.50513 5 5.1062 5.41032 3.90918 6.12402C5.72712 3.62515 8.67334 2 12 2Z" />' } },
};

/** Upstream's picker order, which differs from the codec's order. */
export const ICON_LIBRARY_ORDER: readonly PresetIconLibrary[] = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'];

export const RADIUS_LABELS: Record<PresetRadius, string> = { default: 'Default', none: 'None', small: 'Small', medium: 'Medium', large: 'Large' };

export const MENU_ACCENT_LABELS: Record<PresetMenuAccent, string> = { subtle: 'Subtle', bold: 'Bold' };

export const MENU_COLOR_LABELS: Record<PresetMenuColor, string> = {
  default: 'Default / Solid',
  'default-translucent': 'Default / Translucent',
  inverted: 'Inverted / Solid',
  'inverted-translucent': 'Inverted / Translucent',
};

export const PICKER_ICONS = {
  radius: { viewBox: '0 0 24 24', body: stroke('<path d="M4 20v-5C4 8.925 8.925 4 15 4h5" />') },
  menu: { viewBox: '0 0 24 24', body: stroke('<path d="M4 5L16 5" /><path d="M4 12L20 12" /><path d="M4 19L12 19" />') },
  lock: { viewBox: '0 0 24 24', body: stroke('<path d="M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z" /><path d="M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9" /><path d="M11.9961 15.5H12.0051" />') },
  unlock: { viewBox: '0 0 24 24', body: stroke('<path d="M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z" /><path d="M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C13.9593 2 15.5 3.5 16 5" /><path d="M11.9961 15.5H12.0051" />') },
  mainMenu: { viewBox: '0 0 24 24', body: stroke('<path d="M4 8.5L20 8.5" /><path d="M4 15.5L20 15.5" />') },
  copy: { viewBox: '0 0 24 24', body: stroke('<path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" /><path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" />', 1.5) },
  check: { viewBox: '0 0 24 24', body: stroke('<path d="M5 14L8.5 17.5L19 6.5" />', 1.5) },
} satisfies Record<string, Icon>;
