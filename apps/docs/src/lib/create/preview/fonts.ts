import { PRESET_FONT_DEFINITIONS, type PresetFont } from '@sveltery/ui/preset';

// Each stylesheet is its own chunk, so the preview downloads only the fonts a config names.
const FONT_STYLESHEETS: Record<PresetFont, () => Promise<unknown>> = {
  geist: () => import('@fontsource-variable/geist'),
  inter: () => import('@fontsource-variable/inter'),
  'noto-sans': () => import('@fontsource-variable/noto-sans'),
  'nunito-sans': () => import('@fontsource-variable/nunito-sans'),
  figtree: () => import('@fontsource-variable/figtree'),
  roboto: () => import('@fontsource-variable/roboto'),
  raleway: () => import('@fontsource-variable/raleway'),
  'dm-sans': () => import('@fontsource-variable/dm-sans'),
  'public-sans': () => import('@fontsource-variable/public-sans'),
  outfit: () => import('@fontsource-variable/outfit'),
  oxanium: () => import('@fontsource-variable/oxanium'),
  manrope: () => import('@fontsource-variable/manrope'),
  'space-grotesk': () => import('@fontsource-variable/space-grotesk'),
  montserrat: () => import('@fontsource-variable/montserrat'),
  'ibm-plex-sans': () => import('@fontsource-variable/ibm-plex-sans'),
  'source-sans-3': () => import('@fontsource-variable/source-sans-3'),
  'instrument-sans': () => import('@fontsource-variable/instrument-sans'),
  'jetbrains-mono': () => import('@fontsource-variable/jetbrains-mono'),
  'geist-mono': () => import('@fontsource-variable/geist-mono'),
  'noto-serif': () => import('@fontsource-variable/noto-serif'),
  'roboto-slab': () => import('@fontsource-variable/roboto-slab'),
  merriweather: () => import('@fontsource-variable/merriweather'),
  lora: () => import('@fontsource-variable/lora'),
  'playfair-display': () => import('@fontsource-variable/playfair-display'),
  'eb-garamond': () => import('@fontsource-variable/eb-garamond'),
  'instrument-serif': () => import('@fontsource/instrument-serif'),
};

/** Resolves once the font's stylesheet is in the page and its files are ready to render. */
export async function loadFont(font: PresetFont): Promise<void> {
  await FONT_STYLESHEETS[font]();
  await document.fonts.load(`1em ${PRESET_FONT_DEFINITIONS[font].family}`);
}
