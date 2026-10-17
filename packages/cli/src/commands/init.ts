import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { log } from '@clack/prompts';
import { detect, getUserAgent } from 'package-manager-detector';
import { CONFIG_FILE, configKeys, defaultAliases, parseConfig, stylePresets, type Config } from '../config.js';
import { DEFAULT_CSS, fontStyles, mergeTheme } from '../css.js';
import { iconLibraries } from '../icons.js';
import { planItems, projectOf, type Project } from '../items.js';
import { CliError } from '../parse.js';
import { executePlan, formatPlan, missingPackages, packageName, planFile, runPackageManager, type Plan } from '../plan.js';
import { applyMenuAccent, PRESET_MENU_ACCENTS, PRESET_MENU_COLORS, type PresetMenuAccent, type PresetMenuColor } from '../preset/index.js';
import { checkProject, findCssFile, libAlias, readJson, withLibIndexFallback } from '../project.js';
import {
  baseColors,
  fetchItem,
  fetchTheme,
  iconLibraryNames,
  openRegistry,
  parseItemRef,
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
import { choose, input } from '../prompt.js';
import { APP_CSS, APP_DIR, appAliases, DEFAULT_PROJECT_NAME, monorepoFiles, UI_DIR, type PackageManager } from '../template.js';

export type InitOptions = {
  cwd: string;
  yes: boolean;
  install: boolean;
  style?: string;
  icons?: string;
  baseColor?: string;
  css?: string;
  preset?: string | true;
  rtl?: boolean;
  /** The folder `init --monorepo` creates the monorepo in, under `cwd`. */
  name?: string;
};

/** Packages every copied component relies on, at the ranges the registry source uses. */
export const baseDependencies = ['cn@^0.2.2', 'class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0'];

function pick<T extends string>(flag: string, value: string | undefined, options: readonly T[]): T | undefined {
  if (value === undefined) return undefined;
  if (!(options as readonly string[]).includes(value)) throw new CliError(`Unknown ${flag} "${value}". Choose one of: ${options.join(', ')}.`);
  return value as T;
}

const valid = <T extends string>(value: unknown, options: readonly T[]) => ((options as readonly unknown[]).includes(value) ? (value as T) : undefined);
const bool = (value: unknown) => (typeof value === 'boolean' ? value : undefined);

/** What `init` writes, whether it came from flags and prompts or from a preset. */
type Settings = {
  style: StyleName;
  iconLibrary: IconLibraryName;
  baseColor: BaseColor;
  menuColor: PresetMenuColor;
  menuAccent?: PresetMenuAccent;
  rtl: boolean;
  cssVars: CssVars;
  cssTrees: CssTree[];
  dependencies: string[];
  /** Items with files to write, usually none. */
  items: RegistryItem[];
  /** The preset's notes, such as how to set up RTL. */
  docs?: string;
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
  const menuAccent = valid(existing.config.menuAccent, PRESET_MENU_ACCENTS);
  const cssVars = structuredClone(theme.cssVars ?? {});
  applyMenuAccent(menuAccent, cssVars.light, cssVars.dark);
  return {
    style,
    iconLibrary,
    baseColor,
    menuColor: valid(existing.config.menuColor, PRESET_MENU_COLORS) ?? 'default',
    menuAccent,
    rtl: options.rtl ?? bool(existing.config.rtl) ?? false,
    cssVars,
    cssTrees: [DEFAULT_CSS],
    dependencies: [...baseDependencies, ...iconLibraries[iconLibrary].packages],
    items: [],
  };
}

async function settingsFromPreset(url: string, options: InitOptions, registry: Registry, existing: Existing): Promise<Settings> {
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
    // The flag wins over the preset, as upstream's init sets config.rtl last.
    rtl: options.rtl ?? config.rtl ?? bool(existing.config.rtl) ?? false,
    cssVars: { ...base.cssVars, theme: { ...base.cssVars?.theme, ...fonts.theme } },
    cssTrees: [DEFAULT_CSS, base.css ?? {}, fonts.css],
    dependencies: [...baseDependencies, ...iconLibraries[iconLibrary].packages, ...(base.dependencies ?? []), ...fonts.dependencies, ...items.flatMap((item) => item.dependencies ?? [])],
    items,
    docs: base.docs,
  };
}

/** components.json for `config`: the known keys first in a fixed order, then the user's own keys from `existing`, so a second run writes the same bytes. */
export function configJson(config: Config, existing: Record<string, unknown>): string {
  const object = (value: unknown) => (typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {});
  const written = {
    ...config,
    tailwind: { ...object(existing.tailwind), ...config.tailwind },
    aliases: { ...object(existing.aliases), ...config.aliases },
    ...Object.fromEntries(Object.entries(existing).filter(([key]) => !configKeys.includes(key))),
  };
  return `${JSON.stringify(written, null, 2)}\n`;
}

