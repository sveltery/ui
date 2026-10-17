import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE, parseConfig, type Config } from './config.js';
import { CliError } from './parse.js';
import { missingPackages, planFile, type Plan, type PlannedFile } from './plan.js';
import { aliasPath, readJson } from './project.js';
import { fetchItem, openRegistry, parseItemRef, resolveItems, resolveRegistryUrl, type ItemRef, type Registry, type RegistryFile, type RegistryItem } from './registry.js';
import { applyTransforms, type TransformContext } from './transforms.js';

/** A project that ran `init`: its root, its components.json, the registry it points at, and where items are written (relative to `cwd`). */
export type Project = { cwd: string; config: Config; registry: Registry; uiDir: string };

export async function openProject(cwd: string): Promise<Project> {
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
  const config = parseConfig(readJson(configPath));
  const registry = await openRegistry(resolveRegistryUrl(config.registry));
  return { cwd, config, registry, uiDir: aliasPath(config.aliases.ui) };
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

const refOf = (name: string): ItemRef => ({ kind: 'name', name });

/** Every item the registry lists, in manifest order. */
export function fetchAllItems({ registry, config }: Project): Promise<RegistryItem[]> {
  return Promise.all(registry.manifest.items.map((entry) => fetchItem(registry, config.style, refOf(entry.name))));
}

/** An item counts as installed when any of its files exists. */
export const isInstalled = (project: Project, item: RegistryItem) => item.files.some((file) => existsSync(join(project.cwd, filePath(project, file))));

/**
 * The items `diff` and `update` act on, with their registry dependencies. Named items and URLs must be installed.
 * Unnamed, it is every installed item of the registry except `registry:lib` ones such as `shared`, which come in as dependencies of the items that need them.
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
  const installed = (await fetchAllItems(project)).filter((item) => item.type !== 'registry:lib' && isInstalled(project, item));
  return resolveItems(registry, config.style, installed.map((item) => refOf(item.name)));
}
