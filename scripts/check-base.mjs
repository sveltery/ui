import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const pin = JSON.parse(readFileSync('scripts/base.lock.json', 'utf8'));
assert.equal(createHash('sha256').update(readFileSync('.vendor/sveltery-base-0.0.0.tgz')).digest('hex'), pin.sha256, 'Pinned Base tarball changed; review the source/build before updating its checksum');
console.log(`Pinned Base ${pin.commit} tarball checksum: PASS`);
