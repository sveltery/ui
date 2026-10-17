// @vitest-environment node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { build } from '../src/commands/build.js';

let cwd: string;
beforeEach(() => void (cwd = mkdtempSync(join(tmpdir(), 'sveltery-build-'))));
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

const write = (path: string, content: unknown) => {
  mkdirSync(dirname(join(cwd, path)), { recursive: true });
  writeFileSync(join(cwd, path), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
};
const readJson = (path: string): unknown => JSON.parse(readFileSync(join(cwd, path), 'utf8'));
const options = (extra: { output?: string } = {}) => ({ cwd, output: './static/r', ...extra });

const card = '<div class="rounded-lg border p-4">Hello</div>\n';
const index = "export { default as HelloCard } from './HelloCard.svelte';\n";

describe('build', () => {
  test('writes each item with its files inlined, and copies registry.json', () => {
    const registry = {
      $schema: 'https://ui.sveltery.dev/schema/registry.json',
      name: 'acme',
      homepage: 'https://acme.test',
      items: [
        {
          name: 'hello-card',
          type: 'registry:ui',
          title: 'Hello Card',
          registryDependencies: ['button'],
          files: [
            { path: 'src/lib/components/ui/hello-card/HelloCard.svelte', type: 'registry:ui' },
            { path: 'src/lib/components/ui/hello-card/index.ts', type: 'registry:ui', target: 'hello-card/index.ts' },
          ],
        },
        { name: 'greeting', type: 'registry:block', files: [{ path: 'src/routes/greeting/+page.svelte', type: 'registry:page', target: 'src/routes/greeting/+page.svelte' }] },
      ],
    };
    write('registry.json', registry);
    write('src/lib/components/ui/hello-card/HelloCard.svelte', card);
    write('src/lib/components/ui/hello-card/index.ts', index);
    write('src/routes/greeting/+page.svelte', '<h1>Hi</h1>\n');

    expect(build('./registry.json', options())).toEqual(['static/r/hello-card.json', 'static/r/greeting.json', 'static/r/registry.json']);
    expect(readJson('static/r/hello-card.json')).toEqual({
      $schema: 'https://ui.sveltery.dev/schema/registry-item.json',
      name: 'hello-card',
      type: 'registry:ui',
      title: 'Hello Card',
      registryDependencies: ['button'],
      files: [
        { path: 'src/lib/components/ui/hello-card/HelloCard.svelte', type: 'registry:ui', target: 'hello-card/HelloCard.svelte', content: card },
        { path: 'src/lib/components/ui/hello-card/index.ts', type: 'registry:ui', target: 'hello-card/index.ts', content: index },
      ],
    });
    expect(readJson('static/r/greeting.json')).toMatchObject({ files: [{ target: 'src/routes/greeting/+page.svelte', content: '<h1>Hi</h1>\n' }] });
    expect(readJson('static/r/registry.json')).toEqual(registry);
  });

  test('reads the registry file and writes the output relative to --cwd', () => {
    write('registry/registry.json', { name: 'acme', homepage: 'https://acme.test', items: [{ name: 'util', type: 'registry:lib', files: [{ path: 'lib/util.ts', type: 'registry:component' }] }] });
    write('lib/util.ts', 'export const x = 1;\n');
    expect(build('registry/registry.json', options({ output: 'out' }))).toEqual(['out/util.json', 'out/registry.json']);
    expect(readJson('out/util.json')).toMatchObject({ files: [{ path: 'lib/util.ts', target: 'util.ts' }] });
  });

  test('resolves include: file paths relative to the declaring registry.json, and a flattened catalog', () => {
    write('registry.json', { $schema: 'https://ui.sveltery.dev/schema/registry.json', name: 'acme', homepage: 'https://acme.test', include: ['ui/registry.json'], items: [{ name: 'page', type: 'registry:block', files: [] }] });
    write('ui/registry.json', { items: [{ name: 'hello-card', type: 'registry:ui', files: [{ path: 'hello-card/HelloCard.svelte', type: 'registry:ui' }] }] });
    write('ui/hello-card/HelloCard.svelte', card);

    expect(build('registry.json', options())).toEqual(['static/r/hello-card.json', 'static/r/page.json', 'static/r/registry.json']);
    expect(readJson('static/r/hello-card.json')).toMatchObject({ files: [{ path: 'ui/hello-card/HelloCard.svelte', target: 'hello-card/HelloCard.svelte', content: card }] });
    expect(readJson('static/r/registry.json')).toEqual({
      $schema: 'https://ui.sveltery.dev/schema/registry.json',
      name: 'acme',
      homepage: 'https://acme.test',
      items: [
        { name: 'hello-card', type: 'registry:ui', files: [{ path: 'ui/hello-card/HelloCard.svelte', type: 'registry:ui' }] },
        { name: 'page', type: 'registry:block', files: [] },
      ],
    });
  });

  test('stops on a missing registry, missing metadata, a missing file, a page without a target, and an item type the CLI cannot install', () => {
    expect(() => build('registry.json', options())).toThrow(`The path ${join(cwd, 'registry.json')} does not exist.`);
    write('registry.json', { items: [] });
    expect(() => build('registry.json', options())).toThrow(`Invalid root registry file at ${join(cwd, 'registry.json')}: root registry.json must define "name" and "homepage".`);
    const registry = (item: object) => write('registry.json', { name: 'acme', homepage: 'https://acme.test', items: [item] });
    registry({ name: 'gone', type: 'registry:ui', files: [{ path: 'gone.svelte', type: 'registry:ui' }] });
    expect(() => build('registry.json', options())).toThrow(`Failed to read file "gone.svelte" for registry item "gone" (${join(cwd, 'registry.json')} items[0]). Expected file at ${join(cwd, 'gone.svelte')}.`);
    write('page.svelte', '');
    registry({ name: 'page', type: 'registry:block', files: [{ path: 'page.svelte', type: 'registry:page' }] });
    expect(() => build('registry.json', options())).toThrow('File "page.svelte" of item "page" (');
    registry({ name: 'hook', type: 'registry:hook', files: [] });
    expect(() => build('registry.json', options())).toThrow('Item "hook" (');
    registry({ name: 'hook', type: 'registry:ui', files: [{ path: 'use-x.ts', type: 'registry:hook' }] });
    expect(() => build('registry.json', options())).toThrow(`Invalid registry file at ${join(cwd, 'registry.json')}: items[0].files[0].type: expected "registry:ui" or "registry:component" or "registry:page" or "registry:file", got "registry:hook"`);
  });

  test('rejects an item name that is not lowercase letters, digits and hyphens, and writes nothing', () => {
    const registry = { name: 'acme', homepage: 'https://acme.test', items: [{ name: '../../registry', type: 'registry:lib', files: [] }] };
    write('registry.json', registry);
    expect(() => build('registry.json', options())).toThrow(
      `Invalid registry file at ${join(cwd, 'registry.json')}: items[0].name: expected lowercase letters, digits and hyphens, starting with a letter or digit, got "../../registry"`,
    );
    expect(readJson('registry.json')).toEqual(registry);
    expect(existsSync(join(cwd, 'static'))).toBe(false);
  });

  test.each<[string, (dir: string) => string]>([
    ['https://example.com/x.svelte', () => 'remote file paths are not supported by build.'],
    ['/etc/hostname', () => 'file paths must be relative.'],
    ['../outside.txt', () => 'file paths cannot use parent-directory traversal.'],
    ['.', (dir) => `file paths must name a file inside ${dir}.`],
  ])('rejects the file path %s, with or without include', (path, reason) => {
    write('outside.txt', 'secret\n');
    write('registry.json', { name: 'acme', homepage: 'https://acme.test', items: [{ name: 'x', type: 'registry:lib', files: [{ path, type: 'registry:file', target: 'x.txt' }] }] });
    expect(() => build('registry.json', options())).toThrow(`Invalid file path "${path}" for item "x" in ${join(cwd, 'registry.json')}: ${reason(cwd)}`);
    write('registry.json', { name: 'acme', homepage: 'https://acme.test', include: ['a/registry.json'] });
    write('a/registry.json', { items: [{ name: 'x', type: 'registry:lib', files: [{ path, type: 'registry:file', target: 'x.txt' }] }] });
    expect(() => build('registry.json', options())).toThrow(`Invalid file path "${path}" for item "x" in ${join(cwd, 'a/registry.json')}: ${reason(join(cwd, 'a'))}`);
    expect(existsSync(join(cwd, 'static'))).toBe(false);
  });

  test('rejects include cycles, paths outside the registry, and duplicate names', () => {
    const root = (include: string[]) => write('registry.json', { name: 'acme', homepage: 'https://acme.test', include });
    root(['registry.json']);
    expect(() => build('registry.json', options())).toThrow(`Registry include cycle detected:\n  - ${join(cwd, 'registry.json')}\n  - ${join(cwd, 'registry.json')}`);
    root(['a/registry.json']);
    write('a/registry.json', { include: ['../registry.json'] });
    expect(() => build('registry.json', options())).toThrow('Invalid include "../registry.json"');
    write('a/registry.json', { include: ['b/registry.json'] });
    write('a/b/registry.json', { include: ['../../a/registry.json'] });
    expect(() => build('registry.json', options())).toThrow('Invalid include "../../a/registry.json"');
    write('a/registry.json', { items: [{ name: 'x', type: 'registry:lib', files: [] }] });
    write('b/registry.json', { items: [{ name: 'x', type: 'registry:lib', files: [] }] });
    root(['a/registry.json', 'b/registry.json']);
    expect(() => build('registry.json', options())).toThrow(`Duplicate registry item name "x". Registry item names must be unique.\n  - ${join(cwd, 'a/registry.json')} items[0]\n  - ${join(cwd, 'b/registry.json')} items[0]`);
    root(['a/registry.json', './a/registry.json']);
    expect(() => build('registry.json', options())).toThrow(`Registry file included more than once: ${join(cwd, 'a/registry.json')}.`);
  });
});
