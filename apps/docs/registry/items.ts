import heldVersions from './held-versions.json' with { type: 'json' };
import { analyzeSource, type SourceFile } from './source';
import type { RegistryItem } from './types';

/** Folders of `bases/base/ui` that are not registry items: the CLI replaces icons. */
const NOT_ITEMS = new Set(['icons']);

export type UiManifest = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

/** An item before any style is applied. */
export type ItemPlan = {
  name: string;
  type: Extract<RegistryItem['type'], 'registry:ui' | 'registry:lib'>;
  title: string;
  files: SourceFile[];
  dependencies: string[];
  registryDependencies: string[];
};

const NPM_NAME = /^(@[a-z0-9~-][a-z0-9._~-]*\/)?[a-z0-9~-][a-z0-9._~-]*$/;
const PLAIN_VERSION = /^[\^~]?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

const titleCase = (name: string) => name.replace(/(^|-)([a-z])/g, (_, dash: string, letter: string) => (dash ? ' ' : '') + letter.toUpperCase());

/**
 * The version each workspace package's registry range names: its own, unless held-versions.json holds it on the
 * version npm has because the new one is not published yet. `scripts/check-published.mjs` fails once a held
 * version is on npm, so the hold is removed then.
 */
export function workspaceRangeVersions(manifests: { name: string; version: string }[]): Record<string, string> {
  return { ...Object.fromEntries(manifests.map(({ name, version }) => [name, version])), ...heldVersions };
}

/**
 * The first usable spec (dependencies, then peers, then dev) decides. A published version or a
 * workspace package gets a caret range. A `*` peer range or a `github:` spec says nothing about a
 * published version, so the name stays bare and the next spec is tried.
 */
function withRange(name: string, manifest: UiManifest, workspaceVersions: Record<string, string>) {
  for (const specs of [manifest.dependencies, manifest.peerDependencies, manifest.devDependencies]) {
    const spec = specs?.[name];
    if (spec === undefined) continue;
    if (spec.startsWith('workspace:')) {
      const version = workspaceVersions[name];
      if (!version) throw new Error(`${name} is a workspace dependency but has no workspace version`);
      return `${name}@^${version}`;
    }
    const plain = PLAIN_VERSION.exec(spec);
    if (plain) return `${name}@^${plain[1]}`;
  }
  return name;
}

/** `@sveltery/base/dialog` -> `@sveltery/base`; null for `svelte` and `svelte/*`, which every project has. */
function packageOf(specifier: string, path: string) {
  const parts = specifier.split('/');
  const name = specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!;
  if (!NPM_NAME.test(name)) throw new Error(`${path}: cannot tell which package "${specifier}" belongs to`);
  return name === 'svelte' ? null : name;
}

export function planItems(sources: Record<string, string>, manifest: UiManifest, workspaceVersions: Record<string, string>): ItemPlan[] {
  const folders = new Map<string, SourceFile[]>();
  for (const [path, text] of Object.entries(sources).sort(([a], [b]) => (a < b ? -1 : 1))) {
    const [folder, file, ...nested] = path.split('/');
    if (!file || NOT_ITEMS.has(folder!) || !/\.(svelte|ts)$/.test(file) || file.endsWith('.test.ts')) continue;
    if (nested.length) throw new Error(`${path}: files nested below a component folder are not supported`);
    folders.set(folder!, [...(folders.get(folder!) ?? []), analyzeSource(path, text)]);
  }

  return [...folders].sort(([a], [b]) => (a < b ? -1 : 1)).map(([name, files]) => {
    const registryDependencies = new Set<string>();
    const packages = new Set<string>();
    for (const file of files) {
      for (const specifier of file.imports) {
        if (specifier.startsWith('../')) {
          const folder = specifier.slice(3).split('/')[0]!;
          if (folder === 'icons' || folder === name) continue;
          if (!folders.has(folder)) throw new Error(`${file.path}: imports ../${folder}/, which is not a registry item`);
          registryDependencies.add(folder);
        } else if (!specifier.startsWith('.')) {
          const pkg = packageOf(specifier, file.path);
          if (pkg) packages.add(pkg);
        }
      }
    }
    return {
      name,
      type: name === 'shared' ? 'registry:lib' : 'registry:ui',
      title: titleCase(name),
      files,
      dependencies: [...packages].sort().map((pkg) => withRange(pkg, manifest, workspaceVersions)),
      registryDependencies: [...registryDependencies].sort(),
    };
  });
}
