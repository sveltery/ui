import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { log } from '@clack/prompts';
import { CONFIG_FILE, configKeys, defaultAliases, parseConfig, stylePresets, type Config } from '../config.js';
import { DEFAULT_CSS, fontStyles, mergeTheme } from '../css.js';
import { iconLibraries } from '../icons.js';
import { planItems, type Project } from '../items.js';
import { CliError } from '../parse.js';
import { executePlan, formatPlan, missingPackages, packageName, planFile, type Plan } from '../plan.js';
import { PRESET_MENU_ACCENTS, PRESET_MENU_COLORS, type PresetMenuAccent, type PresetMenuColor } from '../preset/index.js';
import { aliasPath, checkProject, findCssFile, libAlias, readJson } from '../project.js';
import {
  baseColors,
  fetchItem,
  fetchTheme,
  iconLibraryNames,
  openRegistry,
  resolveItems,
  resolveRegistryUrl,
  styleNames,
  type BaseColor,
  type CssTree,
  type CssVars,
  type IconLibraryName,
  type ItemRef,
  type Registry,
  type RegistryItem,
  type StyleName,
} from '../registry.js';
import { cliPackage, version } from '../version.js';
import { promptForPreset, resolvePresetUrl } from './preset.js';
import { choose } from './select.js';

export type InitOptions = { cwd: string; yes: boolean; install: boolean; style?: string; icons?: string; baseColor?: string; css?: string; preset?: string | true };

/** Packages every copied component relies on, at the ranges the registry source uses. */
export const baseDependencies = ['cn@^0.2.2', 'class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0'];

function pick<T extends string>(flag: string, value: string | undefined, options: readonly T[]): T | undefined {
  if (value === undefined) return undefined;
  if (!(options as readonly string[]).includes(value)) throw new CliError(`Unknown ${flag} "${value}". Choose one of: ${options.join(', ')}.`);
  return value as T;
}

const valid = <T extends string>(value: unknown, options: readonly T[]) => ((options as readonly unknown[]).includes(value) ? (value as T) : undefined);

/** What `init` writes, whether it came from flags and prompts or from a preset. */
type Settings = {
  style: StyleName;
  iconLibrary: IconLibraryName;
  baseColor: BaseColor;
  menuColor: PresetMenuColor;
  menuAccent?: PresetMenuAccent;
  cssVars: CssVars;
  cssTrees: CssTree[];
  dependencies: string[];
  /** Items with files to write, usually none. */
  items: RegistryItem[];
};

/** The parts of an existing components.json that fill in what the flags or the preset leave out. */
type Existing = { config: Record<string, unknown>; tailwind: Record<string, unknown> };

function assertServed(registry: Registry, style: StyleName) {
  if (!registry.manifest.styles.includes(style)) throw new CliError(`The registry at ${registry.url} does not serve the ${style} style.`);
}

async function settingsFromFlags(options: InitOptions, registry: Registry, existing: Existing): Promise<Settings> {
  const styleFlag = pick('style', options.style, styleNames);
  const iconsFlag = pick('icon library', options.icons, iconLibraryNames);
  const baseColorFlag = pick('base color', options.baseColor, baseColors);

  const styleDefault = valid(existing.config.style, styleNames) ?? 'nova';
  const style =
    styleFlag ??
    (options.yes ? styleDefault : await choose('Which style?', styleNames.map((name) => ({ value: name, label: stylePresets[name].title, hint: stylePresets[name].hint })), styleDefault));
  const iconDefault = valid(existing.config.iconLibrary, iconLibraryNames) ?? stylePresets[style].iconLibrary;
  const iconLibrary = iconsFlag ?? (options.yes ? iconDefault : await choose('Which icon library?', iconLibraryNames.map((name) => ({ value: name, label: name })), iconDefault));
  const baseColorDefault = valid(existing.tailwind.baseColor, baseColors) ?? stylePresets[style].baseColor;
  const baseColor = baseColorFlag ?? (options.yes ? baseColorDefault : await choose('Which base color?', baseColors.map((name) => ({ value: name, label: name })), baseColorDefault));

  assertServed(registry, style);
  const theme = await fetchTheme(registry, baseColor);
  return {
    style,
    iconLibrary,
    baseColor,
    menuColor: valid(existing.config.menuColor, PRESET_MENU_COLORS) ?? 'default',
    menuAccent: valid(existing.config.menuAccent, PRESET_MENU_ACCENTS),
    cssVars: theme.cssVars ?? {},
    cssTrees: [DEFAULT_CSS],
    dependencies: [...baseDependencies, ...iconLibraries[iconLibrary].packages],
    items: [],
  };
}

