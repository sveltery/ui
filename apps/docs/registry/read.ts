import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RegistryInput } from './build';
import { workspaceRangeVersions } from './items';
import { styleNames, type StyleName } from './types';

/** Reads the inputs of `buildRegistry` from a checkout of the repository. */
export function readRegistryInput(repoRoot: string, origin: string): RegistryInput {
  const registry = join(repoRoot, 'apps/docs/registry');
  const lib = join(registry, 'bases/base/ui');
  const text = (path: string) => readFileSync(path, 'utf8');

  const sources: RegistryInput['sources'] = {};
  for (const entry of readdirSync(lib, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(svelte|ts)$/.test(entry.name)) continue;
    const path = join(entry.parentPath, entry.name);
    sources[path.slice(lib.length + 1).replaceAll('\\', '/')] = text(path);
  }

  const workspaceVersions = workspaceRangeVersions(
    readdirSync(join(repoRoot, 'packages'), { withFileTypes: true })
      .filter((dir) => dir.isDirectory())
      .map((dir) => JSON.parse(text(join(repoRoot, 'packages', dir.name, 'package.json'))) as { name: string; version: string }),
  );

  return {
    sources,
    styles: Object.fromEntries(styleNames.map((style) => [style, text(join(registry, 'styles/scoped', `${style}.css`))])) as Record<StyleName, string>,
    themes: text(join(registry, 'styles/themes.css')),
    uiManifest: JSON.parse(text(join(repoRoot, 'apps/docs/package.json'))),
    workspaceVersions,
    origin,
  };
}
