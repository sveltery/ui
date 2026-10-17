// @vitest-environment node
import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { baseDependencies } from '../../../packages/cli/src/commands/init';
import { iconLibraries } from '../../../packages/cli/src/icons';
import { buildRegistry } from '../registry/build';
import { readRegistryInput } from '../registry/read';
import type { RegistryItem } from '../registry/types';

const docs = join(import.meta.dirname, '..');
const registry = buildRegistry(readRegistryInput(join(docs, '../..'), 'http://localhost'));
const item = (name: string) => registry.get(`styles/nova/${name}.json`) as RegistryItem;
const packageName = (spec: string) => spec.replace(/(.)@.*$/, '$1');
const fromInit = new Set([...baseDependencies, ...Object.values(iconLibraries).flatMap((library) => library.packages)].map(packageName));

const pages = globSync('content/docs/components/*.md', { cwd: docs }).flatMap((page) => {
  const content = readFileSync(join(docs, page), 'utf8');
  const name = /<ComponentSource name="([^"]+)"/.exec(content)?.[1];
  return name ? [{ page, name, content }] : [];
});

// Like upstream, the manual tab installs what `init` has not, and a component it adds with the CLI brings its own packages.
describe.each(pages)('$page', ({ name, content }) => {
  const listed = /### Install the dependencies\n\n```bash\nnpm install ([^\n]+)/.exec(content)?.[1].split(' ') ?? [];
  const added = new Set([...content.matchAll(/npx @sveltery\/ui@latest add ([a-z-]+)/g)].map((match) => match[1]).filter((added) => added !== name));

  const needed = new Set<string>();
  const visit = (folder: string, seen: Set<string>) => {
    if (seen.has(folder) || added.has(folder)) return;
    seen.add(folder);
    for (const spec of item(folder).dependencies ?? []) needed.add(packageName(spec));
    for (const dependency of item(folder).registryDependencies ?? []) visit(dependency, seen);
  };
  visit(name, new Set());

  it('installs every package the copied folders import', () => {
    expect([...needed].filter((pkg) => !fromInit.has(pkg) && !listed.includes(pkg))).toEqual([]);
  });

  it('leaves out the packages init installs', () => {
    expect(listed.filter((pkg) => fromInit.has(pkg))).toEqual([]);
  });
});
