import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { THEMES, baseColors, buildThemeForPreset, DEFAULT_CONFIG, generatedAssets, styles } from '../theme-assets.mjs';

test('pinned modern themes and all original styles retain exact source hashes', () => {
  const pin = JSON.parse(readFileSync('tests/reference/themes/sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 15);
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
