import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { log } from '@clack/prompts';
import { CONFIG_FILE, parseConfig } from '../config.js';
import { formatPreset } from '../format.js';
import { CliError } from '../parse.js';
import { DEFAULT_PRESETS, decodePreset, isPresetCode, V1_CHART_COLOR_MAP, type PresetCode, type PresetConfig, type PresetTheme } from '../preset/index.js';
import { readJson } from '../project.js';
import { choose } from '../prompt.js';
import { resolveRegistryUrl } from '../registry.js';
import { resolveProjectPreset } from '../resolve-preset.js';

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

/** The Create page with a preset code loaded, on the registry's origin so a preview registry opens its own Create page. */
export const presetPageUrl = (code: string) => `${createUrl(resolveRegistryUrl(undefined))}?preset=${code}`;

/** `derived` names the values the code is too old to carry, which `decodePresetCode` fills in. */
export type PresetDecoding = { code: PresetCode; version: string; values: Required<PresetConfig>; derived: 'chartColor'[]; url: string };

export function decodePresetCode(code: string): PresetDecoding {
  const decoded = isPresetCode(code) ? decodePreset(code) : null;
  if (!isPresetCode(code) || !decoded) throw new CliError(`Invalid preset code: ${code}`);
  const chartColor = decoded.chartColor ?? (V1_CHART_COLOR_MAP[decoded.theme] as PresetTheme | undefined) ?? decoded.theme;
  return { code, version: code[0]!, values: { ...decoded, chartColor }, derived: decoded.chartColor ? [] : ['chartColor'], url: presetPageUrl(code) };
}

/** `preset decode`: prints what a preset code sets, and returns it. A `*` marks a value that an older code does not carry. */
export function presetDecode(code: string, options: { json: boolean }): PresetDecoding {
  const decoding = decodePresetCode(code);
  const { version, values, derived, url } = decoding;
  console.log(
    options.json
      ? JSON.stringify({ code: decoding.code, version, values, derived, url }, null, 2)
      : formatPreset({ code: decoding.code, values, fallbacks: derived }, createUrl(resolveRegistryUrl(undefined)), '  * Compatibility value for older preset versions.').join('\n'),
  );
  return decoding;
}

/** `preset url`: prints the Create page URL for a code. */
export function presetUrl(code: string): string {
  const { url } = decodePresetCode(code);
  console.log(url);
  return url;
}

/** Opens `url` with the system's opener (`open`, `xdg-open` or `start`). It resolves once the opener has started. */
export function openInBrowser(url: string): Promise<void> {
  const [command, args, extra] =
    process.platform === 'darwin' ? (['open', [url], {}] as const) : process.platform === 'win32' ? (['cmd', ['/c', 'start', '""', url], { windowsVerbatimArguments: true }] as const) : (['xdg-open', [url], {}] as const);
  return new Promise((done, fail) => {
    const child = spawn(command, args, { stdio: 'ignore', detached: true, ...extra });
    child.once('error', fail);
    child.once('spawn', () => {
      child.unref();
      done();
    });
  });
}

/** `preset open`: prints the Create page URL for a code and opens it in the browser. */
export async function presetOpen(code: string, open: (url: string) => Promise<void> = openInBrowser): Promise<string> {
  const { url } = decodePresetCode(code);
  console.log(`\n  Opening ${url} in your browser.\n`);
  try {
    await open(url);
  } catch (error) {
    throw new CliError(`Failed to open preset URL: ${error instanceof Error ? error.message : String(error)}`);
  }
  return url;
}

/** `preset resolve`: prints the preset that the project's components.json and CSS add up to, or says there is no components.json. */
export function presetResolve(options: { cwd: string; json: boolean }) {
  const configPath = join(options.cwd, CONFIG_FILE);
  if (!existsSync(configPath)) {
    console.log(options.json ? 'null' : 'No components.json found.');
    return null;
  }
  const config = parseConfig(readJson(configPath));
  const preset = resolveProjectPreset(config, options.cwd);
  const registryUrl = resolveRegistryUrl(config.registry);
  console.log(options.json ? JSON.stringify(preset, null, 2) : formatPreset(preset, createUrl(registryUrl)).join('\n'));
  return preset;
}
