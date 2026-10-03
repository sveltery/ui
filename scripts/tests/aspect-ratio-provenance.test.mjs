import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable AspectRatio wrapper and complete examples retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/aspect-ratio-sources.json', 'utf8')); assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc'); assert.equal(pin.files.length, 2);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});
test('four original functions compose the genuine Example helper without a paired scaffold substitute', () => {
  const source = readFileSync('tests/reference/aspect-ratio-example.tsx', 'utf8'); const gallery = readFileSync('tests/reference/AspectRatioGallery.tsx', 'utf8');
  assert(gallery.includes(source.slice(source.indexOf('function AspectRatio16x9()')).trimEnd()));
  assert(gallery.includes('from \'./example-scaffold\''), 'reference must execute the complete immutable Example helper');
  assert(!gallery.includes('function Example(')); assert(!gallery.includes('function ExampleWrapper('));
  assert(gallery.includes(source.slice(source.indexOf('export default function'), source.indexOf('function AspectRatio16x9()')).replace('export default function AspectRatioExample()', 'export function AspectRatioGallery()').trimEnd()));
  assert(gallery.includes('function Image('), 'the separately recorded native-img Next fill adaptation remains explicit');
});
test('native gallery retains four named original bodies and actual canonical Example composition', () => {
  const source = readFileSync('apps/docs/examples/base/AspectRatioExample.svelte', 'utf8');
  assert(source.includes("import { Example, ExampleWrapper } from '@sveltery/ui/example'"));
  assert(source.includes('<ExampleWrapper class="max-w-4xl 2xl:max-w-4xl">'));
  assert(!source.includes('<section')); assert(!source.includes('<h2')); assert(!source.includes('{#each'));
  for (const name of ['AspectRatio16x9', 'AspectRatio1x1', 'AspectRatio9x16', 'AspectRatio21x9']) assert(source.includes(`{#snippet ${name}()}`));
  const calls = [...source.slice(source.indexOf('<ExampleWrapper')).matchAll(/\{@render (AspectRatio\w+)\(\)\}/gu)].map(match => match[1]);
  assert.deepEqual(calls, ['AspectRatio16x9', 'AspectRatio21x9', 'AspectRatio1x1', 'AspectRatio9x16']);
});
