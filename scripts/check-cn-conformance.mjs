// Run byte-exact dependency tests against the installed published package.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function packageRoot(name) {
  let directory = dirname(realpathSync(fileURLToPath(import.meta.resolve(name))));
  for (;;) {
    const manifest = join(directory, 'package.json');
    if (existsSync(manifest) && JSON.parse(readFileSync(manifest, 'utf8')).name === name) return directory;
    const parent = dirname(directory);
    assert.notEqual(parent, directory, `Cannot locate installed ${name} manifest`);
    directory = parent;
  }
}

const source = JSON.parse(readFileSync(new URL('../tests/reference/cn-sources.json', import.meta.url), 'utf8'));
const originalManifest = JSON.parse(readFileSync(new URL('../tests/reference/cn-upstream/packages/conformance/package.json', import.meta.url), 'utf8'));
const programs = originalManifest.scripts.test.split(' && ').map(command => {
  const name = /^node tests\/([\w-]+\.mjs)$/u.exec(command)?.[1];
  assert(name, `Unsupported original conformance command: ${command}`);
  const file = source.files.find(file => file.upstream === `packages/conformance/tests/${name}`);
  assert(file && file.role === 'genuine dependency conformance program', `Missing original conformance program: ${name}`);
  return file;
});
assert.equal(programs.length, 5);
const dependencies = { cn: source.version, clsx: source.oracle.clsx, 'tailwind-merge': source.oracle['tailwind-merge'] };
const roots = Object.fromEntries(Object.entries(dependencies).map(([name, version]) => {
  const root = packageRoot(name);
  assert.equal(JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version, version, `${name}: exact upstream oracle version`);
  return [name, root];
}));
const root = mkdtempSync(join(tmpdir(), 'sveltery-cn-conformance-'));
try {
  const tests = join(root, 'packages/conformance/tests');
  mkdirSync(tests, { recursive: true });
  mkdirSync(join(root, 'node_modules'));
  symlinkSync(roots.cn, join(root, 'packages/cn'), 'dir');
  for (const [name, directory] of Object.entries(roots)) symlinkSync(directory, join(root, 'node_modules', name), 'dir');
  for (const file of programs) {
    const destination = join(tests, file.upstream.split('/').at(-1));
    cpSync(new URL(`../${file.local}`, import.meta.url), destination);
    execFileSync(process.execPath, [destination], {
      cwd: root, stdio: 'inherit', env: { ...process.env, FUZZ_ITERS: String(source.oracle.fuzzIterations) },
    });
  }
  console.log('Five unchanged cn@0.2.2 dependency conformance programs: PASS (zero UI ordinary runtime-test credit)');
} finally {
  rmSync(root, { recursive: true, force: true });
}
