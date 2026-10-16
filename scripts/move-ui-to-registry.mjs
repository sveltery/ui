#!/usr/bin/env node
// Moves the styled component source out of its workspace package into apps/docs/registry, the way
// shadcn keeps it in apps/v4/registry/bases/<base>, and rewrites every consumer to the `$registry`
// alias. Accepts the package under either name it has had (`@sveltery/ui`, `@sveltery/components`).
// Safe to rerun: after merging a branch that still edits the package, rerun it to fold the edits in.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const REGISTRY = 'apps/docs/registry';
const UI = `${REGISTRY}/bases/base/ui`;
const EXAMPLE = `${REGISTRY}/bases/base/components/example`;
const STYLES = `${REGISTRY}/styles`;
const NOTICES = `${REGISTRY}/THIRD_PARTY_NOTICES.md`;
const DOCS_MANIFEST = 'apps/docs/package.json';
const at = (path) => join(root, path);

/** Moves `from` onto `to`, replacing files `to` already has. */
function move(from, to) {
  mkdirSync(dirname(at(to)), { recursive: true });
  if (!existsSync(at(to))) return renameSync(at(from), at(to));
  cpSync(at(from), at(to), { recursive: true, force: true });
  rmSync(at(from), { recursive: true });
}

function movePackage() {
  const dir = readdirSync(at('packages')).map((name) => `packages/${name}`).find((path) => existsSync(at(`${path}/src/lib/button`)));
  if (!dir) return;
  const lib = `${dir}/src/lib`;
  const manifest = JSON.parse(readFileSync(at(`${dir}/package.json`), 'utf8'));

  for (const name of readdirSync(at(`${lib}/styles`))) move(`${lib}/styles/${name}`, `${STYLES}/${name}`);
  rmSync(at(`${lib}/styles`), { recursive: true });
  move(`${lib}/example`, EXAMPLE);
  rmSync(at(`${lib}/index.ts`), { force: true });
  for (const name of readdirSync(at(lib))) move(`${lib}/${name}`, `${UI}/${name}`);
  move(`${dir}/THIRD_PARTY_NOTICES.md`, NOTICES);

  // The registry reads dependency ranges from the docs manifest, so it gains what the source imports.
  const docs = JSON.parse(readFileSync(at(DOCS_MANIFEST), 'utf8'));
  for (const [name, range] of Object.entries({ ...manifest.dependencies, ...manifest.peerDependencies })) {
    if (docs.dependencies[name] || docs.devDependencies[name]) continue;
    docs.dependencies[name] = range.startsWith('workspace:') ? 'workspace:*' : range;
  }
  delete docs.dependencies[manifest.name];
  docs.dependencies = Object.fromEntries(Object.entries(docs.dependencies).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(at(DOCS_MANIFEST), `${JSON.stringify(docs, null, 2)}\n`);

  rmSync(at(dir), { recursive: true });
}

const CSS = { 'themes.css': 'themes.css', 'styles.css': 'styles.css', 'nova.css': 'style-nova.css', 'shadcn.css': 'shadcn.css' };
const specifier = /(['"])@sveltery\/(?:ui|components)\/([a-z0-9-]+(?:\/[a-z0-9-]+)?(?:\.css)?)\1/g;
const distSource = /@source "[./]*packages\/(?:ui|components)\/dist"/g;
const noticePath = /packages\/(?:ui|components)\/THIRD_PARTY_NOTICES\.md/g;

/** The `$registry` path for a package subpath, or a relative path for CSS, which Tailwind resolves without kit aliases. */
function target(file, subpath) {
  const relativeTo = (path) => relative(dirname(at(file)), at(path)).replaceAll('\\', '/');
  if (subpath in CSS) return relativeTo(`${STYLES}/${CSS[subpath]}`);
  if (subpath.startsWith('styles/')) return relativeTo(`${STYLES}/scoped/${subpath.slice('styles/'.length)}`);
  if (subpath === 'example') return '$registry/bases/base/components/example';
  return `$registry/bases/base/ui/${subpath}`;
}

// Prose (READMEs, docs pages, the CLI) is reworded by hand, not rewritten here.
const skip = (file) => file.startsWith('packages/') || file.startsWith('apps/docs/content/') || file === 'scripts/move-ui-to-registry.mjs';

function rewriteConsumers() {
  const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter((file) => /\.(svelte|ts|js|mjs|css)$/.test(file) && !skip(file) && existsSync(at(file)));
  let changed = 0;
  for (const file of files) {
    const before = readFileSync(at(file), 'utf8');
    const after = before
      .replace(specifier, (_match, quote, subpath) => `${quote}${target(file, subpath)}${quote}`)
      .replace(distSource, () => `@source "${relative(dirname(at(file)), at(`${REGISTRY}/bases`)).replaceAll('\\', '/')}"`)
      .replace(noticePath, NOTICES);
    if (after === before) continue;
    writeFileSync(at(file), after);
    changed++;
  }
  console.log(`Rewrote ${changed} files`);
}

movePackage();
rewriteConsumers();
