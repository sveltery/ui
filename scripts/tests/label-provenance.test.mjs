import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('immutable Label wrapper, complete examples and scoped Nova retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/label-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 3);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert.equal(pin.files[2].range, '788-795 (Label section only)');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/label-nova.css', 'utf8').trimEnd()));
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});

test('With Textarea function is retained exactly in an explicitly native Example/Field scaffold', () => {
  const source = readFileSync('tests/reference/label-example.tsx', 'utf8');
  const gallery = readFileSync('tests/reference/LabelGallery.tsx', 'utf8');
  const selected = source.slice(source.indexOf('function LabelWithTextarea()')).trimEnd();
  assert(gallery.includes(selected));
  assert(gallery.includes('function Field('));
  for (const deferred of ['LabelWithCheckbox', 'LabelWithInput', 'LabelDisabled']) assert(!gallery.includes(deferred));
});