/**
 * What `init` would write, before anything is written, with the project as it will be. Undefined when the user picks
 * Custom to build a preset on the Create page. `components` are items to add as well, as upstream's init adds `button`
 * to a project it created from a template.
 */
export async function planInit(options: InitOptions, components: string[] = []): Promise<{ plan: Plan; project: Project; css: string; docs?: string } | undefined> {
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
    if (preset === undefined) return undefined;
    presetUrl = resolvePresetUrl(registryUrl, preset, options.rtl);
  }

  const existingCss = typeof existingTailwind.css === 'string' && existsSync(join(cwd, existingTailwind.css)) ? existingTailwind.css : undefined;
  const cssPath = findCssFile(cwd, options.css ?? existingCss);

  const registry = await openRegistry(registryUrl);
  const settings = presetUrl === undefined ? await settingsFromFlags(options, registry, existing) : await settingsFromPreset(presetUrl, options, registry, existing);
  const { style, iconLibrary, baseColor, menuColor, menuAccent, rtl } = settings;

  const existingAliases = typeof existingConfig.aliases === 'object' && existingConfig.aliases !== null ? (existingConfig.aliases as Record<string, unknown>) : {};
  const config: Config = parseConfig({
    $schema: new URL('/schema.json', registry.url).href,
    style,
    iconLibrary,
    rtl,
    menuColor,
    menuAccent,
    tailwind: { css: cssPath, baseColor },
    aliases: { ...defaultAliases(libAlias(cwd)), ...Object.fromEntries(Object.entries(existingAliases).filter(([, value]) => typeof value === 'string')) },
    registry: registry.url,
    registries: existingConfig.registries,
    typescript: true,
  });

  const css = mergeTheme(readFileSync(join(cwd, cssPath), 'utf8'), settings.cssVars, settings.cssTrees);
  const project = projectOf(cwd, config, registry);
  const added = components.length === 0 ? [] : await resolveItems(registry, style, components.map(parseItemRef));
  const items = [...new Map([...settings.items, ...added].map((item) => [item.name, item])).values()];
  const itemsPlan = planItems(project, items, css);
  const manifest = withLibIndexFallback(cwd);
  const plan: Plan = {
    files: [
      planFile(cwd, CONFIG_FILE, configJson(config, existingConfig)),
      planFile(cwd, cssPath, css),
      ...(manifest === undefined ? [] : [planFile(cwd, 'package.json', manifest)]),
      ...itemsPlan.files,
    ],
    dependencies: missingPackages(cwd, [...settings.dependencies.filter((spec) => packageName(spec) !== cliPackage), ...itemsPlan.dependencies]),
    devDependencies: missingPackages(cwd, [`${cliPackage}@^${version}`, ...itemsPlan.devDependencies]),
  };
  return { plan, project, css, docs: settings.docs };
}

export async function init(options: InitOptions): Promise<Plan> {
  if (options.name !== undefined) throw new CliError('--name names the project that --monorepo creates. Add --monorepo, or drop --name.');
  const planned = await planInit(options);
  if (planned === undefined) return { files: [], dependencies: [], devDependencies: [] };
  log.info(formatPlan(planned.plan, { showIdentical: false }));
  await executePlan(planned.plan, { cwd: options.cwd, install: options.install });
  log.success(`Ready. Add a component with \`npx @sveltery/ui@latest add button\`.`);
  if (planned.docs) log.info(planned.docs);
  return planned.plan;
}

/** Upstream's `getInstallArgs`: the first install of a project that has no lockfile yet. */
const firstInstallArgs: Record<PackageManager, string[]> = { pnpm: ['--no-frozen-lockfile'], yarn: ['--no-immutable'], npm: ['--no-audit', '--no-fund'], bun: [], deno: [] };

