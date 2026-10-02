import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable native Example scaffold, required source variants and MIT notice retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/example-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of [...pin.files, pin.license]) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  for (const variant of readFileSync('tests/reference/example-variants.css', 'utf8').trim().split('\n')) {
    assert(readFileSync('apps/docs/src/lib/theme.css', 'utf8').includes(variant));
  }
  for (const name of ['skeleton', 'kbd']) {
    const selected = readFileSync(`tests/reference/${name}-selected-examples.tsx`, 'utf8');
    assert(selected.includes("import { Example } from './example-scaffold'"));
    assert(!selected.includes('function Example('), 'selected functions execute the actual source scaffold');
  }
});
