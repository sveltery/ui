import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('the genuine installed shadcn artifact preserves pinned support CSS and complete MIT source', () => {
  const pin = JSON.parse(readFileSync('tests/reference/shadcn-css-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.version, '4.21.1');
  for (const file of pin.files) {
    const bytes = readFileSync(file.local);
    assert.equal(bytes.length, file.bytes, file.local);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, file.local);
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), file.gitBlob, file.local);
  }
  const packageRoot = dirname(dirname(fileURLToPath(import.meta.resolve('shadcn/tailwind.css'))));
  for (const file of pin.published.files) {
    const bytes = readFileSync(join(packageRoot, file.path));
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, file.path);
  }
  assert.deepEqual(readFileSync(join(packageRoot, 'dist/tailwind.css')), readFileSync('tests/reference/themes/upstream/shadcn-tailwind.css'));
  assert.deepEqual(readFileSync(join(packageRoot, 'LICENSE.md')), readFileSync('tests/reference/shadcn-css-upstream/LICENSE.md'));
  assert(readFileSync('packages/ui/THIRD_PARTY_NOTICES.md', 'utf8').includes(readFileSync(join(packageRoot, 'LICENSE.md'), 'utf8').trim()));
  const installed = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  assert.equal(installed.version, pin.version);
  assert.deepEqual(installed.dependencies, pin.published.dependencies);
  assert.equal(installed.exports['./tailwind.css'], './dist/tailwind.css');
  assert.deepEqual(installed.sideEffects, ['./dist/tailwind.css']);
  assert.equal(pin.originalShadcnImporter.dependencies.cn.version, '0.2.4');
  for (const path of ['package.json', 'apps/docs/package.json', 'packages/ui/package.json']) {
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    assert.equal(manifest.devDependencies.shadcn, '4.21.1');
    assert.equal(manifest.dependencies?.cn ?? manifest.devDependencies.cn, '0.2.2');
  }
  assert.equal(JSON.parse(readFileSync('packages/ui/package.json', 'utf8')).peerDependencies.shadcn, '4.21.1');
  assert(readFileSync('pnpm-lock.yaml', 'utf8').includes(pin.published.integrity));
  assert(readFileSync('pnpm-workspace.yaml', 'utf8').includes('"shadcn@4.21.1>cn": "0.2.4"'));
});
