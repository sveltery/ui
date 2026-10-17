// Fails when a package on npm has changed since its version was published, so a fix can't wait on a forgotten bump.
// Packs each public package already on npm at its version and compares the files with npm's tarball. A package whose
// version is not on npm yet is a bump waiting for its release, and passes.
// Usage: node scripts/check-published.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { PUBLISH_ORDER, publishedVersions } from './release-plan.mjs';

/**
 * What is wrong with one package, or nothing.
 * @param {{ name: string; version: string; published: string[] | undefined; held: string | undefined; changed: string[] | undefined }} pkg
 *   `published` is undefined when npm lacks the package. `held` is its entry in held-versions.json. `changed` lists the
 *   files that differ from npm's tarball of `version`, and is undefined when that version is not on npm.
 */
export function publishedProblem({ name, version, published, held, changed }) {
  if (held !== undefined && held !== version && published?.includes(version)) {
    return `${name}@${version} is on npm. Remove its entry from apps/docs/registry/held-versions.json so the registry installs it.`;
  }
  if (held !== undefined && !published?.includes(held)) return `held-versions.json holds ${name} at ${held}, which npm does not have.`;
  if (changed?.length) {
    return `${name} differs from ${name}@${version} on npm in ${changed.join(', ')}. Bump its version, add a CHANGELOG.md entry, and hold the registry on ${version} in apps/docs/registry/held-versions.json until the new version is published.`;
  }
}

/** Paths of the files under `dir`, relative to it. */
const files = (dir) => readdirSync(dir, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => relative(dir, join(entry.parentPath, entry.name)));

/** The files that differ between two unpacked tarballs, or that only one has. */
export function changedFiles(local, published) {
  const paths = [...new Set([...files(local), ...files(published)])].sort();
  const read = (dir, path) => {
    try {
      return readFileSync(join(dir, path));
    } catch {
      return undefined;
    }
  };
  return paths.filter((path) => {
    const [a, b] = [read(local, path), read(published, path)];
    return a === undefined || b === undefined || !a.equals(b);
  });
}

if (import.meta.main) {
  const root = new URL('..', import.meta.url).pathname;
  const held = JSON.parse(readFileSync(join(root, 'apps/docs/registry/held-versions.json'), 'utf8'));
  const work = mkdtempSync(join(tmpdir(), 'check-published-'));
  const run = (command, args, cwd) => execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  /** Packs into a new directory with `pack(dir)`, and unpacks the tarball there. */
  const unpack = (dir, pack) => {
    mkdirSync(dir);
    pack(dir);
    run('tar', ['-xzf', join(dir, readdirSync(dir).find((file) => file.endsWith('.tgz'))), '-C', dir]);
    return join(dir, 'package');
  };
  const problems = [];
  try {
    for (const dir of PUBLISH_ORDER) {
      const pkg = JSON.parse(readFileSync(join(root, 'packages', dir, 'package.json'), 'utf8'));
      if (pkg.private) continue;
      const published = publishedVersions(pkg.name);
      let changed;
      if (published?.includes(pkg.version)) {
        const source = join(root, 'packages', dir);
        run('pnpm', ['run', '--if-present', 'build'], source);
        const local = unpack(join(work, `${dir}-local`), (out) => run('pnpm', ['pack', '--pack-destination', out], source));
        const npm = unpack(join(work, `${dir}-npm`), (out) => run('npm', ['pack', `${pkg.name}@${pkg.version}`, '--pack-destination', out], work));
        changed = changedFiles(local, npm);
      }
      const problem = publishedProblem({ name: pkg.name, version: pkg.version, published, held: held[pkg.name], changed });
      if (problem) problems.push(problem);
      else console.log(`${pkg.name}@${pkg.version}: ${published === undefined ? 'not on npm' : changed === undefined ? 'new version, not on npm yet' : 'same as npm'}`);
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  for (const problem of problems) console.error(`::error::${problem}`);
  if (problems.length) process.exit(1);
}
