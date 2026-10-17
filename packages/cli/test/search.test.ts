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

// The registry.json that `build` writes for @acme, which wants a bearer token.
const acmeCatalog = {
  name: 'acme',
  homepage: 'https://acme.test',
  items: [
    { name: 'hello', type: 'registry:ui', title: 'Hello', description: 'Says hello.', files: [{ path: 'src/lib/components/ui/hello/Hello.svelte', type: 'registry:ui' }] },
    { name: 'greet-dialog', type: 'registry:block', title: 'Greet Dialog' },
  ],
};
// A dynamic registry that filters and pages on the server.
const dynamicPage = {
  name: 'dynamic',
  homepage: 'https://dynamic.test',
  items: [{ name: 'server-pick', type: 'registry:ui', description: 'Picked by the server.' }],
  pagination: { total: 40, offset: 10, limit: 1, hasMore: true },
};

let server: Server;
let origin: string;
let cwd: string;
let requests: string[] = [];
const namespaceRequests = () => requests.filter((url) => !url.startsWith('/r/index.json'));

beforeAll(async () => {
  server = createServer((request, response) => {
    requests.push(request.url ?? '');
    const path = new URL(request.url ?? '/', 'http://x').pathname;
    if (path.startsWith('/acme/') && request.headers.authorization !== 'Bearer s3cret') return void response.writeHead(401).end();
    const body = { '/r/index.json': manifest, '/acme/registry.json': acmeCatalog, '/dynamic/registry.json': dynamicPage, '/source/registry.json': { ...acmeCatalog, include: ['ui/registry.json'] } }[path];
    response.writeHead(body ? 200 : 404, { 'content-type': 'application/json' }).end(body ? JSON.stringify(body) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  origin = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
  process.env.SVELTERY_REGISTRY_URL = `${origin}/r`;
});
afterAll(() => void server.close());
beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-search-'));
  requests = [];
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

/** Runs `search` with the defaults that the CLI's options give. */
async function print(registries: string[], options: Partial<SearchOptions> = {}) {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  try {
    await search(registries, { cwd, json: false, limit: '100', offset: '0', ...options });
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
    expect(requests).toEqual([]);
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

  test('names the registries it does not know and the ones it has', async () => {
    await expect(search(['@acme', '@sveltery', 'https://example.com/r'], { cwd, json: false })).rejects.toThrow(
      'Unknown registry "@acme", "https://example.com/r". The registries you can search are @sveltery. Define a namespace under "registries" in your components.json file to search it.',
    );
    configure({ '@acme': `${origin}/acme/{name}.json`, '@dynamic': `${origin}/dynamic/{name}.json` });
    await expect(search(['@other'], { cwd, json: false })).rejects.toThrow('Unknown registry "@other". The registries you can search are @sveltery, @acme, @dynamic.');
    expect(namespaceRequests()).toEqual([]);
  });

  test('rejects a --limit or --offset that is not a whole number', async () => {
    await expect(search([], { cwd, json: false, limit: 'many' })).rejects.toThrow('--limit must be a whole number, got "many".');
    await expect(search([], { cwd, json: false, offset: '-1' })).rejects.toThrow('--offset must be a whole number, got "-1".');
  });
});

const configure = (registries: unknown) => writeFileSync(join(cwd, 'components.json'), JSON.stringify({ registries }));
const acme = () => ({ url: `${origin}/acme/{name}.json`, headers: { Authorization: 'Bearer ${ACME_TOKEN}' } });

describe('search @namespace', () => {
  beforeEach(() => writeFileSync(join(cwd, '.env.local'), 'ACME_TOKEN=s3cret\n'));

  test('lists the items of the namespace\'s registry item, with the token from .env.local, as @namespace/name', async () => {
    configure({ '@acme': acme() });
    expect(await print(['@acme'])).toBe(`Found 2 items in @acme
Showing 1-2 of 2

- @acme/hello (ui) — Says hello.
- @acme/greet-dialog (block)`);
    expect(requests.at(-1)).toBe('/acme/registry.json?limit=100&offset=0');
  });

  test('forwards the query, the types and the page to the registry, and filters a static registry itself', async () => {
    configure({ '@acme': acme() });
    expect(await print(['@acme'], { query: 'dialog', type: 'block', limit: '5', offset: '0' })).toBe(`Found 1 item of type block matching "dialog" in @acme
Showing 1-1 of 1

- @acme/greet-dialog (block)`);
    expect(requests.at(-1)).toBe('/acme/registry.json?q=dialog&type=registry%3Ablock&limit=5&offset=0');
  });

  test('--json gives add the namespaced address', async () => {
    configure({ '@acme': acme() });
    expect(JSON.parse(await print(['@acme'], { json: true, query: 'hello' })).items).toEqual([
      { name: 'hello', title: 'Hello', type: 'registry:ui', description: 'Says hello.', registry: '@acme', addCommandArgument: '@acme/hello' },
    ]);
  });

  test('prints a dynamic registry\'s page and pagination as the server sent them, the search replacing a namespace parameter of the same name', async () => {
    configure({ '@dynamic': { url: `${origin}/dynamic/{name}.json`, params: { token: 'abc', limit: '999' } } });
    expect(await print(['@dynamic'], { query: 'zzzz', limit: '1', offset: '10' })).toBe(`Found 40 items matching "zzzz" in @dynamic
Showing 11-11 of 40

- @dynamic/server-pick (ui) — Picked by the server.

More items available. Use --offset 11 to see the next page.`);
    expect(requests.at(-1)).toBe('/dynamic/registry.json?token=abc&limit=1&q=zzzz&offset=10');
  });

  test('searches several registries together, names each result\'s registry, and asks each for the whole page', async () => {
    configure({ '@acme': acme(), '@dynamic': `${origin}/dynamic/{name}.json` });
    expect(await print(['@sveltery', '@acme', '@dynamic'], { query: 'dialog', limit: '3', offset: '1' })).toBe(`Found 44 items matching "dialog" in @sveltery, @acme, @dynamic
Showing 2-4 of 44

- dialog (ui) · @sveltery
- alert-dialog (ui) · @sveltery
- @acme/greet-dialog (block) · @acme

More items available. Use --offset 4 to see the next page.`);
    expect(namespaceRequests().sort()).toEqual(['/acme/registry.json?q=dialog&limit=4', '/dynamic/registry.json?q=dialog&limit=4']);
  });

  test('a @sveltery entry in registries replaces the built-in registry when @sveltery is named', async () => {
    configure({ '@sveltery': acme() });
    expect(await print(['@sveltery'], { limit: '1' })).toContain('- @sveltery/hello (ui) — Says hello.');
  });

  test('without a registry argument, reads the manifest even when registries sets @sveltery', async () => {
    const all = await print([]);
    configure({ '@sveltery': `${origin}/r/styles/{style}/{name}.json` });
    expect(await print([])).toBe(all);
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'new-york', registries: { '@sveltery': acme() } }));
    expect(await print([])).toBe(all);
    expect(namespaceRequests()).toEqual([]);
  });

  test('stops before any namespace request when an environment variable is missing', async () => {
    rmSync(join(cwd, '.env.local'));
    delete process.env.ACME_TOKEN;
    configure({ '@acme': acme() });
    await expect(search(['@acme'], { cwd, json: false })).rejects.toThrow('Registry "@acme" requires the following environment variables:\n\n  • ACME_TOKEN');
    expect(namespaceRequests()).toEqual([]);
  });

  test('sends no request, not even with the credentials that are set, when another registry is missing an environment variable', async () => {
    delete process.env.BETA_TOKEN;
    configure({ '@acme': acme(), '@beta': { url: `${origin}/acme/{name}.json`, headers: { Authorization: 'Bearer ${BETA_TOKEN}' } } });
    // The server may not have seen a request that fetch already started, so the sent requests are read from fetch.
    const fetched = vi.spyOn(globalThis, 'fetch');
    try {
      await expect(search(['@acme', '@beta'], { cwd, json: false })).rejects.toThrow('Registry "@beta" requires the following environment variables:\n\n  • BETA_TOKEN');
      expect(fetched.mock.calls.map(([url]) => String(url)).filter((url) => url.startsWith(`${origin}/acme/`))).toEqual([]);
    } finally {
      fetched.mockRestore();
    }
    expect(namespaceRequests()).toEqual([]);
  });

  test('names a rejected token and prints ${VAR} instead of its value', async () => {
    writeFileSync(join(cwd, '.env.local'), 'ACME_TOKEN=wrong\n');
    configure({ '@acme': { ...acme(), params: { token: '${ACME_TOKEN}' } } });
    const error = await search(['@acme'], { cwd, json: false }).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(error).toBeInstanceOf(Error);
    const message = (error as Error).message;
    expect(message).toContain(`You are not authorized to access the item at ${origin}/acme/registry.json?token=\${ACME_TOKEN}. If this is a remote registry, you may need to authenticate.`);
    expect(message).not.toContain('wrong');
  });

  test('rejects a registry item that is not a catalog, and one that still uses include', async () => {
    configure({ '@acme': `${origin}/r/{name}.json` });
    await expect(search(['@acme'], { cwd, json: false })).rejects.toThrow(`GET ${origin}/r/registry.json failed with 404 Not Found`);
    configure({ '@acme': `${origin}/r/index.json?{name}` });
    await expect(search(['@acme'], { cwd, json: false })).rejects.toThrow(`${origin}/r/index.json?registry is not a valid registry response. homepage: expected a string, got undefined`);
    configure({ '@acme': `${origin}/source/{name}.json` });
    await expect(search(['@acme'], { cwd, json: false })).rejects.toThrow('Registry catalog "@acme/registry" uses "include", but a registry must serve the resolved catalog.');
  });
});
