// Source-derived theme/style asset projection; immutable upstream files and MIT credit in tests/reference/themes.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const styles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
export const baseColors = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'];
export const components = ['Alert', 'Avatar', 'Button', 'Card', 'Dialog', 'Empty', 'Kbd', 'Label', 'Skeleton', 'Table', 'Textarea'];
const sourceRoot = 'tests/reference/themes/upstream/';
const themeModule = stripTypeScriptTypes(readFileSync(`${sourceRoot}themes.ts.source`, 'utf8').replace(/^import[^\n]*\n/u, ''));
export const { THEMES } = await import(`data:text/javascript;base64,${Buffer.from(themeModule).toString('base64')}`);
export const DEFAULT_CONFIG = {
  base: "base",
  style: "nova",
  baseColor: "neutral",
  theme: "neutral",
  chartColor: "neutral",
  iconLibrary: "lucide",
  font: "inter",
  fontHeading: "inherit",
  item: "Item",
  rtl: false,
  pointer: false,
  menuAccent: "subtle",
  menuColor: "default",
  radius: "default",
  template: "next",
};
const radii = { none: '0', small: '0.45rem', medium: '0.625rem', large: '0.875rem' };

// Registry-independent adaptation of pinned buildRegistryTheme/buildThemeForPreset.
// Generates the actual shipped tokens; additional registry/CLI schema APIs are outside this slice.
export function buildThemeForPreset(config) {
  const base = THEMES.find(item => item.name === config.baseColor);
  const theme = THEMES.find(item => item.name === config.theme);
  assert(base && baseColors.includes(base.name) && theme, 'Select a canonical complete base and theme');
  assert(!baseColors.includes(theme.name) || theme.name === base.name, 'A different complete base is not an accent overlay');
  const cssVars = { light: { ...base.cssVars.light, ...theme.cssVars.light }, dark: { ...base.cssVars.dark, ...theme.cssVars.dark } };
  const chart = THEMES.find(item => item.name === config.chartColor);
  if (chart) for (const mode of ['light', 'dark']) for (let i = 1; i <= 5; i++) {
    const key = `chart-${i}`;
    if (chart.cssVars[mode][key]) cssVars[mode][key] = chart.cssVars[mode][key];
  }
  for (const mode of ['light', 'dark']) if (config.menuAccent === 'bold') {
    cssVars[mode].accent = cssVars[mode].primary;
    cssVars[mode]['accent-foreground'] = cssVars[mode]['primary-foreground'];
  }
  if (config.radius !== 'default' && radii[config.radius]) cssVars.light.radius = radii[config.radius];
  cssVars.light.radius ??= '0.625rem';
  return { $schema: 'https://ui.shadcn.com/schema/registry-item.json', name: `${base.name}-${theme.name}`, type: 'registry:theme', cssVars };
}

export function selectStyleSections(name) {
  const source = readFileSync(`${sourceRoot}style-${name}.css`, 'utf8');
  const markers = [...source.matchAll(/^ {2}\/\* MARK: (.+) \*\/\n/gmu)];
  return markers.flatMap((marker, index) => {
    if (!components.includes(marker[1])) return [];
    const start = marker.index;
    const end = markers[index + 1]?.index ?? source.lastIndexOf('\n}');
    const css = source.slice(start, end);
    return [{ component: marker[1], css, startLine: source.slice(0, start).split('\n').length, endLine: source.slice(0, end).split('\n').length - 1, sha256: createHash('sha256').update(css).digest('hex') }];
  });
}
const declarations = vars => Object.entries(vars).map(([key, value]) => `  --${key}: ${value};\n`).join('');
const geometry = Object.entries({ sm: 0.6, md: 0.8, lg: 1, xl: 1.4, '2xl': 1.8, '3xl': 2.2, '4xl': 2.6 }).map(([name, factor]) => `  --ui-radius-${name}: calc(var(--radius) * ${factor});\n`).join('');
const notice = '/* Derived from shadcn-ui/ui d75a96ab781f3d659be1ad287347d5887ce9f2fc; MIT: packages/ui/THIRD_PARTY_NOTICES.md. */\n';
export function themeCSS() {
  const neutral = buildThemeForPreset(DEFAULT_CONFIG).cssVars;
  const keys = Object.keys(neutral.light).filter(key => key !== 'radius');
  const radiusScales = { sm: 0.6, md: 0.8, lg: 1, xl: 1.4, '2xl': 1.8, '3xl': 2.2, '4xl': 2.6 };
  const fallback = { sm: '0.125rem', md: 'calc(var(--radius) - 2px)', lg: 'var(--radius)', xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' };
  const radiusMappings = Object.keys(radiusScales).map(key => `  --radius-${key}: var(--ui-radius-${key}, ${fallback[key]});\n`).join('');
  let css = `${notice}@custom-variant dark (&:is(.dark *));\n@theme inline {\n${keys.map(key => `  --color-${key}: var(--${key});\n`).join('')}${radiusMappings}}\n:root {\n${declarations(neutral.light)}}\n.dark {\n${declarations(neutral.dark)}}\n`;
  for (const theme of THEMES) css += `.theme-${theme.name} {\n${declarations(theme.cssVars.light)}}\n.dark.theme-${theme.name}, .dark .theme-${theme.name} {\n${declarations(theme.cssVars.dark)}}\n`;
  return css;
}
export function generatedAssets() {
  const assets = new Map([['apps/docs/registry/styles/themes.css', themeCSS()]]);
  const sections = {};
  // Omitted target-style declarations must also erase the historical fallback's classes.
  // This file contains only implemented component sections, never the full upstream library.
  const fallbackBody = readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8');
  const fallbackClasses = [...fallbackBody.matchAll(/\.cn-[a-z0-9-]+/gu)].map(match => match[0]);

  for (const name of styles) {
    const chosen = selectStyleSections(name);
    assert.equal(chosen.length, components.length, `Every current component section exists in ${name}`);
    sections[name] = chosen.map(({ css: _css, ...entry }) => entry);
    const body = chosen.map(entry => entry.css).join('');
    const selectors = [...new Set([...fallbackClasses, ...[...body.matchAll(/\.cn-[a-z0-9-]+/gu)].map(match => match[0])])].join(', ');
    // Match the strongest existing dark/state fallback without changing activation or source sections.
    const reset = scope => `.${scope}.${scope} :is(${selectors}) { all: revert-layer; --tw-leading: initial; }\n`;
    assets.set(`apps/docs/registry/styles/scoped/${name}.css`, `${notice}@import "tw-animate-css";\n@import "shadcn/tailwind.css";\n@custom-variant style-${name} (&:where(.style-${name} *));\n@layer base {\n  :where(.style-${name}) * { @apply border-border outline-ring/50; }\n}\n@layer components {\n${reset(`style-${name}`)}.style-${name}.style-${name} {\n${geometry}${body}}\n}\n`);

  }
  assets.set('apps/docs/registry/styles/styles.css', `${notice}${styles.map(name => `@import "./scoped/${name}.css";\n`).join('')}${styles.map(name => `@custom-variant style-${name} (&:where(.style-${name} *));\n`).join('')}`);

  assets.set('tests/reference/themes/sections.json', `${JSON.stringify(sections, null, 2)}\n`);
  return assets;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [path, css] of generatedAssets()) {
    if (process.argv.includes('--check')) assert.equal(readFileSync(path, 'utf8'), css, `${path} must match its source projection`);
    else { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, css); }
  }
}
