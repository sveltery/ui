import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE, parseConfig, type Config } from './config.js';
import { CliError } from './parse.js';
import { missingPackages, planFile, type Plan, type PlannedFile } from './plan.js';
import { aliasPath, readJson } from './project.js';
import { fetchItem, openRegistry, parseItemRef, resolveItems, resolveRegistryUrl, type ItemRef, type Registry, type RegistryItem } from './registry.js';
import { applyTransforms, type TransformContext } from './transforms.js';

/** A project that ran `init`: its root, its components.json, the registry it points at, and where items are written (relative to `cwd`). */
export type Project = { cwd: string; config: Config; registry: Registry; uiDir: string };

export async function openProject(cwd: string): Promise<Project> {
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx sveltery init\` first.`);
  const config = parseConfig(readJson(configPath));
  const registry = await openRegistry(resolveRegistryUrl(config.registry));
  return { cwd, config, registry, uiDir: aliasPath(config.aliases.ui) };
}

/** What writing `items` into the project would do: every file transformed for this project, and the packages it lacks. `css` is the stylesheet as it will be, when it is not the one on disk. */
export function planItems({ cwd, config, uiDir }: Project, items: RegistryItem[], css?: string): Plan {
  const cssPath = join(cwd, config.tailwind.css);
  const ctx: TransformContext = {
    iconLibrary: config.iconLibrary,
    menuColor: config.menuColor,
    fontHeading: (css ?? (existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '')).includes('--font-heading'),
  };
  const files = new Map<string, PlannedFile>();
  const dependencies: string[] = [];
  for (const item of items) {
    dependencies.push(...(item.dependencies ?? []));
    for (const file of item.files) {
      const result = applyTransforms(file, ctx);
      dependencies.push(...result.dependencies);
      const path = join(uiDir, file.target);
      files.set(path, { ...planFile(cwd, path, result.content), item: item.name });
    }
  }
  return { files: [...files.values()], dependencies: missingPackages(cwd, dependencies), devDependencies: [] };
}

const refOf = (name: string): ItemRef => ({ kind: 'name', name });

/** Every item the registry lists, in manifest order. */
export function fetchAllItems({ registry, config }: Project): Promise<RegistryItem[]> {
  return Promise.all(registry.manifest.items.map((entry) => fetchItem(registry, config.style, refOf(entry.name))));
}

/** An item counts as installed when any of its files exists under `aliases.ui`. */
export const isInstalled = ({ cwd, uiDir }: Project, item: RegistryItem) => item.files.some((file) => existsSync(join(cwd, uiDir, file.target)));

/**
 * The items `diff` and `update` act on, with their registry dependencies. Named items must be installed.
 * Unnamed, it is every installed item except `registry:lib` ones such as `shared`, which come in as dependencies of the items that need them.
 */
export async function selectInstalled(project: Project, names: string[]): Promise<RegistryItem[]> {
  const { registry, config } = project;
  if (names.length > 0) {
    const refs = names.map(parseItemRef);
    if (refs.some((ref) => ref.kind === 'url')) throw new CliError('Name installed items, such as `sveltery diff button`. URLs only work with `add`.');
    const items = await resolveItems(registry, config.style, refs);
    for (const name of names) {
      if (!isInstalled(project, items.find((item) => item.name === name)!)) throw new CliError(`${name} is not installed. Run \`sveltery add ${name}\` first.`);
    }
    return items;
  }
  const installed = (await fetchAllItems(project)).filter((item) => item.type !== 'registry:lib' && isInstalled(project, item));
  return resolveItems(registry, config.style, installed.map((item) => refOf(item.name)));
}
