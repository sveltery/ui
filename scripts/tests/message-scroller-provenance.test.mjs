import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('genuine MessageScroller geometry assertions retain immutable sources and only an import adaptation', () => {
  const ledger = JSON.parse(readFileSync('tests/reference/message-scroller-tests.json', 'utf8'));
  assert.equal(ledger.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of ledger.files) {
    const bytes = readFileSync(file.local);
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), file.blob);
  }
  const original = readFileSync('tests/reference/shadcn-react/message-scroller/geometry.test.ts', 'utf8');
  const adaptation = ledger.test_adaptation;
  assert.equal(readFileSync(ledger.adapted_test, 'utf8'), original.replace(adaptation.original_import, adaptation.replacement_import));
  assert.equal((original.match(/\bit\(/g) ?? []).length, 17);
  assert.equal((original.match(/\bexpect\(/g) ?? []).length, 18);
  assert.equal(ledger.geometry.cases.length, 17);
  assert.equal(ledger.geometry.cases.reduce((count, entry) => count + entry.expect_calls, 0), 18);
  assert.equal(ledger.geometry.svelte_implementation_credit, 0);
  assert(readFileSync('tests/reference/shadcn-react/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});
