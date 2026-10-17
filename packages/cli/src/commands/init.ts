import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { log } from '@clack/prompts';
import { detect, getUserAgent } from 'package-manager-detector';
import { CONFIG_FILE, configKeys, defaultAliases, parseConfig, stylePresets, type Config } from '../config.js';
import { DEFAULT_CSS, fontStyles, mergeTheme } from '../css.js';
import { iconLibraries } from '../icons.js';
import { planItems, projectOf, sharesStylesheet, type Project } from '../items.js';
import { CliError } from '../parse.js';
import { executePlan, formatPlan, missingPackages, packageName, planFile, runPackageManager, type Plan } from '../plan.js';
import { applyMenuAccent, PRESET_MENU_ACCENTS, PRESET_MENU_COLORS, type PresetMenuAccent, type PresetMenuColor } from '../preset/index.js';
import { checkProject, findCssFile, formatMonorepoMessage, inspectProject, libAlias, monorepoTargets, readJson, withLibIndexFallback } from '../project.js';
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

/** The existing components.json at `path`, or an empty one. `name` is how errors name the file. */
function readExisting(path: string, name: string): Existing {
  const config = (existsSync(path) ? readJson(path) : {}) as Record<string, unknown>;
  if (typeof config !== 'object' || config === null || Array.isArray(config)) throw new CliError(`${name} must hold a JSON object.`);
  return { config, tailwind: (config.tailwind ?? {}) as Record<string, unknown> };
}

const registryUrlOf = (existing: Existing) => resolveRegistryUrl(typeof existing.config.registry === 'string' ? existing.config.registry : undefined);

/** The style, icon library and base color: each from its flag, else its default with `--yes`, else a prompt. */
async function chooseLook(options: InitOptions, existing: Existing): Promise<{ style: StyleName; iconLibrary: IconLibraryName; baseColor: BaseColor }> {
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
  return { style, iconLibrary, baseColor };
}

/** The preset `--preset` names, `nova` with `--yes`, or the one the user picks. Undefined when they pick Custom. */
async function choosePreset(preset: string | true, options: InitOptions, registryUrl: string): Promise<string | undefined> {
  if (options.style !== undefined || options.icons !== undefined || options.baseColor !== undefined) {
    throw new CliError('--preset sets the style, icon library and base color. Drop --style, --icons and --base-color, or drop --preset.');
  }
  return preset === true ? (options.yes ? 'nova' : await promptForPreset(registryUrl)) : preset;
}

