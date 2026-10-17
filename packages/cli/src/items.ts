import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE, parseConfig, type Config } from './config.js';
import { CliError, literal, object, optional, ParseError, string } from './parse.js';
import { missingPackages, planFile, type Plan, type PlannedFile } from './plan.js';
import { aliasPath, loadEnv, readJson } from './project.js';
import { fetchItem, openRegistry, parseItemRef, resolveItems, resolveRegistryUrl, styleNames, type ItemRef, type Registry, type RegistryFile, type RegistryItem, type StyleName } from './registry.js';
import { applyTransforms, type TransformContext } from './transforms.js';

/** A project that ran `init`: its root, its components.json, the registry it points at, and where items are written (relative to `cwd`). */
export type Project = { cwd: string; config: Config; registry: Registry; uiDir: string };

export async function openProject(cwd: string): Promise<Project> {
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
  const config = parseConfig(readJson(configPath));
  const registry = await openRegistry(resolveRegistryUrl(config.registry), { configs: config.registries ?? {}, env: loadEnv(cwd) });
  return { cwd, config, registry, uiDir: aliasPath(config.aliases.ui) };
}

const catalogConfig = object({ style: optional((value) => value), registry: optional(string) });

/** The style a components.json names, as `view` needs it for a URL. `search` and `docs` never read the style, so `openCatalog` leaves it unchecked and a config written for another style set still works there. */
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
 * The registry and style that read-only commands (`view`, `search`, `docs`) use. Unlike `openProject`, it needs no `init`:
 * without a components.json it takes the default registry, and with one only `style` and `registry` count. `style` is returned unchecked: pass it to `catalogStyle` where a style is needed.
 */
export async function openCatalog(cwd: string): Promise<{ registry: Registry; style: unknown }> {
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
  return { registry: await openRegistry(resolveRegistryUrl(settings.registry)), style: settings.style };
}

/** Where a registry file goes, relative to `cwd`: by its type, under the ui or components alias, or from the project root. */
export function filePath({ config, uiDir }: Project, file: RegistryFile): string {
  if (file.type === 'registry:ui') return join(uiDir, file.target);
  if (file.type === 'registry:component') return join(aliasPath(config.aliases.components), file.target);
  return join(file.target);
}

/** What writing `items` into the project would do: every file transformed for this project, and the packages it lacks. `css` is the stylesheet as it will be, when it is not the one on disk. */
export function planItems(project: Project, items: RegistryItem[], css?: string): Plan {
  const { cwd, config } = project;
  const cssPath = join(cwd, config.tailwind.css);
  const ctx: TransformContext = {
    iconLibrary: config.iconLibrary,
    menuColor: config.menuColor,
    aliases: config.aliases,
    fontHeading: (css ?? (existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '')).includes('--font-heading'),
  };
  const files = new Map<string, PlannedFile>();
  const dependencies: string[] = [];
  const devDependencies: string[] = [];
  for (const item of items) {
    dependencies.push(...(item.dependencies ?? []));
    devDependencies.push(...(item.devDependencies ?? []));
    for (const file of item.files) {
      const result = applyTransforms(file, ctx);
      dependencies.push(...result.dependencies);
      const path = filePath(project, file);
      files.set(path, { ...planFile(cwd, path, result.content), item: item.name });
    }
  }
  return { files: [...files.values()], dependencies: missingPackages(cwd, dependencies), devDependencies: missingPackages(cwd, devDependencies) };
}

export const refOf = (name: string): ItemRef => ({ kind: 'name', name });

/** Every item the registry lists, in manifest order. */
export function fetchAllItems({ registry, config }: Project): Promise<RegistryItem[]> {
  return Promise.all(registry.manifest.items.map((entry) => fetchItem(registry, config.style, refOf(entry.name))));
}

/** An item counts as installed when any of its files exists. */
export const isInstalled = (project: Project, item: RegistryItem) => item.files.some((file) => existsSync(join(project.cwd, filePath(project, file))));

/** What `diff` and `update` say when a scan finds nothing. A scan does not see items added by URL. */
export const NONE_INSTALLED = 'No items from the registry are installed. Name an item you added by URL, or add one with `npx @sveltery/ui@latest add button`.';

/**
 * The items `diff` and `update` act on, with their registry dependencies: the named items and URLs, which must be installed, or else the installed roots.
 * A scan cannot know which URLs were used, so it never includes an item that only a URL names.
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
