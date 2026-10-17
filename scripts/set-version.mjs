// Sets every package in packages/ to one version. To release only some packages, bump those by hand instead.
// Usage: node scripts/set-version.mjs 0.2.0
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const version = process.argv[2]?.replace(/^v/, '');
if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error('Usage: node scripts/set-version.mjs <x.y.z>');
  process.exit(1);
}

const packages = new URL('../packages/', import.meta.url);
for (const dir of readdirSync(packages)) {
  const file = new URL(`${dir}/package.json`, packages);
  const text = readFileSync(file, 'utf8');
  const pkg = JSON.parse(text);
  if (pkg.version !== version) writeFileSync(file, text.replace(`"version": "${pkg.version}"`, `"version": "${version}"`));
}
