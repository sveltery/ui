import { log } from '@clack/prompts';
import { CliError } from '../parse.js';
import { DEFAULT_PRESETS, decodePreset, isPresetCode, type PresetConfig } from '../preset/index.js';
import { choose } from '../prompt.js';

/** Port of shadcn's `resolveInitUrl`, without the base, template, pointer and track parameters. The URL is on the registry's origin. */
export function initUrl(registryUrl: string, preset: PresetConfig, code?: string, rtl = false): string {
  const url = new URL('/init', registryUrl);
  const { style, baseColor, theme, iconLibrary, font, menuAccent, menuColor, radius, chartColor, fontHeading } = preset;
  const params: Record<string, string | undefined> = {
    style,
    baseColor,
    theme,
    iconLibrary,
    font,
    menuAccent,
    menuColor,
    radius,
    chartColor: chartColor !== 'neutral' ? chartColor : undefined,
    fontHeading: fontHeading !== 'inherit' ? fontHeading : undefined,
    rtl: rtl ? 'true' : undefined,
    preset: code,
  };
  for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, value);
  return url.href;
}

/** An http(s) URL, a preset code or a preset name, in that order, as shadcn checks them. `--rtl` and `--no-rtl` set or drop a URL's rtl param, as shadcn's `applyInitUrlOptions`. */
export function resolvePresetUrl(registryUrl: string, value: string, rtl?: boolean): string {
  if (/^https?:\/\//.test(value)) {
    if (rtl === undefined) return value;
    const url = new URL(value);
    if (rtl) url.searchParams.set('rtl', 'true');
    else url.searchParams.delete('rtl');
    return url.href;
  }
  if (isPresetCode(value)) {
    const decoded = decodePreset(value);
    if (!decoded) throw new CliError(`Invalid preset code: ${value}`);
    return initUrl(registryUrl, decoded, value, rtl);
  }
  const preset = DEFAULT_PRESETS[value as keyof typeof DEFAULT_PRESETS];
  if (!preset) throw new CliError(`Unknown preset "${value}". Use one of ${Object.keys(DEFAULT_PRESETS).join(', ')}, a preset code, or the URL of an /init item.`);
  return initUrl(registryUrl, preset, undefined, rtl ?? preset.rtl);
}

export const createUrl = (registryUrl: string) => new URL('/create', registryUrl).href;

/** The name of the chosen preset, or undefined when the user picks Custom and builds one on the Create page instead. */
export async function promptForPreset(registryUrl: string): Promise<string | undefined> {
  const custom = 'custom';
  const options = [
    ...Object.entries(DEFAULT_PRESETS).map(([name, preset]) => ({ value: name, label: preset.title, hint: preset.description })),
    { value: custom, label: 'Custom', hint: `Build your own at ${createUrl(registryUrl)}` },
  ];
  const choice = await choose('Which preset would you like to use?', options, 'nova');
  if (choice !== custom) return choice;
  log.info(`Build your custom preset on ${createUrl(registryUrl)}, then copy and run the command from the page.`);
  return undefined;
}
