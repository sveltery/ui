import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE, parseConfig, type Config } from './config.js';
import { CliError, literal, object, optional, ParseError, string } from './parse.js';
import { missingPackages, planFile, type Plan, type PlannedFile } from './plan.js';
import { aliasPath, loadEnv, readJson, resolveAlias } from './project.js';
import { fetchItem, namespaceConfigs, openRegistry, parseItemRef, resolveItems, resolveRegistryUrl, styleNames, type ItemRef, type Namespaces, type Registry, type RegistryFile, type RegistryItem, type StyleName } from './registry.js';
import { applyTransforms, type TransformContext } from './transforms.js';

/**
 * A project that ran `init`: its root, its components.json, the registry it points at, and where ui files are written
 * (relative to `cwd`). In a monorepo app whose `aliases.ui` names another workspace package, `ui` is that package: its
 * root relative to `cwd` and its own components.json. Its config transforms the ui files, and its package.json gets the packages.
 */
export type Project = { cwd: string; config: Config; registry: Registry; uiDir: string; ui?: { dir: string; config: Config } };

/** The project at `cwd` with `config`, following `aliases.ui` into another workspace package as upstream's `getWorkspaceConfig` does. */
export function projectOf(cwd: string, config: Config, registry: Registry): Project {
  const { path, packageDir } = resolveAlias(cwd, config.aliases.ui);
  if (packageDir === '') return { cwd, config, registry, uiDir: path };
  const uiConfigPath = join(cwd, packageDir, CONFIG_FILE);
  if (!existsSync(uiConfigPath)) {
    throw new CliError(`Could not load the workspace config in ${packageDir}. Add ${CONFIG_FILE} to this workspace and configure its aliases, then try again.`);
  }
  const uiConfig = parseConfig(readJson(uiConfigPath));
  return { cwd, config, registry, uiDir: join(packageDir, aliasPath(join(cwd, packageDir), uiConfig.aliases.ui)), ui: { dir: packageDir, config: uiConfig } };
}

export async function openProject(cwd: string): Promise<Project> {
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
  const config = parseConfig(readJson(configPath));
  const registry = await openRegistry(resolveRegistryUrl(config.registry), { configs: config.registries ?? {}, env: loadEnv(cwd) });
  return projectOf(cwd, config, registry);
}

const catalogConfig = object({ style: optional((value) => value), registry: optional(string), registries: optional(namespaceConfigs) });

/** The style a components.json names, as `view` and a namespace `search` need it for a URL. `docs` and a search of the manifest never read the style, so `readCatalog` leaves it unchecked and a config written for another style set still works there. */
export function catalogStyle(style: unknown): StyleName {
  if (style === undefined) return 'nova';
  try {
    return literal(...styleNames)(style, 'style');
  } catch (error) {
    if (!(error instanceof ParseError)) throw error;
    throw new CliError(`${CONFIG_FILE} is invalid. ${error.message}.`);
  }
}

/**
 * The registry URL, namespaces and style that read-only commands (`view`, `search`, `docs`) use, read without a request. Unlike `openProject`, it needs no `init`:
 * without a components.json it takes the default registry, and with one only `style`, `registry` and `registries` count. `style` is returned unchecked: pass it to `catalogStyle` where a style is needed.
 */
export function readCatalog(cwd: string): { url: string; namespaces: Namespaces; style: unknown } {
  const configPath = join(cwd, CONFIG_FILE);
  let settings: ReturnType<typeof catalogConfig> = {};
  if (existsSync(configPath)) {
    try {
      settings = catalogConfig(readJson(configPath), '');
    } catch (error) {
      if (!(error instanceof ParseError)) throw error;
      throw new CliError(`${CONFIG_FILE} is invalid. ${error.message}.`);
    }
  }
  return { url: resolveRegistryUrl(settings.registry), namespaces: { configs: settings.registries ?? {}, env: loadEnv(cwd) }, style: settings.style };
}

/** `readCatalog`, with the registry's manifest fetched. */
export async function openCatalog(cwd: string): Promise<{ registry: Registry; style: unknown }> {
  const { url, namespaces, style } = readCatalog(cwd);
  return { registry: await openRegistry(url, namespaces), style };
}

/** Where a registry file goes, relative to `cwd`: by its type, under the ui or components alias, or from the project root. */
export function filePath({ cwd, config, uiDir }: Project, file: RegistryFile): string {
  if (file.type === 'registry:ui') return join(uiDir, file.target);
  if (file.type === 'registry:component') return join(aliasPath(cwd, config.aliases.components), file.target);
  return join(file.target);
}

