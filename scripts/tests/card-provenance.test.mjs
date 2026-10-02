import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('immutable shadcn Card wrappers, examples and Nova rules retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/card-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of pin.files) {
    assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  }
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/card-nova.css', 'utf8').trimEnd()));
});

test('selected actual Card example function bodies remain byte-exact', () => {
  const original = readFileSync('tests/reference/card-example.tsx', 'utf8');
  const selected = readFileSync('tests/reference/card-selected-examples.tsx', 'utf8');
  for (const name of ['CardDefault', 'CardSmall', 'CardContentEdgeToEdge', 'CardHeaderWithBorder', 'CardFooterWithBorder', 'CardHeaderWithBorderSmall', 'CardFooterWithBorderSmall']) {
    const start = original.indexOf(`function ${name}()`);
    assert(start >= 0);
    const next = original.indexOf('\nfunction ', start + 1);
    const body = original.slice(start, next === -1 ? undefined : next).trimEnd();
    assert(selected.includes(body), `${name} keeps its actual body`);
  }
});
