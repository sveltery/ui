import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RegistryInput } from './build';
import { styleNames, type StyleName } from './types';

/** Reads the inputs of `buildRegistry` from a checkout of the repository. */
export function readRegistryInput(repoRoot: string, origin: string): RegistryInput {
  const ui = join(repoRoot, 'packages/ui');
  const lib = join(ui, 'src/lib');
  const text = (path: string) => readFileSync(path, 'utf8');

  const sources: RegistryInput['sources'] = {};
  for (const entry of readdirSync(lib, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(svelte|ts)$/.test(entry.name)) continue;
    const path = join(entry.parentPath, entry.name);
    sources[path.slice(lib.length + 1).replaceAll('\\', '/')] = text(path);
  }

  const workspaceVersions: Record<string, string> = {};
  for (const dir of readdirSync(join(repoRoot, 'packages'), { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const { name, version } = JSON.parse(text(join(repoRoot, 'packages', dir.name, 'package.json'))) as { name: string; version: string };
    workspaceVersions[name] = version;
  }

  return {
    sources,
    styles: Object.fromEntries(styleNames.map((style) => [style, text(join(lib, 'styles/scoped', `${style}.css`))])) as Record<StyleName, string>,
    themes: text(join(lib, 'styles/themes.css')),
    uiManifest: JSON.parse(text(join(ui, 'package.json'))),
    workspaceVersions,
    origin,
  };
}
