import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { supportsNode } from '../node-version.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
test('locked dependency engine boundary: reject early Node 24 and accept 24.15+', () => {
  for (const version of ['22.22.2', '24.0.0', '24.14.999', '25.0.0', '26.0.0', '24.15.0-rc.1']) assert.equal(supportsNode(version), false, version);
  for (const version of ['24.15.0', '24.15.1', '24.19.0', '24.21.0']) assert.equal(supportsNode(version), true, version);
  const metadata = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(metadata.engines.node, '>=24.15.0 <25');
});
test('actual CLI guard rejects unsupported Node before dependency commands', () => {
  const guard = fileURLToPath(new URL('../check-node.mjs', import.meta.url));
  for (const [version, status] of [['24.14.999', 1], ['24.15.0', 0], ['25.0.0', 1]]) {
    const mock = `data:text/javascript,Object.defineProperty(process.versions,"node",{value:"${version}"});`;
    const result = spawnSync(process.execPath, ['--import', mock, guard], { encoding: 'utf8' });
    assert.equal(result.status, status, result.stderr);
    if (status) assert.match(result.stderr, /Node >=24\.15\.0 <25/u);
  }
});