/** The package manager for a new project: the one whose lockfile is at or above `cwd`, else the one running the CLI, else npm, as upstream's `getPackageManager` picks it. */
async function newProjectPackageManager(cwd: string): Promise<{ agent: PackageManager; packageManager: string }> {
  const agent = ((await detect({ cwd }))?.name ?? getUserAgent() ?? 'npm') as PackageManager;
  const result = spawnSync(agent, ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' });
  const installed = result.status === 0 ? result.stdout.trim() : '';
  return { agent, packageManager: `${agent}@${/^\d+\.\d+\.\d+/.test(installed) ? installed : '*'}` };
}

/** Upstream's `defaultPostInit`: a git repository with one commit. Any failure, such as git missing, is ignored. */
function commitNewProject(root: string) {
  for (const args of [['init'], ['add', '-A'], ['commit', '-m', 'feat: initial commit']]) {
    if (spawnSync('git', args, { cwd: root, stdio: 'ignore' }).status !== 0) return;
  }
}

/**
 * `init --monorepo`, ported from upstream's monorepo templates. In a directory without package.json, it creates the
 * monorepo in the `--name` folder and installs it. In a monorepo it created before, it sets up the workspaces again. Then it
 * runs init in packages/ui with the button, writes the same settings to apps/web/components.json, and installs the icon
 * packages in both workspaces, as upstream's `fontsourceMonorepoInit` does.
 */
export async function initMonorepo(options: InitOptions): Promise<{ root: string; ui: Plan; app: Plan }> {
  let root = options.cwd;
  let created = false;
  if (!existsSync(join(root, 'package.json'))) {
    const valid = (name: string) => (name === '' ? 'Enter a name.' : name.length > 128 ? 'Name should be less than 128 characters.' : undefined);
    const name = options.name ?? (options.yes ? DEFAULT_PROJECT_NAME : await input('What is your project named?', DEFAULT_PROJECT_NAME, valid));
    const invalid = valid(name);
    if (invalid) throw new CliError(invalid);
    root = join(options.cwd, name);
    if (existsSync(join(root, 'package.json'))) throw new CliError(`A project with the name ${name} already exists. Choose a different name and try again.`);
    const { agent, packageManager } = await newProjectPackageManager(options.cwd);
    log.info(`Creating a new SvelteKit monorepo in ${relative(options.cwd, root)}.`);
    for (const [path, content] of Object.entries(monorepoFiles({ name: basename(root), packageManager, agent }))) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    if (options.install) await runPackageManager(root, 'install', firstInstallArgs[agent], { fallback: `Run \`${agent} install\` in ${root} yourself.` });
    created = true;
  }
  const uiCwd = join(root, UI_DIR);
  const appCwd = join(root, APP_DIR);
  if (!existsSync(join(uiCwd, 'package.json')) || !existsSync(join(appCwd, 'package.json'))) {
    throw new CliError(`${root} has a package.json, and init --monorepo needs its ${UI_DIR} and ${APP_DIR} workspaces. Run init --monorepo in an empty directory to create a monorepo, or run init in your app.`);
  }

  const planned = await planInit({ ...options, cwd: uiCwd }, ['button']);
  if (planned === undefined) return { root, ui: { files: [], dependencies: [], devDependencies: [] }, app: { files: [], dependencies: [], devDependencies: [] } };
  const { config } = planned.project;
  const appConfigPath = join(appCwd, CONFIG_FILE);
  const existingApp = (existsSync(appConfigPath) ? readJson(appConfigPath) : {}) as Record<string, unknown>;
  if (typeof existingApp !== 'object' || existingApp === null || Array.isArray(existingApp)) throw new CliError(`${APP_DIR}/${CONFIG_FILE} must hold a JSON object.`);
  const strings = (value: unknown) => Object.fromEntries(Object.entries(typeof value === 'object' && value !== null ? value : {}).filter(([, entry]) => typeof entry === 'string')) as Record<string, string>;
  const appCss = strings(existingApp.tailwind).css ?? APP_CSS;
  const appConfig = parseConfig({ ...config, tailwind: { css: appCss, baseColor: config.tailwind.baseColor }, aliases: { ...appAliases, ...strings(existingApp.aliases) } });
  const app: Plan = { files: [planFile(appCwd, CONFIG_FILE, configJson(appConfig, existingApp))], dependencies: missingPackages(appCwd, iconLibraries[config.iconLibrary].packages), devDependencies: [] };

  // Both plans shown from the root, with each one's packages under its workspace.
  const shown = (plan: Plan, dir: string): Plan => ({
    files: plan.files.map((file) => ({ ...file, path: join(dir, file.path) })),
    dependencies: [],
    devDependencies: [],
    workspace: { dir, dependencies: plan.dependencies, devDependencies: plan.devDependencies },
  });
  log.info(formatPlan(shown(planned.plan, UI_DIR), { showIdentical: false }));
  log.info(formatPlan(shown(app, APP_DIR), { showIdentical: false }));
  await executePlan(planned.plan, { cwd: uiCwd, install: options.install });
  await executePlan(app, { cwd: appCwd, install: options.install });
  if (created) commitNewProject(root);
  log.success(`Ready. Add a component in ${relative(options.cwd, appCwd)} with \`npx @sveltery/ui@latest add button\`.`);
  if (planned.docs) log.info(planned.docs);
  return { root, ui: planned.plan, app };
}
