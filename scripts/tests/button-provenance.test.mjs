import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable shadcn Button wrapper and scoped Nova source retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/button-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  const source = readFileSync('tests/reference/button-nova.css', 'utf8');
  const styles = readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8');
  // Preserve every pinned selector/declaration, including sizes used by Dialog closes.
  for (const rule of source.matchAll(/ {2}\.cn-button[^}]+\}/gu)) assert(styles.includes(rule[0]), `Missing upstream Nova rule ${rule[0]}`);
});
