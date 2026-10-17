import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const script = new URL('../set-version.mjs', import.meta.url).pathname;

test('a version that is not semver is refused', () => {
  assert.equal(spawnSync(process.execPath, [script, 'latest']).status, 1);
});
