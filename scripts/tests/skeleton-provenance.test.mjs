import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable shadcn Skeleton wrapper, examples and Nova rule retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/skeleton-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  const source = readFileSync('tests/reference/skeleton-nova.css', 'utf8');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(source.trimEnd()));
  const full = readFileSync('tests/reference/skeleton-example.tsx', 'utf8');
  const selected = readFileSync('tests/reference/skeleton-selected-examples.tsx', 'utf8');
  for (const name of ['Avatar', 'Card', 'Text', 'Form', 'Table']) {
    const start = full.indexOf(`function Skeleton${name}()`);
    assert(start >= 0, `${name} exists in the immutable upstream fixture`);
    const end = full.indexOf('\nfunction ', start + 1);
    assert(selected.includes(full.slice(start, end < 0 ? undefined : end).trimEnd()), `${name} selected function body is unchanged`);
  }
});
