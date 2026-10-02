import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable AspectRatio wrapper and complete examples retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/aspect-ratio-sources.json', 'utf8')); assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc'); assert.equal(pin.files.length, 2);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});
test('four actual example functions are exact inside explicitly substituted Example/Next Image scaffolds', () => {
  const source = readFileSync('tests/reference/aspect-ratio-example.tsx', 'utf8'); const gallery = readFileSync('tests/reference/AspectRatioGallery.tsx', 'utf8');
  assert(gallery.includes(source.slice(source.indexOf('function AspectRatio16x9()')).trimEnd())); assert(gallery.includes('function Example(')); assert(gallery.includes('function Image('));
});
