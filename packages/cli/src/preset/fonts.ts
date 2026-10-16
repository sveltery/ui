import type { PresetFont } from './preset.js';

export type PresetFontDefinition = {
  title: string;
  type: 'sans' | 'mono' | 'serif';
  /** The CSS `font-family` value. */
  family: string;
  /** The Tailwind theme variable the font sets as a body font. A heading font always sets `--font-heading`. */
  variable: '--font-sans' | '--font-mono' | '--font-serif';
  /** The fontsource package that serves the font. */
  dependency: string;
  /** Set only for a font that has no variable build. */
  weight?: readonly string[];
};

/** Ported from shadcn's apps/v4/lib/font-definitions.ts, in its picker order. */
export const PRESET_FONT_DEFINITIONS: Record<PresetFont, PresetFontDefinition> = {
  geist: { title: 'Geist', type: 'sans', family: "'Geist Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/geist' },
  inter: { title: 'Inter', type: 'sans', family: "'Inter Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/inter' },
  'noto-sans': { title: 'Noto Sans', type: 'sans', family: "'Noto Sans Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/noto-sans' },
  'nunito-sans': { title: 'Nunito Sans', type: 'sans', family: "'Nunito Sans Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/nunito-sans' },
  figtree: { title: 'Figtree', type: 'sans', family: "'Figtree Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/figtree' },
  roboto: { title: 'Roboto', type: 'sans', family: "'Roboto Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/roboto' },
  raleway: { title: 'Raleway', type: 'sans', family: "'Raleway Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/raleway' },
  'dm-sans': { title: 'DM Sans', type: 'sans', family: "'DM Sans Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/dm-sans' },
  'public-sans': { title: 'Public Sans', type: 'sans', family: "'Public Sans Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/public-sans' },
  outfit: { title: 'Outfit', type: 'sans', family: "'Outfit Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/outfit' },
  oxanium: { title: 'Oxanium', type: 'sans', family: "'Oxanium Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/oxanium' },
  manrope: { title: 'Manrope', type: 'sans', family: "'Manrope Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/manrope' },
  'space-grotesk': { title: 'Space Grotesk', type: 'sans', family: "'Space Grotesk Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/space-grotesk' },
  montserrat: { title: 'Montserrat', type: 'sans', family: "'Montserrat Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/montserrat' },
  'ibm-plex-sans': { title: 'IBM Plex Sans', type: 'sans', family: "'IBM Plex Sans Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/ibm-plex-sans' },
  'source-sans-3': { title: 'Source Sans 3', type: 'sans', family: "'Source Sans 3 Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/source-sans-3' },
  'instrument-sans': { title: 'Instrument Sans', type: 'sans', family: "'Instrument Sans Variable', sans-serif", variable: '--font-sans', dependency: '@fontsource-variable/instrument-sans' },
  'jetbrains-mono': { title: 'JetBrains Mono', type: 'mono', family: "'JetBrains Mono Variable', monospace", variable: '--font-mono', dependency: '@fontsource-variable/jetbrains-mono' },
  'geist-mono': { title: 'Geist Mono', type: 'mono', family: "'Geist Mono Variable', monospace", variable: '--font-mono', dependency: '@fontsource-variable/geist-mono' },
  'noto-serif': { title: 'Noto Serif', type: 'serif', family: "'Noto Serif Variable', serif", variable: '--font-serif', dependency: '@fontsource-variable/noto-serif' },
  'roboto-slab': { title: 'Roboto Slab', type: 'serif', family: "'Roboto Slab Variable', serif", variable: '--font-serif', dependency: '@fontsource-variable/roboto-slab' },
  merriweather: { title: 'Merriweather', type: 'serif', family: "'Merriweather Variable', serif", variable: '--font-serif', dependency: '@fontsource-variable/merriweather' },
  lora: { title: 'Lora', type: 'serif', family: "'Lora Variable', serif", variable: '--font-serif', dependency: '@fontsource-variable/lora' },
  'playfair-display': { title: 'Playfair Display', type: 'serif', family: "'Playfair Display Variable', serif", variable: '--font-serif', dependency: '@fontsource-variable/playfair-display' },
  'eb-garamond': { title: 'EB Garamond', type: 'serif', family: "'EB Garamond Variable', serif", variable: '--font-serif', dependency: '@fontsource-variable/eb-garamond' },
  'instrument-serif': { title: 'Instrument Serif', type: 'serif', family: "'Instrument Serif', serif", variable: '--font-serif', dependency: '@fontsource/instrument-serif', weight: ['400'] },
};
