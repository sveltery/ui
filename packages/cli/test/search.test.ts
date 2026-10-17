// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { search, type SearchOptions } from '../src/commands/search.js';

const longDescription = 'A form for people who already have an account to sign in with their email and password, or with a provider such as GitHub.';
const manifest = {
  $schema: 'https://example.test/schema/registry.json',
  name: 'sveltery',
  registryVersion: 1,
  styles: ['nova'],
  baseColors: ['neutral'],
  iconLibraries: ['lucide'],
  items: [
    { name: 'alert-dialog', type: 'registry:ui', title: 'Alert Dialog' },
    { name: 'badge', type: 'registry:ui', title: 'Badge', description: 'Displays a badge.' },
    { name: 'button', type: 'registry:ui', title: 'Button' },
    { name: 'dialog', type: 'registry:ui', title: 'Dialog' },
    { name: 'tooltip', type: 'registry:ui' },
  ],
  blocks: [
    { name: 'login-01', type: 'registry:block', title: 'Login 01', description: longDescription },
    { name: 'sidebar-07', type: 'registry:block', title: 'Sidebar 07', description: 'A sidebar that collapses to icons.' },
  ],
};

let server: Server;
let cwd: string;
let requests = 0;

beforeAll(async () => {
  server = createServer((request, response) => {
    requests++;
    const found = request.url === '/r/index.json';
    response.writeHead(found ? 200 : 404, { 'content-type': 'application/json' }).end(found ? JSON.stringify(manifest) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  process.env.SVELTERY_REGISTRY_URL = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/r`;
});
afterAll(() => void server.close());
beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-search-'));
  requests = 0;
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

async function print(registries: string[], options: Partial<SearchOptions> = {}) {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  try {
    await search(registries, { cwd, json: false, ...options });
    return log.mock.calls.map(([line]) => line).join('\n');
  } finally {
    log.mockRestore();
  }
}

describe('search', () => {
  test('lists every item with its type and description, items before blocks', async () => {
    expect(await print([])).toBe(`Found 7 items in @sveltery
Showing 1-7 of 7

- alert-dialog (ui)
- badge (ui) — Displays a badge.
- button (ui)
- dialog (ui)
- tooltip (ui)
- login-01 (block) — A form for people who already have an account to sign in with their email...
- sidebar-07 (block) — A sidebar that collapses to icons.`);
  });

  test('--query ranks the best match first, and matches letters in order as shadcn does', async () => {
    const output = await print([], { query: 'dialog' });
    expect(output).toBe(`Found 3 items matching "dialog" in @sveltery
Showing 1-3 of 3

- dialog (ui)
- alert-dialog (ui)
- login-01 (block) — A form for people who already have an account to sign in with their email...`);
  });

  test('--query matches the description', async () => {
    expect(await print([], { query: 'collapses' })).toBe(`Found 1 item matching "collapses" in @sveltery
Showing 1-1 of 1

- sidebar-07 (block) — A sidebar that collapses to icons.`);
  });

  test('--type takes short and full names, comma-separated', async () => {
    expect(await print([], { type: 'block' })).toBe(await print([], { type: 'registry:block' }));
    expect(await print([], { type: 'block' })).toBe(`Found 2 items of type block in @sveltery
Showing 1-2 of 2

- login-01 (block) — A form for people who already have an account to sign in with their email...
- sidebar-07 (block) — A sidebar that collapses to icons.`);
    expect(await print([], { type: 'block', query: 'sidebar' })).toContain('Found 1 item of type block matching "sidebar" in @sveltery');
    expect(await print([], { type: 'ui,block', limit: '1' })).toContain('Found 7 items of type ui, block in @sveltery');
  });

  test('rejects an unknown type before it fetches anything', async () => {
    await expect(search([], { cwd, json: false, type: 'ui,hook,page' })).rejects.toThrow('Unknown types: hook, page. Valid types: ui, lib, theme, block, base, font.');
    await expect(search([], { cwd, json: false, type: 'hook' })).rejects.toThrow('Unknown type: hook.');
    expect(requests).toBe(0);
  });

  test('works in a project whose components.json names another style set', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'new-york' }));
    expect(await print([], { query: 'badge', limit: '1' })).toBe(`Found 1 item matching "badge" in @sveltery
Showing 1-1 of 1

- badge (ui) — Displays a badge.`);
  });

  test('--limit and --offset page through the items and say where the next page starts', async () => {
    expect(await print([], { limit: '2', offset: '1' })).toBe(`Found 7 items in @sveltery
Showing 2-3 of 7

- badge (ui) — Displays a badge.
- button (ui)

More items available. Use --offset 3 to see the next page.`);
    expect(await print([], { limit: '3', offset: '4' })).toBe(`Found 7 items in @sveltery
Showing 5-7 of 7

- tooltip (ui)
- login-01 (block) — A form for people who already have an account to sign in with their email...
- sidebar-07 (block) — A sidebar that collapses to icons.`);
  });

  test('--limit 0 shows every item', async () => {
    expect(await print([], { limit: '0' })).toContain('Showing 1-7 of 7');
  });

  test('reports an offset past the end as no items', async () => {
    expect(await print([], { offset: '50' })).toBe('No items found in @sveltery.');
  });

  test('says what it searched when nothing matches', async () => {
    expect(await print([], { query: 'zzzz', type: 'ui' })).toBe('No items found of type ui matching "zzzz" in @sveltery.');
  });

  test('--json prints the items with the registry and the argument to give add, and the pagination', async () => {
    const results = JSON.parse(await print([], { json: true, query: 'badge', limit: '5' }));
    expect(results).toEqual({
      pagination: { total: 1, offset: 0, limit: 5, hasMore: false },
      items: [{ name: 'badge', title: 'Badge', type: 'registry:ui', description: 'Displays a badge.', registry: '@sveltery', addCommandArgument: 'badge' }],
    });
  });

  test('accepts the registry by its address, once or repeated', async () => {
    const all = await print([]);
    expect(await print(['@sveltery'])).toBe(all);
    expect(await print(['@sveltery', '@sveltery'])).toBe(all);
  });

  test('names the registries it does not know and the one it has', async () => {
    await expect(search(['@acme', '@sveltery', 'https://example.com/r'], { cwd, json: false })).rejects.toThrow('Unknown registry "@acme", "https://example.com/r". The only registry is @sveltery.');
  });

  test('rejects a --limit or --offset that is not a whole number', async () => {
    await expect(search([], { cwd, json: false, limit: 'many' })).rejects.toThrow('--limit must be a whole number, got "many".');
    await expect(search([], { cwd, json: false, offset: '-1' })).rejects.toThrow('--offset must be a whole number, got "-1".');
  });
});
