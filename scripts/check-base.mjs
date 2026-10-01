import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const pin = JSON.parse(readFileSync('scripts/base.lock.json', 'utf8'));
assert.match(pin.commit, /^[a-f0-9]{40}$/u, 'Base requires an immutable Git SHA');
assert.equal(pin.package, '@sveltery/base');
const archive = readFileSync('.vendor/sveltery-base-0.0.0.tgz');
assert.equal(createHash('sha256').update(archive).digest('hex'), pin.sha256, 'Pinned Base tarball changed; review the source/build before updating its checksum');
if (process.argv.includes('--lockfile')) {
  const integrity = `sha512-${createHash('sha512').update(archive).digest('base64')}`;
  const lockfile = readFileSync('pnpm-lock.yaml', 'utf8');
  assert(lockfile.includes(`resolution: {integrity: ${integrity}, tarball: file:.vendor/sveltery-base-0.0.0.tgz}`), 'Frozen lockfile does not match the verified Base archive; refresh the file dependency explicitly');
}
console.log(`Pinned Base ${pin.commit} tarball checksum: PASS`);
