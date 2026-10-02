import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable shadcn Kbd wrapper, examples and Nova rule retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/kbd-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  const source = readFileSync('tests/reference/kbd-nova.css', 'utf8');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(source.trimEnd()));
});
