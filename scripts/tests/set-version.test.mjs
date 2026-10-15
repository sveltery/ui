import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const script = new URL('../set-version.mjs', import.meta.url).pathname;
const { version } = JSON.parse(readFileSync(new URL('../../packages/ui/package.json', import.meta.url), 'utf8'));
const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

test('--check passes for the tag of the version every package has', () => {
  assert.equal(run('--check', `v${version}`).status, 0);
});

test('--check names each package whose version differs from the tag', () => {
  const result = run('--check', 'v99.0.0');
  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`Expected every package at 99\\.0\\.0, but sveltery is ${version.replaceAll('.', '\\.')}, @sveltery/command is`));
  assert.match(result.stderr, /@sveltery\/ui is/);
});

test('a version that is not semver is refused', () => {
  assert.equal(run('--check', 'latest').status, 1);
});
