import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable Alert wrapper, complete examples and scoped Nova retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/alert-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc'); assert.equal(pin.files.length, 3);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert.equal(pin.files[2].range, '19-42 (Alert section only)');
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});
test('Basic function is byte-exact inside an explicitly native Example scaffold; missing compositions stay deferred', () => {
  const source = readFileSync('tests/reference/alert-example.tsx', 'utf8');
  const gallery = readFileSync('tests/reference/AlertGallery.tsx', 'utf8');
  const selected = source.slice(source.indexOf('function AlertExample1()'), source.indexOf('function AlertExample2()')).trimEnd();
  assert(gallery.includes(selected)); assert(gallery.includes('function Example('));
  for (const deferred of ['AlertExample2', 'AlertExample3', 'AlertExample4', 'IconPlaceholder', 'Badge']) assert(!gallery.includes(deferred));
  assert(source.includes('import { Badge }')); assert(source.includes('import { IconPlaceholder }'));
});