/** How files are transformed for the project at `root` with `config`. `css` is its stylesheet as it will be, when it is not the one on disk. */
function transformContext(root: string, config: Config, css: string | undefined): TransformContext {
  const cssPath = join(root, config.tailwind.css);
  return {
    iconLibrary: config.iconLibrary,
    menuColor: config.menuColor,
    aliases: config.aliases,
    fontHeading: (css ?? (existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '')).includes('--font-heading'),
    rtl: config.rtl ?? false,
  };
}

/** Whether the app's components.json names the ui package's stylesheet, as the template's does, rather than a stylesheet of its own. */
export const sharesStylesheet = ({ cwd, config, ui }: Project) => ui !== undefined && join(cwd, config.tailwind.css) === join(cwd, ui.dir, ui.config.tailwind.css);

/**
 * What writing `items` into the project would do: every file transformed for this project, and the packages it lacks.
 * `css` is the stylesheet as it will be, when it is not the one on disk. In a monorepo app, ui files are transformed with
 * the ui package's config, as upstream's `addWorkspaceComponents` does, and their packages go to that package.
 */
export function planItems(project: Project, items: RegistryItem[], css?: string): Plan {
  const { cwd, config, ui } = project;
  const ctx = transformContext(cwd, config, css);
  const uiCtx = ui === undefined ? ctx : transformContext(join(cwd, ui.dir), ui.config, sharesStylesheet(project) ? css : undefined);
  const files = new Map<string, PlannedFile>();
  const app = { dependencies: [] as string[], devDependencies: [] as string[] };
  const workspace = { dependencies: [] as string[], devDependencies: [] as string[] };
  const isUi = (file: RegistryFile) => file.type === 'registry:ui';
  for (const item of items) {
    // An item's packages are for its own files, so they go where its files go, to both workspaces when its files go to both.
    // One without files, such as a font, styles the ui package's CSS.
    const targets = ui === undefined ? [app] : item.files.every(isUi) ? [workspace] : item.files.some(isUi) ? [app, workspace] : [app];
    for (const packages of targets) {
      packages.dependencies.push(...(item.dependencies ?? []));
      packages.devDependencies.push(...(item.devDependencies ?? []));
    }
    for (const file of item.files) {
      const result = applyTransforms(file, isUi(file) ? uiCtx : ctx);
      (ui !== undefined && isUi(file) ? workspace : app).dependencies.push(...result.dependencies);
      const path = filePath(project, file);
      files.set(path, { ...planFile(cwd, path, result.content), item });
    }
  }
  const uiRoot = join(cwd, ui?.dir ?? '');
  return {
    files: [...files.values()],
    dependencies: missingPackages(cwd, app.dependencies),
    devDependencies: missingPackages(cwd, app.devDependencies),
    ...(ui === undefined ? {} : { workspace: { dir: ui.dir, dependencies: missingPackages(uiRoot, workspace.dependencies), devDependencies: missingPackages(uiRoot, workspace.devDependencies) } }),
  };
}

const refOf = (name: string): ItemRef => ({ kind: 'name', name });

/** Every item the registry lists, in manifest order. */
export function fetchAllItems({ registry, config }: Project): Promise<RegistryItem[]> {
  return Promise.all(registry.manifest.items.map((entry) => fetchItem(registry, config.style, refOf(entry.name))));
}

/** An item counts as installed when any of its files exists. */
export const isInstalled = (project: Project, item: RegistryItem) => item.files.some((file) => existsSync(join(project.cwd, filePath(project, file))));

/** What `diff` and `update` say when a scan finds nothing. A scan does not see items added by URL or from GitHub. */
export const NONE_INSTALLED = 'No items from the registry are installed. Name an item you added by URL or from GitHub, or add one with `npx @sveltery/ui@latest add button`.';

/**
 * The items `diff` and `update` act on, with their registry dependencies: the named items and URLs, which must be installed, or else the installed roots.
 * A scan cannot know which URLs or GitHub items were used, so it never includes an item that only one of them names.
 */
export async function selectInstalled(project: Project, names: string[]): Promise<RegistryItem[]> {
  const { registry, config } = project;
  if (names.length > 0) {
    const refs = names.map(parseItemRef);
    const items = await resolveItems(registry, config.style, refs);
    for (const [index, ref] of refs.entries()) {
      if (!isInstalled(project, await fetchItem(registry, config.style, ref))) throw new CliError(`${names[index]} is not installed. Run \`npx @sveltery/ui@latest add ${names[index]}\` first.`);
    }
    return items;
  }
  return resolveItems(registry, config.style, (await installedRoots(project)).map((item) => refOf(item.name)));
}

/** Every installed item except `registry:lib` ones such as `shared`, which come in as dependencies of the items that need them. */
export async function installedRoots(project: Project): Promise<RegistryItem[]> {
  return (await fetchAllItems(project)).filter((item) => item.type !== 'registry:lib' && isInstalled(project, item));
}
