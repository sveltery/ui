import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { THEMES, baseColors, buildThemeForPreset, DEFAULT_CONFIG, generatedAssets, styles } from '../theme-assets.mjs';

test('pinned modern themes and all original styles retain exact source hashes', () => {
  const pin = JSON.parse(readFileSync('tests/reference/themes/sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 17);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256, file.upstream);
  assert.equal(styles.length, 8); assert.equal(THEMES.length, 24); assert.equal(baseColors.length, 7);
  for (const [path, expected] of generatedAssets()) assert.equal(readFileSync(path, 'utf8'), expected, path);
});

test('genuine upstream buildThemeForPreset test block retains all original expectations', () => {
  const source = readFileSync('tests/reference/themes/upstream/config.test.ts.source', 'utf8');
  const start = source.indexOf('describe("buildThemeForPreset"');
  const end = source.indexOf('\ndescribe(', start + 1);
  assert(readFileSync('tests/dom/themes-upstream.test.ts', 'utf8').includes(source.slice(start, end)));
});

test('every complete base plus permitted accent merges exact light/dark records', () => {
  for (const baseColor of baseColors) for (const theme of THEMES.filter(record => !baseColors.includes(record.name) || record.name === baseColor)) {
    const actual = buildThemeForPreset({ ...DEFAULT_CONFIG, baseColor, theme: theme.name, chartColor: theme.name });
    const base = THEMES.find(record => record.name === baseColor);
    for (const mode of ['light', 'dark']) assert.deepEqual(actual.cssVars[mode], { ...base.cssVars[mode], ...theme.cssVars[mode] });
  }
});

test('independent browser source app imports full original styles without production CSS or compatibility reset', () => {
  const original = readFileSync('tests/reference/themes/upstream/globals.css', 'utf8');
  assert.equal(readFileSync('tests/reference/themes/upstream/globals.reference.css', 'utf8'), original);
  const reference = readFileSync('tests/reference/themes/reference-app/reference.css', 'utf8');
  for (const style of styles) assert(reference.includes(`@import "../upstream/style-${style}.css" layer(components);`));
  assert(reference.includes('@import "../upstream/globals.reference.css";'));
  assert(!reference.includes('@sveltery/ui')); assert(!reference.includes('revert-layer'));
});

test('scoped universal base resets retain original zero specificity without changing source projections', async () => {
  const globals = readFileSync('tests/reference/themes/upstream/globals.css', 'utf8');
  const resets = [...globals.matchAll(/^ {2}\* \{\n {4}(@apply [^;]+;)\n {2}\}/gmu)];
  assert.equal(resets.length, 1, 'The immutable original must supply one universal base reset');
  const declaration = resets[0][1];
  assert.equal(declaration, '@apply border-border outline-ring/50;');
  const originalNames = [...readFileSync('tests/reference/themes/upstream/styles.tsx.source', 'utf8').matchAll(/^ {4}name: "([^"]+)",$/gmu)].map(match => match[1]);
  assert.deepEqual(styles, originalNames, 'Use all eight immutable original styles');
  const preimages = {
    vega: '67a369f0dc5ee33d8433b5e9e370ae13eaded52b',
    nova: 'd598155441bcb4c52ee696561dcb07784f45e190',
    maia: '034e97271c7bbb5a2999720b2177d7fe25179f03',
    lyra: '09e780e578c7542eb81a2bdae06af9912b7fc12f',
    mira: 'c05cd0b4a1e8db7f64d3dea8be9282694d02a093',
    luma: '00485a6d20bb3a3e123687c1429ce38b6eb2cf16',
    sera: '6521c5b36136480285be71db6c4933b38d1a742d',
    rhea: '5ba7db5e130ac4890f4c0c7a27048643872ffcc3',
  };
  const { JSDOM } = await import('jsdom');
  for (const style of originalNames) {
    const css = readFileSync(`apps/docs/registry/styles/scoped/${style}.css`, 'utf8');
    const selector = `:where(.style-${style}) *`;
    const reset = `@layer base {\n  ${selector} { ${declaration} }\n}`;
    assert.equal(css.split(reset).length, 2, `${style} must retain exactly one zero-specificity base reset`);
    const prior = css.replace(reset, `@layer base {\n  .style-${style} * { ${declaration} }\n}`);
    const bytes = Buffer.from(prior);
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), preimages[style], `${style}: only the universal reset carrier changes`);
    const dom = new JSDOM(`<div id="outside"></div><section class="style-${style}" id="scope"><button id="inside"></button><div class="style-${style}" id="nested"><span id="deep"></span></div></section>`);
    try {
      const ids = query => [...dom.window.document.querySelectorAll(query)].map(node => node.id);
      assert.deepEqual(ids(selector), ids(`.style-${style} *`), 'Keep the same descendant reach');
      assert.deepEqual(ids(selector), ['inside', 'nested', 'deep'], 'Scope host and outside nodes stay excluded');
    } finally {
      dom.window.close();
    }
  }
});
