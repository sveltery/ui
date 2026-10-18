import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import { PUBLISH_ORDER, planRelease } from '../release-plan.mjs';

const pkg = (dir, version, published, rest = {}) => ({ dir, name: `@sveltery/${dir}`, version, private: false, published, ...rest });
const onNpm = ['0.0.0-stage', '0.1.0'];

test('a tag publishes only the packages whose version is new, and skips the rest', () => {
  const plan = planRelease('0.1.1', [pkg('cli', '0.1.1', onNpm), pkg('command', '0.1.0', onNpm), pkg('charts', '0.1.0', undefined), pkg('docs', '0.0.0', [], { private: true })]);
  assert.deepEqual(plan.publish, ['cli']);
  assert.equal(plan.error, undefined);
  assert.deepEqual(plan.notices, ['@sveltery/command@0.1.0 is already on npm.', '@sveltery/docs is private, not published.']);
  assert.match(plan.warnings.join('\n'), /^@sveltery\/charts is not on npm.*npm publish --access public/);
});

test('every package the tag would publish must be at its version', () => {
  const plan = planRelease('0.1.1', [pkg('cli', '0.1.1', onNpm), pkg('command', '0.1.2', onNpm)]);
  assert.deepEqual(plan.publish, []);
  assert.equal(plan.error, 'Tag v0.1.1 does not match the unpublished version of every package: @sveltery/command is at 0.1.2.');
});

test('a tag that matches no unpublished version fails', () => {
  const plan = planRelease('0.1.0', [pkg('cli', '0.1.0', onNpm), pkg('charts', '0.1.0', undefined)]);
  assert.deepEqual(plan.publish, []);
  assert.match(plan.error, /^No package has an unpublished version 0\.1\.0\./);
});

test('the publish order names every directory in packages/', () => {
  assert.deepEqual([...PUBLISH_ORDER].sort(), readdirSync(new URL('../../packages/', import.meta.url)).sort());
});
