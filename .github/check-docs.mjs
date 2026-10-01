import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const path of files) {
  const bytes = readFileSync(path);
  if (bytes.includes(0)) continue;
  const text = bytes.toString('utf8');
  assert(!/\r/u.test(text), `${path}: use LF line endings`);
  assert(!/[\t ]+$/mu.test(text), `${path}: trailing whitespace`);
  assert(text.endsWith('\n'), `${path}: missing final newline`);
  if (!path.endsWith('.md')) continue;
  for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/gu)) {
    const target = match[1].replace(/^<|>$/gu, '').split(/[?#]/u)[0];
    if (!target || /^[a-z][a-z\d+.-]*:/iu.test(target)) continue;
    assert(existsSync(resolve(dirname(path), decodeURIComponent(target))), `${path}: missing local link ${target}`);
  }
}
for (const path of ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'LICENSE']) {
  assert(files.includes(path), `Missing tracked ${path}`);
}
const license = readFileSync('LICENSE', 'utf8');
assert(license.startsWith('MIT License\n'), 'Expected the project MIT license');
assert(license.includes('Permission is hereby granted, free of charge'), 'Missing MIT permission notice');
assert(license.includes('THE SOFTWARE IS PROVIDED "AS IS"'), 'Missing MIT warranty notice');
assert(!readFileSync('README.md', 'utf8').includes('Licensing is pending'), 'README must reflect the settled license');
console.log(`Documentation, MIT license and whitespace: PASS (${files.length} tracked files)`);
