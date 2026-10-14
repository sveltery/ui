import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { iconNames } from '../icon-names.mjs';

const copy = { lucide: 'CopyIcon', tabler: 'IconCopy', hugeicons: 'Copy01Icon', phosphor: 'CopyIcon', remixicon: 'RiFileCopyLine' };

test('a library-keyed object literal names an icon', () => {
  const source = `<script>const ICONS = [{ lucide: 'CopyIcon', tabler: "IconCopy", hugeicons: 'Copy01Icon', phosphor: 'CopyIcon', remixicon: 'RiFileCopyLine' }];</script>`;
  assert.deepEqual(iconNames(source).map(({ names }) => names), [copy]);
});

test('an IconPlaceholder tag with literal attributes names an icon, and one that spreads a record names none', () => {
  const tag = `<IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="Copy01Icon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />`;
  assert.deepEqual(iconNames(`${tag}<IconPlaceholder {...icon} class="size-4" />`).map(({ names }) => names), [copy]);
});

test('the preview icon grid names its sixteen icons through its PREVIEW_ICONS records', () => {
  const grid = iconNames(readFileSync(new URL('../../apps/docs/blocks/preview/components/icon-preview-grid.svelte', import.meta.url), 'utf8'));
  assert.equal(grid.length, 16);
  assert.deepEqual(grid[0].names, copy);
  assert.deepEqual(grid.at(-1).names, { lucide: 'SettingsIcon', tabler: 'IconSettings', hugeicons: 'Settings01Icon', phosphor: 'GearIcon', remixicon: 'RiSettingsLine' });
});
