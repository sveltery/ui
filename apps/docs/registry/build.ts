import { fontItems } from './fonts';
import { inlineStyle } from './inline';
import { planBlock, planItems, type BlockSource, type ItemPlan, type UiManifest } from './items';
import { parseStyleSheet, type StyleSheet } from './styles';
import { parseThemes } from './themes';
import {
  REGISTRY_VERSION,
  accentColors,
  baseColors,
  iconLibraries,
  styleNames,
  type RegistryItem,
  type RegistryManifest,
  type RegistryOutput,
  type StyleIndexEntry,
  type StyleName,
} from './types';

export type RegistryInput = {
  /** `apps/docs/registry/bases/base/ui/<folder>/<file>` contents keyed by path relative to `bases/base/ui`, e.g. `button/variants.ts`. Includes every folder; the build skips `icons`. */
  sources: Record<string, string>;
  /** `styles/scoped/<style>.css` contents per style. */
  styles: Record<StyleName, string>;
  /** `styles/themes.css`. */
  themes: string;
  /** `apps/docs/package.json` parsed, plus each workspace helper's `package.json` version by package name. */
  uiManifest: UiManifest;
  workspaceVersions: Record<string, string>;
  /** Every block in `apps/docs/blocks`, with its files. */
  blocks: BlockSource[];
  /** Absolute origin of the docs site, for `$schema` URLs. */
  origin: string;
};

function renderItem(plan: ItemPlan, sheet: StyleSheet, style: StyleName, origin: string): RegistryItem {
  return {
    $schema: `${origin}/schema/registry-item.json`,
    name: plan.name,
    type: plan.type,
    title: plan.title,
    ...(plan.dependencies.length && { dependencies: plan.dependencies }),
    ...(plan.registryDependencies.length && { registryDependencies: plan.registryDependencies }),
    files: plan.files.map((file) => ({ type: 'registry:ui', target: file.path, content: inlineStyle(file, sheet, style) })),
  };
}

export function buildRegistry(input: RegistryInput): RegistryOutput {
  const origin = input.origin.replace(/\/+$/, '');
  const plans = planItems(input.sources, input.uiManifest, input.workspaceVersions);
  const sheets = Object.fromEntries(styleNames.map((style) => [style, parseStyleSheet(input.styles[style], style)])) as Record<StyleName, StyleSheet>;
  const output: RegistryOutput = new Map();
  const blocks = input.blocks.map((block) => ({ $schema: `${origin}/schema/registry-item.json`, ...planBlock(block, input.sources, input.uiManifest, input.workspaceVersions) }));

  const manifest: RegistryManifest = {
    $schema: `${origin}/schema/registry.json`,
    name: 'sveltery',
    registryVersion: REGISTRY_VERSION,
    styles: [...styleNames],
    baseColors: [...baseColors],
    iconLibraries: [...iconLibraries],
    items: plans.filter((plan) => plan.name !== 'shared').map(({ name, type }) => ({ name, type })),
    blocks: blocks.map(({ name, type, description }) => ({ name, type, description })),
  };
  output.set('index.json', manifest);

  // Upstream serves fonts under each style and leaves them out of the indexes, which a 0.1 CLI would reject for their type.
  const fonts = fontItems(origin);
  for (const style of styleNames) {
    const index: StyleIndexEntry[] = plans.map(({ name, type, registryDependencies }) => ({ name, type, registryDependencies, relativeUrl: `${name}.json` }));
    output.set(`styles/${style}/index.json`, index);
    for (const plan of plans) output.set(`styles/${style}/${plan.name}.json`, renderItem(plan, sheets[style], style, origin));
    for (const font of fonts) output.set(`styles/${style}/${font.name}.json`, font);
    for (const block of blocks) output.set(`styles/${style}/${block.name}.json`, block);
  }

  const themes = parseThemes(input.themes);
  for (const color of [...baseColors, ...accentColors]) {
    output.set(`themes/${color}.json`, {
      $schema: `${origin}/schema/registry-item.json`,
      name: color,
      type: 'registry:theme',
      title: color[0]!.toUpperCase() + color.slice(1),
      files: [],
      cssVars: themes[color],
    });
  }
  return output;
}
