import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { changedFiles, publishedProblem } from '../check-published.mjs';

const pkg = (rest) => ({ name: '@sveltery/resizable', version: '0.1.0', published: ['0.1.0'], held: undefined, changed: [], ...rest });

test('a package that matches npm, a new version and a package npm lacks all pass', () => {
  assert.equal(publishedProblem(pkg({})), undefined);
  assert.equal(publishedProblem(pkg({ version: '0.2.0', changed: undefined, held: '0.1.0' })), undefined);
  assert.equal(publishedProblem(pkg({ published: undefined, changed: undefined })), undefined);
});

test('a change without a bump fails and names the files', () => {
  const drift = /^@sveltery\/resizable differs from @sveltery\/resizable@0\.1\.0 on npm in dist\/Panel\.svelte, README\.md\. Bump its version/;
  assert.match(publishedProblem(pkg({ changed: ['dist/Panel.svelte', 'README.md'] })), drift);
  assert.match(publishedProblem(pkg({ changed: ['dist/Panel.svelte', 'README.md'], held: '0.1.0' })), drift);
});

test('a hold fails once the new version is published, or when npm lacks the held version', () => {
  assert.match(publishedProblem(pkg({ version: '0.2.0', published: ['0.1.0', '0.2.0'], held: '0.1.0' })), /^@sveltery\/resizable@0\.2\.0 is on npm\. Remove its entry/);
  assert.match(publishedProblem(pkg({ version: '0.2.0', changed: undefined, held: '0.0.9' })), /holds @sveltery\/resizable at 0\.0\.9, which npm does not have/);
});

test('changedFiles finds edited, added and removed files', () => {
  const root = mkdtempSync(join(tmpdir(), 'changed-files-'));
  for (const [side, files] of Object.entries({ local: { 'a.js': '1', 'dist/b.js': '2', 'new.js': '' }, npm: { 'a.js': '1', 'dist/b.js': '3', 'gone.js': '' } })) {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(join(root, side, path, '..'), { recursive: true });
      writeFileSync(join(root, side, path), content);
    }
  }
  assert.deepEqual(changedFiles(join(root, 'local'), join(root, 'npm')), ['dist/b.js', 'gone.js', 'new.js']);
});