async function settingsFromFlags(options: InitOptions, registry: Registry, existing: Existing): Promise<Settings> {
  const { style, iconLibrary, baseColor } = await chooseLook(options, existing);
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

/** The preset's registry:base item and the style it sets, which the registry must serve. */
async function fetchPreset(registry: Registry, url: string, existing: Existing): Promise<{ base: Extract<RegistryItem, { type: 'registry:base' }>; style: StyleName }> {
  // A URL ref ignores the style, which the item itself names.
  const base = await fetchItem(registry, 'nova', { kind: 'url', url });
  if (base.type !== 'registry:base') throw new CliError(`${url} is a ${base.type} item, and a preset must be a registry:base item.`);
  const style = base.config?.style ?? valid(existing.config.style, styleNames) ?? 'nova';
  assertServed(registry, style);
  return { base, style };
}

async function settingsFromPreset(url: string, options: InitOptions, registry: Registry, existing: Existing): Promise<Settings> {
  const ref: ItemRef = { kind: 'url', url };
  const { base, style } = await fetchPreset(registry, url, existing);
  const config = base.config ?? {};
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
 * Custom to build a preset on the Create page. `components` are items to add as well: the button of a new monorepo, or
 * the installed items that `apply` re-adds.
 */
export async function planInit(options: InitOptions, components: string[] = []): Promise<{ plan: Plan; project: Project; css: string; docs?: string } | undefined> {
  const { cwd } = options;
  checkProject(cwd);
  const existing = readExisting(join(cwd, CONFIG_FILE), CONFIG_FILE);
  const { config: existingConfig, tailwind: existingTailwind } = existing;
  const registryUrl = registryUrlOf(existing);

  let presetUrl: string | undefined;
  if (options.preset !== undefined) {
    const preset = await choosePreset(options.preset, options, registryUrl);
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
  const linked = projectOf(cwd, config, registry);
  // In a monorepo app, the ui package takes the same settings, and its files are transformed with them, as upstream's
  // apply copies them into each linked workspace. A preset applied without its theme part leaves them as they are.
  const only = presetUrl === undefined ? null : new URL(presetUrl).searchParams.get('only');
  const synced =
    linked.ui === undefined || (only !== null && !only.split(',').includes('theme'))
      ? undefined
      : { dir: linked.ui.dir, config: parseConfig({ ...linked.ui.config, style, iconLibrary, rtl, menuColor, ...(menuAccent ? { menuAccent } : {}), tailwind: { ...linked.ui.config.tailwind, baseColor } }) };
  const project: Project = synced === undefined ? linked : { ...linked, ui: synced };
  const added = components.length === 0 ? [] : await resolveItems(registry, style, components.map(parseItemRef));
  // `fetchItem` memoizes by address, so one item reached by both lists is one object, and same-named items from other sources stay.
  const items = [...new Set([...settings.items, ...added])];
  const itemsPlan = planItems(project, items, css);
  const manifest = withLibIndexFallback(cwd);
  const uiConfigPath = join(synced?.dir ?? '', CONFIG_FILE);
  const files = [
    planFile(cwd, CONFIG_FILE, configJson(config, existingConfig)),
    ...(synced === undefined ? [] : [planFile(cwd, uiConfigPath, configJson(synced.config, readExisting(join(cwd, uiConfigPath), uiConfigPath).config))]),
    planFile(cwd, cssPath, css),
    ...(manifest === undefined ? [] : [planFile(cwd, 'package.json', manifest)]),
    ...itemsPlan.files,
  ];
  const dependencies = settings.dependencies.filter((spec) => packageName(spec) !== cliPackage);
  const devDependencies = [`${cliPackage}@^${version}`];
  const { ui } = project;
  // The packages of the theme and the fonts go to the workspace that holds the stylesheet: the ui package when the app
  // uses its stylesheet. The app gets the icon packages too, as init --monorepo installs them in both.
  const plan: Plan =
    ui === undefined || !sharesStylesheet(project)
      ? {
          files,
          dependencies: missingPackages(cwd, [...dependencies, ...itemsPlan.dependencies]),
          devDependencies: missingPackages(cwd, [...devDependencies, ...itemsPlan.devDependencies]),
          ...(itemsPlan.workspace === undefined ? {} : { workspace: itemsPlan.workspace }),
        }
      : {
          files,
          dependencies: missingPackages(cwd, [...iconLibraries[iconLibrary].packages, ...itemsPlan.dependencies]),
          devDependencies: itemsPlan.devDependencies,
          workspace: {
            dir: ui.dir,
            dependencies: missingPackages(join(cwd, ui.dir), [...dependencies, ...(itemsPlan.workspace?.dependencies ?? [])]),
            devDependencies: missingPackages(join(cwd, ui.dir), [...devDependencies, ...(itemsPlan.workspace?.devDependencies ?? [])]),
          },
        };
  return { plan, project, css, docs: settings.docs };
}

export async function init(options: InitOptions): Promise<Plan> {
  if (options.name !== undefined) throw new CliError('--name names the project that --monorepo creates. Add --monorepo, or drop --name.');
  if (!existsSync(join(options.cwd, CONFIG_FILE)) && (inspectProject(options.cwd, undefined)?.framework ?? 'Manual') === 'Manual') {
    const targets = monorepoTargets(options.cwd);
    if (targets.length > 0) throw new CliError(formatMonorepoMessage('init', targets));
  }
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
 * `init --monorepo`, ported from upstream's monorepo templates. It asks for the settings first. In a directory without
 * package.json, it then creates the monorepo in the `--name` folder, installs it and adds the button. In a monorepo it
 * created before, it sets up the workspaces again and leaves the components alone, adding the button only when it is
 * missing. It runs init in packages/ui, writes the same settings to apps/web/components.json, and installs the icon
 * packages in both workspaces, as upstream's `fontsourceMonorepoInit` does.
 */
export async function initMonorepo(options: InitOptions): Promise<{ root: string; ui: Plan; app: Plan }> {
  const create = !existsSync(join(options.cwd, 'package.json'));
  let root = options.cwd;
  if (create) {
    const valid = (name: string) => (name === '' ? 'Enter a name.' : name.length > 128 ? 'Name should be less than 128 characters.' : undefined);
    const name = options.name ?? (options.yes ? DEFAULT_PROJECT_NAME : await input('What is your project named?', DEFAULT_PROJECT_NAME, valid));
    const invalid = valid(name);
    if (invalid) throw new CliError(invalid);
    root = join(options.cwd, name);
    if (existsSync(join(root, 'package.json'))) throw new CliError(`A project with the name ${name} already exists. Choose a different name and try again.`);
  }
  const uiCwd = join(root, UI_DIR);
  const appCwd = join(root, APP_DIR);
  const uiConfigPath = join(uiCwd, CONFIG_FILE);
  if (!create && [join(uiCwd, 'package.json'), uiConfigPath, join(appCwd, 'package.json')].some((path) => !existsSync(path))) {
    throw new CliError(`${root} has a package.json, and init --monorepo needs its ${UI_DIR} workspace with a ${CONFIG_FILE} and its ${APP_DIR} workspace. Run init --monorepo in an empty directory to create a monorepo, or run init in your app.`);
  }

  // Every prompt and check runs before the project is created, so a cancelled prompt or an unknown preset leaves nothing behind.
  const existingUi = create ? { config: {}, tailwind: {} } : readExisting(uiConfigPath, `${UI_DIR}/${CONFIG_FILE}`);
  const chosen = options.preset === undefined ? await chooseLook(options, existingUi) : await choosePreset(options.preset, options, registryUrlOf(existingUi));
  const none = { files: [], dependencies: [], devDependencies: [] };
  if (chosen === undefined) return { root, ui: none, app: none };
  const answered: InitOptions =
    typeof chosen === 'string' ? { ...options, cwd: uiCwd, preset: chosen } : { ...options, cwd: uiCwd, style: chosen.style, icons: chosen.iconLibrary, baseColor: chosen.baseColor };

  if (create) {
    // The preset and the style are checked against the registry here, as planInit checks them only once the template is written.
    const registryUrl = registryUrlOf(existingUi);
    const registry = await openRegistry(registryUrl);
    if (typeof chosen === 'string') await fetchPreset(registry, resolvePresetUrl(registryUrl, chosen, options.rtl), existingUi);
    else assertServed(registry, chosen.style);
    const { agent, packageManager } = await newProjectPackageManager(options.cwd);
    log.info(`Creating a new SvelteKit monorepo in ${relative(options.cwd, root)}.`);
    for (const [path, content] of Object.entries(monorepoFiles({ name: basename(root), packageManager, agent }))) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    if (options.install) await runPackageManager(root, 'install', firstInstallArgs[agent], { fallback: `Run \`${agent} install\` in ${root} yourself.` });
  }

  // As upstream's init adds the button only to a project it created from a template. A run in a monorepo whose first run
  // failed before the button was added adds it then, as the app's page imports it.
  let planned = (await planInit(answered, create ? ['button'] : []))!;
  if (!create && !existsSync(join(uiCwd, planned.project.uiDir, 'button'))) planned = (await planInit(answered, ['button']))!;
  const { config } = planned.project;
  const existingApp = readExisting(join(appCwd, CONFIG_FILE), `${APP_DIR}/${CONFIG_FILE}`).config;
  const strings = (value: unknown) => Object.fromEntries(Object.entries(typeof value === 'object' && value !== null ? value : {}).filter(([, entry]) => typeof entry === 'string')) as Record<string, string>;
  const appCss = strings(existingApp.tailwind).css ?? APP_CSS;
  const appConfig = parseConfig({
    ...config,
    tailwind: { css: appCss, baseColor: config.tailwind.baseColor },
    aliases: { ...appAliases, ...strings(existingApp.aliases) },
    registry: typeof existingApp.registry === 'string' ? existingApp.registry : config.registry,
    registries: existingApp.registries,
  });
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
  if (create) commitNewProject(root);
  log.success(`Ready. Add a component in ${relative(options.cwd, appCwd)} with \`npx @sveltery/ui@latest add button\`.`);
  if (planned.docs) log.info(planned.docs);
  return { root, ui: planned.plan, app };
}
