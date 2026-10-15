import { inlineStyle } from './inline';
import { planItems, type ItemPlan, type UiManifest } from './items';
import { parseStyleSheet, type StyleSheet } from './styles';
import { parseThemes } from './themes';
import {
  REGISTRY_VERSION,
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
  /** `packages/ui/src/lib/<folder>/<file>` contents keyed by path relative to `packages/ui/src/lib`, e.g. `button/variants.ts`. Includes every folder; the build skips `icons`, `styles`, `example` and the root `index.ts`. */
  sources: Record<string, string>;
  /** `styles/scoped/<style>.css` contents per style. */
  styles: Record<StyleName, string>;
  /** `styles/themes.css`. */
  themes: string;
  /** `packages/ui/package.json` parsed, plus each workspace helper's `package.json` version by package name. */
  uiManifest: UiManifest;
  workspaceVersions: Record<string, string>;
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

/** Every style must set the same `--ui-radius-*` scale, because the theme items carry one scale for all of them. */
function sharedRadii(sheets: Record<StyleName, StyleSheet>) {
  const [first, ...rest] = styleNames;
  const expected = JSON.stringify([...sheets[first].radii]);
  for (const style of rest) {
    if (JSON.stringify([...sheets[style].radii]) !== expected) throw new Error(`styles/scoped/${style}.css sets a different --ui-radius scale than ${first}.css`);
  }
  return sheets[first].radii;
}

export function buildRegistry(input: RegistryInput): RegistryOutput {
  const origin = input.origin.replace(/\/+$/, '');
  const plans = planItems(input.sources, input.uiManifest, input.workspaceVersions);
  const sheets = Object.fromEntries(styleNames.map((style) => [style, parseStyleSheet(input.styles[style], style)])) as Record<StyleName, StyleSheet>;
  const output: RegistryOutput = new Map();

  const manifest: RegistryManifest = {
    $schema: `${origin}/schema/registry.json`,
    name: 'sveltery',
    registryVersion: REGISTRY_VERSION,
    styles: [...styleNames],
    baseColors: [...baseColors],
    iconLibraries: [...iconLibraries],
    items: plans.filter((plan) => plan.name !== 'shared').map(({ name, type }) => ({ name, type })),
  };
  output.set('index.json', manifest);

  for (const style of styleNames) {
    const index: StyleIndexEntry[] = plans.map(({ name, type, registryDependencies }) => ({ name, type, registryDependencies, relativeUrl: `${name}.json` }));
    output.set(`styles/${style}/index.json`, index);
    for (const plan of plans) output.set(`styles/${style}/${plan.name}.json`, renderItem(plan, sheets[style], style, origin));
  }

  const themes = parseThemes(input.themes, sharedRadii(sheets));
  for (const color of baseColors) {
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
