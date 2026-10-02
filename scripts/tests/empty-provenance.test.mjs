import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('immutable Empty wrapper, complete deferred examples and scoped Nova retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/empty-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 3);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert.equal(pin.files[2].range, '585-616 (Empty section only)');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/empty-nova.css', 'utf8').trimEnd()));
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});

test('supplemental primitive probe does not claim or substitute any deferred gallery composition', () => {
  const source = readFileSync('tests/reference/empty-example.tsx', 'utf8');
  const probe = readFileSync('tests/reference/EmptyProbe.tsx', 'utf8');
  assert(source.includes('IconPlaceholder'));
  assert(source.includes('InputGroup'));
  for (const name of [...source.matchAll(/function (Empty\w+)\(/g)].map(match => match[1])) assert(!probe.includes(`function ${name}(`));
  assert(probe.includes('Supplemental Empty primitive probe'));
});
