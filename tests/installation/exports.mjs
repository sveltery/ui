// Run from the consumer. Fails on file names that collide on case-insensitive disks, then writes
// exports.ts, which imports every code export of every installed @sveltery package for tsc.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const scope = 'node_modules/@sveltery';
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]));
const imports = [];
for (const name of readdirSync(scope)) {
  const root = join(scope, name);
  const seen = new Map();
  for (const file of files(root)) {
    const path = relative(root, file);
    const other = seen.get(path.toLowerCase());
    assert(!other, `@sveltery/${name} ships ${other} and ${path}, which collide on case-insensitive disks`);
    seen.set(path.toLowerCase(), path);
  }
  const { exports } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  for (const [subpath, target] of Object.entries(exports)) {
    if (subpath.includes('*') || typeof target === 'string' || !target.types) continue;
    imports.push(`@sveltery/${name}${subpath.slice(1)}`);
  }
}
writeFileSync('exports.ts', imports.map((specifier, i) => `export * as m${i} from '${specifier}';\n`).join(''));
console.log(`Checked ${readdirSync(scope).length} packages for case collisions and wrote ${imports.length} exports for tsc`);
