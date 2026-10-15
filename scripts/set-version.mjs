// Sets every package in packages/ to one version, or with --check, fails unless they all have it.
// Usage: node scripts/set-version.mjs 0.2.0 | node scripts/set-version.mjs --check v0.2.0
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const check = args[0] === '--check';
const version = (check ? args[1] : args[0])?.replace(/^v/, '');
if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error('Usage: node scripts/set-version.mjs [--check] <x.y.z>');
  process.exit(1);
}

const packages = new URL('../packages/', import.meta.url);
const mismatched = [];
for (const dir of readdirSync(packages)) {
  const file = new URL(`${dir}/package.json`, packages);
  const text = readFileSync(file, 'utf8');
  const pkg = JSON.parse(text);
  if (pkg.version === version) continue;
  if (check) mismatched.push(`${pkg.name} is ${pkg.version}`);
  else writeFileSync(file, text.replace(`"version": "${pkg.version}"`, `"version": "${version}"`));
}
if (mismatched.length) {
  console.error(`Expected every package at ${version}, but ${mismatched.join(', ')}.`);
  process.exit(1);
}
