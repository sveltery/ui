import { buildRegistry, type RegistryInput } from '../../registry/build';
import { styleNames, type StyleName } from '../../registry/types';
import { site } from './site';

const LIB = '../../../../packages/ui/src/lib/';
const raw = (files: Record<string, string>, prefix: string) => Object.fromEntries(Object.entries(files).map(([path, text]) => [path.slice(prefix.length), text]));

const sources = import.meta.glob<string>(['../../../../packages/ui/src/lib/*/*.{svelte,ts}', '!../../../../packages/ui/src/lib/{icons,example}/*'], { query: '?raw', import: 'default', eager: true });
const styles = import.meta.glob<string>('../../../../packages/ui/src/lib/styles/scoped/*.css', { query: '?raw', import: 'default', eager: true });
const themes = import.meta.glob<string>('../../../../packages/ui/src/lib/styles/themes.css', { query: '?raw', import: 'default', eager: true });
const manifests = import.meta.glob<{ name: string; version: string }>('../../../../packages/*/package.json', { import: 'default', eager: true });

const input: RegistryInput = {
  sources: raw(sources, LIB),
  styles: Object.fromEntries(styleNames.map((style) => [style, styles[`${LIB}styles/scoped/${style}.css`]])) as Record<StyleName, string>,
  themes: Object.values(themes)[0]!,
  uiManifest: manifests['../../../../packages/ui/package.json']!,
  workspaceVersions: Object.fromEntries(Object.values(manifests).map(({ name, version }) => [name, version])),
  origin: site.url,
};

/** Every file the docs site serves under `/r`, keyed by its path below `/r`. */
export const registry = buildRegistry(input);
