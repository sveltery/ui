import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('cn reference sources and all five unchanged conformance programs retain immutable identities', () => {
  const pin = JSON.parse(readFileSync('tests/reference/cn-sources.json', 'utf8'));
  assert.equal(pin.commit, '788fe9bf71006c84e387c14b8d356f60f74956b6');
  assert.equal(pin.shadcnCommit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.version, '0.2.2');
  assert.equal(pin.files.filter(file => file.role === 'genuine dependency conformance program').length, 5);
  for (const file of pin.files) {
    const bytes = readFileSync(file.local);
    assert.equal(bytes.length, file.bytes, file.local);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, file.local);
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), file.gitBlob, file.local);
  }
});
