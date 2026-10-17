// Copies react-resizable-panels' framework-free source into src/lib, then applies patches/*.patch.
// Usage: node scripts/sync-upstream.mjs <react-resizable-panels checkout at the pinned tag>
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = '4.5.8';
const COPIED = ['constants.ts', 'types.ts', 'global', 'utils', 'vendor', 'components/group/sortByElementOffset.ts', 'components/group/sortByElementOffset.test.ts', 'components/group/auto-save'];
const SKIPPED = ['utils/parseNumericStyleValue.ts', 'utils/parseNumericStyleValue.test.ts', 'global/test/moveSeparator.ts'];

const checkout = process.argv[2];
if (!checkout) throw new Error('Pass the path of a react-resizable-panels checkout.');
const version = JSON.parse(readFileSync(join(checkout, 'package.json'), 'utf8')).version;
if (version !== VERSION) throw new Error(`Expected react-resizable-panels ${VERSION}, found ${version}.`);

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(checkout, 'lib');
const target = join(pkg, 'src/lib');

for (const path of COPIED) {
  rmSync(join(target, path), { recursive: true, force: true });
  cpSync(join(source, path), join(target, path), { recursive: true });
}
for (const path of SKIPPED) rmSync(join(target, path));

function* files(path) {
  if (!existsSync(path)) return;
  if (!path.endsWith('.ts')) {
    for (const entry of readdirSync(path)) yield* files(join(path, entry));
    return;
  }
  yield path;
}

for (const path of COPIED.flatMap((entry) => [...files(join(target, entry))])) {
  const text = readFileSync(path, 'utf8');
  writeFileSync(path, text.replace(/((?:from|import)\s+")(\.{1,2}\/[^"]+?)(?<!\.js)"/g, '$1$2.js"'));
}

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: pkg, encoding: 'utf8' }).trim();
const patches = join(pkg, 'patches');
for (const patch of readdirSync(patches).filter((name) => name.endsWith('.patch')).sort()) {
  execFileSync('git', ['apply', `--directory=${relative(root, target)}`, join(patches, patch)], { cwd: root, stdio: 'inherit' });
}
