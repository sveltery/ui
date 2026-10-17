// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildRegistry } from './build';
import { BASE_UI_PAGES, itemLinks } from './links';
import { readRegistryInput } from './read';
import type { RegistryManifest } from './types';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const page = (name: string) => `${repoRoot}apps/docs/content/docs/components/${name}.md`;
const manifest = buildRegistry(readRegistryInput(repoRoot, 'https://sveltery.test')).get('index.json') as RegistryManifest;

describe('itemLinks', () => {
  it('links the docs page, the page as Markdown and, when there is one, Base UI', () => {
    expect(itemLinks('dropdown-menu', 'https://ui.sveltery.dev')).toEqual({
      docs: 'https://ui.sveltery.dev/docs/components/dropdown-menu',
      examples: 'https://ui.sveltery.dev/docs/components/dropdown-menu.md',
      api: 'https://base-ui.com/react/components/menu.md',
    });
    expect(itemLinks('card', 'https://ui.sveltery.dev')).toEqual({ docs: 'https://ui.sveltery.dev/docs/components/card', examples: 'https://ui.sveltery.dev/docs/components/card.md' });
  });
});

describe('the served links', () => {
  it('point at a docs page that exists, for every item in the manifest', () => {
    expect(manifest.items.filter((item) => !existsSync(page(item.name))).map((item) => item.name)).toEqual([]);
  });

  it('give each item the links itemLinks makes', () => {
    for (const item of manifest.items) expect(item.meta?.links).toEqual(itemLinks(item.name, 'https://sveltery.test'));
  });

  it('name a Base UI page that the item exists in the manifest for and its docs page links', () => {
    const names = new Set(manifest.items.map((item) => item.name));
    for (const [name, path] of Object.entries(BASE_UI_PAGES)) {
      expect(names.has(name), `${name} is an item`).toBe(true);
      expect(readFileSync(page(name), 'utf8'), `${name}'s docs page links Base UI's ${path}`).toContain(`https://base-ui.com/react/${path}`);
    }
  });
});