async function settingsFromPreset(url: string, registry: Registry, existing: Existing): Promise<Settings> {
  const ref: ItemRef = { kind: 'url', url };
  // A URL ref ignores the style, which the item itself names.
  const base = await fetchItem(registry, 'nova', ref);
  if (base.type !== 'registry:base') throw new CliError(`${url} is a ${base.type} item, and a preset must be a registry:base item.`);
  const config = base.config ?? {};

  const style = config.style ?? valid(existing.config.style, styleNames) ?? 'nova';
  assertServed(registry, style);
  const iconLibrary = config.iconLibrary ?? valid(existing.config.iconLibrary, iconLibraryNames) ?? stylePresets[style].iconLibrary;
  const resolved = await resolveItems(registry, style, [ref]);
  const fonts = fontStyles(resolved);
  const items = resolved.filter((item) => item.files.length > 0);
  return {
    style,
    iconLibrary,
    baseColor: config.tailwind?.baseColor ?? valid(existing.tailwind.baseColor, baseColors) ?? stylePresets[style].baseColor,
    menuColor: config.menuColor ?? valid(existing.config.menuColor, PRESET_MENU_COLORS) ?? 'default',
    menuAccent: config.menuAccent ?? valid(existing.config.menuAccent, PRESET_MENU_ACCENTS),
    cssVars: { ...base.cssVars, theme: { ...base.cssVars?.theme, ...fonts.theme } },
    cssTrees: [DEFAULT_CSS, base.css ?? {}, fonts.css],
    dependencies: [...baseDependencies, ...iconLibraries[iconLibrary].packages, ...(base.dependencies ?? []), ...fonts.dependencies, ...items.flatMap((item) => item.dependencies ?? [])],
    items,
  };
}

export async function init(options: InitOptions): Promise<Plan> {
  const { cwd } = options;
  checkProject(cwd);
  const configPath = join(cwd, CONFIG_FILE);
  const existingConfig = (existsSync(configPath) ? readJson(configPath) : {}) as Record<string, unknown>;
  if (typeof existingConfig !== 'object' || existingConfig === null || Array.isArray(existingConfig)) throw new CliError(`${CONFIG_FILE} must hold a JSON object.`);
  const existingTailwind = (existingConfig.tailwind ?? {}) as Record<string, unknown>;
  const existing: Existing = { config: existingConfig, tailwind: existingTailwind };
  const registryUrl = resolveRegistryUrl(typeof existingConfig.registry === 'string' ? existingConfig.registry : undefined);

  let presetUrl: string | undefined;
  if (options.preset !== undefined) {
    if (options.style !== undefined || options.icons !== undefined || options.baseColor !== undefined) {
      throw new CliError('--preset sets the style, icon library and base color. Drop --style, --icons and --base-color, or drop --preset.');
    }
    const preset = options.preset === true ? (options.yes ? 'nova' : await promptForPreset(registryUrl)) : options.preset;
    if (preset === undefined) return { files: [], dependencies: [], devDependencies: [] };
    presetUrl = resolvePresetUrl(registryUrl, preset);
  }

  const existingCss = typeof existingTailwind.css === 'string' && existsSync(join(cwd, existingTailwind.css)) ? existingTailwind.css : undefined;
  const cssPath = findCssFile(cwd, options.css ?? existingCss);

  const registry = await openRegistry(registryUrl);
  const settings = presetUrl === undefined ? await settingsFromFlags(options, registry, existing) : await settingsFromPreset(presetUrl, registry, existing);
  const { style, iconLibrary, baseColor, menuColor, menuAccent } = settings;

  const existingAliases = typeof existingConfig.aliases === 'object' && existingConfig.aliases !== null ? (existingConfig.aliases as Record<string, unknown>) : {};
  const config: Config = parseConfig({
    $schema: new URL('/schema.json', registry.url).href,
    style,
    iconLibrary,
    menuColor,
    menuAccent,
    tailwind: { css: cssPath, baseColor },
    aliases: { ...defaultAliases(libAlias(cwd)), ...Object.fromEntries(Object.entries(existingAliases).filter(([, value]) => typeof value === 'string')) },
    registry: registry.url,
    typescript: true,
  });
  // Known keys first in a fixed order, then the user's own keys, so a second run writes the same bytes.
  const written = {
    ...config,
    tailwind: { ...existingTailwind, ...config.tailwind },
    aliases: { ...existingAliases, ...config.aliases },
    ...Object.fromEntries(Object.entries(existingConfig).filter(([key]) => !configKeys.includes(key))),
  };

  const css = mergeTheme(readFileSync(join(cwd, cssPath), 'utf8'), settings.cssVars, settings.cssTrees);
  const project: Project = { cwd, config, registry, uiDir: aliasPath(config.aliases.ui) };
  const itemsPlan = planItems(project, settings.items, css);
  const plan: Plan = {
    files: [planFile(cwd, CONFIG_FILE, `${JSON.stringify(written, null, 2)}\n`), planFile(cwd, cssPath, css), ...itemsPlan.files],
    dependencies: missingPackages(cwd, [...settings.dependencies.filter((spec) => packageName(spec) !== cliPackage), ...itemsPlan.dependencies]),
    devDependencies: missingPackages(cwd, [`${cliPackage}@^${version}`]),
  };
  log.info(formatPlan(plan, { showIdentical: false }));
  await executePlan(plan, { cwd, install: options.install });
  log.success(`Ready. Add a component with \`npx sveltery add button\`.`);
  return plan;
}
