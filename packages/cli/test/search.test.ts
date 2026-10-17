// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { add } from '../src/commands/add.js';
import { search, SEARCH_CONCURRENCY, type SearchOptions } from '../src/commands/search.js';

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

beforeAll(async () => {
  server = createServer((request, response) => {
    requests.push(request.url ?? '');
    const path = new URL(request.url ?? '/', 'http://x').pathname;
    if (path.startsWith('/acme/') && request.headers.authorization !== 'Bearer s3cret') return void response.writeHead(401).end();
    const body = { '/r/index.json': manifest, '/acme/registry.json': acmeCatalog, '/public/registry.json': acmeCatalog, '/dynamic/registry.json': dynamicPage, '/source/registry.json': { ...acmeCatalog, include: ['ui/registry.json'] } }[path];
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
    expect(await print(['@sveltery'])).toBe(`Found 7 items in @sveltery
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
    const output = await print(['@sveltery'], { query: 'dialog' });
    expect(output).toBe(`Found 3 items matching "dialog" in @sveltery
Showing 1-3 of 3

- dialog (ui)
- alert-dialog (ui)
- login-01 (block) — A form for people who already have an account to sign in with their email...`);
  });

  test('--query matches the description', async () => {
    expect(await print(['@sveltery'], { query: 'collapses' })).toBe(`Found 1 item matching "collapses" in @sveltery
Showing 1-1 of 1

- sidebar-07 (block) — A sidebar that collapses to icons.`);
  });

  test('--type takes short and full names, comma-separated', async () => {
    expect(await print(['@sveltery'], { type: 'block' })).toBe(await print(['@sveltery'], { type: 'registry:block' }));
    expect(await print(['@sveltery'], { type: 'block' })).toBe(`Found 2 items of type block in @sveltery
Showing 1-2 of 2

- login-01 (block) — A form for people who already have an account to sign in with their email...
- sidebar-07 (block) — A sidebar that collapses to icons.`);
    expect(await print(['@sveltery'], { type: 'block', query: 'sidebar' })).toContain('Found 1 item of type block matching "sidebar" in @sveltery');
    expect(await print(['@sveltery'], { type: 'ui,block', limit: '1' })).toContain('Found 7 items of type ui, block in @sveltery');
  });

  test('rejects an unknown type before it fetches anything', async () => {
    await expect(search(['@sveltery'], { cwd, json: false, type: 'ui,hook,page' })).rejects.toThrow('Unknown types: hook, page. Valid types: ui, lib, theme, block, base, font.');
    await expect(search(['@sveltery'], { cwd, json: false, type: 'hook' })).rejects.toThrow('Unknown type: hook.');
    expect(requests).toEqual([]);
  });

  test('works in a project whose components.json names another style set', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'new-york' }));
    expect(await print(['@sveltery'], { query: 'badge', limit: '1' })).toBe(`Found 1 item matching "badge" in @sveltery
Showing 1-1 of 1

- badge (ui) — Displays a badge.`);
  });

  test('--limit and --offset page through the items and say where the next page starts', async () => {
    expect(await print(['@sveltery'], { limit: '2', offset: '1' })).toBe(`Found 7 items in @sveltery
Showing 2-3 of 7

- badge (ui) — Displays a badge.
- button (ui)

More items available. Use --offset 3 to see the next page.`);
    expect(await print(['@sveltery'], { limit: '3', offset: '4' })).toBe(`Found 7 items in @sveltery
Showing 5-7 of 7

- tooltip (ui)
- login-01 (block) — A form for people who already have an account to sign in with their email...
- sidebar-07 (block) — A sidebar that collapses to icons.`);
  });

  test('--limit 0 shows every item', async () => {
    expect(await print(['@sveltery'], { limit: '0' })).toContain('Showing 1-7 of 7');
  });

  test('reports an offset past the end as no items', async () => {
    expect(await print(['@sveltery'], { offset: '50' })).toBe('No items found in @sveltery.');
  });

  test('says what it searched when nothing matches', async () => {
    expect(await print(['@sveltery'], { query: 'zzzz', type: 'ui' })).toBe('No items found of type ui matching "zzzz" in @sveltery.');
  });

  test('--json prints the items with the registry and the argument to give add, and the pagination', async () => {
    const results = JSON.parse(await print(['@sveltery'], { json: true, query: 'badge', limit: '5' }));
    expect(results).toEqual({
      pagination: { total: 1, offset: 0, limit: 5, hasMore: false },
      items: [{ name: 'badge', title: 'Badge', type: 'registry:ui', description: 'Displays a badge.', registry: '@sveltery', addCommandArgument: 'badge' }],
    });
  });

  test('searches a registry named twice twice, as upstream does', async () => {
    const twice = await print(['@sveltery', '@sveltery'], { query: 'badge' });
    expect(twice).toBe(`Found 2 items matching "badge" in @sveltery, @sveltery
Showing 1-2 of 2

- badge (ui) · @sveltery — Displays a badge.
- badge (ui) · @sveltery — Displays a badge.`);
  });

  test('names the namespaces it does not know and the ones it has, and rejects an address that is no namespace, URL or GitHub source', async () => {
    await expect(search(['@acme', '@sveltery', '@other'], { cwd, json: false })).rejects.toThrow(
      'Unknown registry "@acme", "@other". The namespaces you can search are @sveltery. Define a namespace under "registries" in your components.json file to search it.',
    );
    configure({ '@acme': `${origin}/acme/{name}.json`, '@dynamic': `${origin}/dynamic/{name}.json` });
    await expect(search(['@other'], { cwd, json: false })).rejects.toThrow('Unknown registry "@other". The namespaces you can search are @sveltery, @acme, @dynamic.');
    await expect(search(['acme', `${origin}/public/registry.json`], { cwd, json: false })).rejects.toThrow('Invalid registry namespace: "acme". Registry names must start with @');
    expect(requests).toEqual([]);
  });

  test('sends no request for a namespace that components.json does not define', async () => {
    configure({ '@acme': acme() });
    await expect(search(['@nope'], { cwd, json: false })).rejects.toThrow('Unknown registry "@nope".');
    expect(requests).toEqual([]);
  });

  test('rejects a --limit or --offset that is not a whole number', async () => {
    await expect(search(['@sveltery'], { cwd, json: false, limit: 'many' })).rejects.toThrow('--limit must be a whole number, got "many".');
    await expect(search(['@sveltery'], { cwd, json: false, offset: '-1' })).rejects.toThrow('--offset must be a whole number, got "-1".');
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
    expect(requests.filter((url) => !url.startsWith('/r/')).sort()).toEqual(['/acme/registry.json?q=dialog&limit=4', '/dynamic/registry.json?q=dialog&limit=4']);
  });

  test('refuses a @sveltery entry in registries before any request, as add and view do', async () => {
    configure({ '@sveltery': acme(), '@acme': acme() });
    for (const registries of [['@sveltery'], ['@acme'], []]) {
      await expect(search(registries, { cwd, json: false })).rejects.toThrow('"@sveltery" is a built-in registry and cannot be overridden.');
    }
    expect(requests).toEqual([]);
  });

  test('stops before any request when an environment variable is missing', async () => {
    rmSync(join(cwd, '.env.local'));
    delete process.env.ACME_TOKEN;
    configure({ '@acme': acme() });
    await expect(search(['@sveltery', '@acme'], { cwd, json: false })).rejects.toThrow('Registry "@acme" requires the following environment variables:\n\n  • ACME_TOKEN');
    expect(requests).toEqual([]);
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
    expect(requests).toEqual([]);
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

describe('search with no registry argument', () => {
  beforeEach(() => writeFileSync(join(cwd, '.env.local'), 'ACME_TOKEN=s3cret\n'));
  afterEach(() => void (process.exitCode = undefined));

  test('searches every namespace in components.json, asking each for the whole page', async () => {
    configure({ '@acme': acme(), '@dynamic': `${origin}/dynamic/{name}.json` });
    expect(await print([], { query: 'dialog' })).toBe(`Found 41 items matching "dialog" in @acme, @dynamic
Showing 1-41 of 41

- @dynamic/server-pick (ui) · @dynamic — Picked by the server.
- @acme/greet-dialog (block) · @acme`);
    expect(requests.sort()).toEqual(['/acme/registry.json?q=dialog&limit=100', '/dynamic/registry.json?q=dialog&limit=100']);
  });

  test('asks for a registry, before any request, when there is no components.json', async () => {
    await expect(search([], { cwd, json: false })).rejects.toThrow(
      'Provide a registry or namespace to search, e.g. `npx @sveltery/ui@latest search @sveltery`.\n\nIf you have a components.json with registries configured, run `npx @sveltery/ui@latest search` with no arguments to search all of them.',
    );
    expect(requests).toEqual([]);
  });

  test('says no registries are configured when components.json lists none, as @sveltery is left out', async () => {
    const message = 'No registries are configured in components.json.\nProvide a registry or namespace to search, e.g. `npx @sveltery/ui@latest search @sveltery`.';
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'nova' }));
    await expect(search([], { cwd, json: false })).rejects.toThrow(message);
    expect(requests).toEqual([]);
  });

  test('skips a registry that fails, or lacks an environment variable, names it, and searches the rest', async () => {
    delete process.env.BETA_TOKEN;
    configure({ '@beta': { url: `${origin}/acme/{name}.json`, headers: { Authorization: 'Bearer ${BETA_TOKEN}' } }, '@gone': `${origin}/gone/{name}.json`, '@acme': acme() });
    expect(await print([], { query: 'hello' })).toBe(`Skipped @beta: Registry "@beta" requires the following environment variables:

  • BETA_TOKEN

Set the required environment variables to your .env or .env.local file.
Skipped @gone: GET ${origin}/gone/registry.json?q=hello&limit=100 failed with 404 Not Found

Found 1 item matching "hello" in @beta, @gone, @acme
Showing 1-1 of 1

- @acme/hello (ui) · @acme — Says hello.`);
    // @beta's URL is @acme's, so a request without @acme's token would mean @beta's was sent.
    expect(requests.sort()).toEqual(['/acme/registry.json?q=hello&limit=100', '/gone/registry.json?q=hello&limit=100']);
    const results = JSON.parse(await print([], { json: true, query: 'hello' }));
    expect(results.errors).toEqual([
      { registry: '@beta', message: expect.stringContaining('BETA_TOKEN') },
      { registry: '@gone', message: `GET ${origin}/gone/registry.json?q=hello&limit=100 failed with 404 Not Found` },
    ]);
    expect(results.items.map((item: { addCommandArgument: string }) => item.addCommandArgument)).toEqual(['@acme/hello']);
    expect(process.exitCode).toBeUndefined();
  });

  test('prints the skipped registries and exits with 1 when every registry fails, as upstream does', async () => {
    configure({ '@gone': `${origin}/gone/{name}.json` });
    expect(await print([])).toBe(`Skipped @gone: GET ${origin}/gone/registry.json?limit=100&offset=0 failed with 404 Not Found

No items found in @gone.`);
    expect(process.exitCode).toBe(1);
  });

  test('prints no errors when every registry answers', async () => {
    configure({ '@acme': acme() });
    expect(JSON.parse(await print([], { json: true })).errors).toBeUndefined();
  });

  test('searches the namespaces while the Sveltery registry is unreachable, as it is not searched', async () => {
    const closed = createServer();
    await new Promise<void>((done) => closed.listen(0, '127.0.0.1', done));
    const address = closed.address();
    await new Promise((done) => closed.close(done));
    const unreachable = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/r`;
    process.env.SVELTERY_REGISTRY_URL = unreachable;
    try {
      configure({ '@acme': acme() });
      expect(await print(['@acme'], { query: 'hello' })).toContain('- @acme/hello (ui) — Says hello.');
      expect(JSON.parse(await print([], { json: true })).errors).toBeUndefined();
      expect(process.exitCode).toBeUndefined();
      await expect(search(['@sveltery'], { cwd, json: false })).rejects.toThrow(`Could not reach ${unreachable}/index.json`);
    } finally {
      process.env.SVELTERY_REGISTRY_URL = `${origin}/r`;
    }
  });

  test(`fetches at most ${SEARCH_CONCURRENCY} registries at once`, async () => {
    const names = Array.from({ length: SEARCH_CONCURRENCY + 2 }, (_, index) => `@r${index}`);
    configure(Object.fromEntries(names.map((name) => [name, `${origin}/public/{name}.json?from=${name}`])));
    const original = globalThis.fetch;
    let running = 0;
    let most = 0;
    const fetched = vi.spyOn(globalThis, 'fetch').mockImplementation(async (...args) => {
      most = Math.max(most, ++running);
      try {
        return await original(...args);
      } finally {
        running--;
      }
    });
    try {
      const results = JSON.parse(await print([], { json: true, query: 'hello' }));
      expect(results.items.map((item: { registry: string }) => item.registry).sort()).toEqual(names);
    } finally {
      fetched.mockRestore();
    }
    expect([most, requests.length]).toEqual([SEARCH_CONCURRENCY, names.length]);
  });
});

describe('search <url>', () => {
  test('reads the registry.json at the URL, forwards the search, and gives add the item URL', async () => {
    const url = `${origin}/public/registry.json`;
    expect(await print([url], { query: 'hello' })).toBe(`Found 1 item matching "hello" in ${url}
Showing 1-1 of 1

- ${origin}/public/hello.json (ui) — Says hello.`);
    expect(requests).toEqual(['/public/registry.json?q=hello&limit=100&offset=0']);
    expect(JSON.parse(await print([url], { json: true, query: 'hello' })).items).toEqual([
      { name: 'hello', title: 'Hello', type: 'registry:ui', description: 'Says hello.', registry: url, addCommandArgument: `${origin}/public/hello.json` },
    ]);
  });

  test('keeps the URL\'s own query, the search replacing a parameter of the same name, and pages a dynamic registry on the server', async () => {
    const url = `${origin}/dynamic/registry.json?token=abc&limit=999`;
    expect(await print([url], { query: 'zzzz', limit: '1', offset: '10' })).toContain(`- ${origin}/dynamic/server-pick.json?token=abc&limit=999 (ui) — Picked by the server.`);
    expect(requests).toEqual(['/dynamic/registry.json?token=abc&limit=1&q=zzzz&offset=10']);
  });

  test('searches a URL alongside @sveltery', async () => {
    expect(await print(['@sveltery', `${origin}/public/registry.json`], { query: 'hello' })).toBe(`Found 1 item matching "hello" in @sveltery, ${origin}/public/registry.json
Showing 1-1 of 1

- ${origin}/public/hello.json (ui) · ${origin}/public/registry.json — Says hello.`);
  });

  test('rejects a catalog that uses include', async () => {
    await expect(search([`${origin}/source/registry.json`], { cwd, json: false })).rejects.toThrow(`Registry catalog "${origin}/source/registry.json" uses "include"`);
  });
});

describe('search <owner/repo>', () => {
  const realFetch = globalThis.fetch;
  let fetched: string[];
  // A GitHub repository whose root registry.json is the source registry, so its files have paths, not content.
  const repository: Record<string, unknown> = {
    'https://raw.githubusercontent.com/acme/ui/HEAD/registry.json': acmeCatalog,
    'https://raw.githubusercontent.com/acme/ui/v1.0/registry.json': { ...acmeCatalog, items: acmeCatalog.items.slice(0, 1) },
    'https://raw.githubusercontent.com/acme/ui/feature/next/registry.json': acmeCatalog,
    'https://raw.githubusercontent.com/acme/split/HEAD/registry.json': { ...acmeCatalog, include: ['ui/registry.json'] },
    'https://raw.githubusercontent.com/acme/ui/HEAD/src/lib/components/ui/hello/Hello.svelte': '<p>Hello</p>\n',
    'https://raw.githubusercontent.com/acme/ui/v1.0/src/lib/components/ui/hello/Hello.svelte': '<p>Hello v1</p>\n',
  };
  beforeEach(() => {
    fetched = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input);
      if (!url.startsWith('https://raw.githubusercontent.com/')) return realFetch(input, init);
      fetched.push(url);
      const body = repository[url];
      if (body === undefined) return new Response('404: Not Found', { status: 404, statusText: 'Not Found' });
      return typeof body === 'string' ? new Response(body) : Response.json(body);
    });
  });
  afterEach(() => vi.restoreAllMocks());

  test('reads the root registry.json of the default branch, filters it here, and gives add owner/repo/name', async () => {
    expect(await print(['acme/ui'], { query: 'dialog' })).toBe(`Found 1 item matching "dialog" in acme/ui
Showing 1-1 of 1

- acme/ui/greet-dialog (block)`);
    expect(fetched).toEqual(['https://raw.githubusercontent.com/acme/ui/HEAD/registry.json']);
  });

  test('reads the registry.json at the ref after #, and keeps the ref in the add argument', async () => {
    expect(JSON.parse(await print(['acme/ui#v1.0'], { json: true })).items).toEqual([
      { name: 'hello', title: 'Hello', type: 'registry:ui', description: 'Says hello.', registry: 'acme/ui#v1.0', addCommandArgument: 'acme/ui/hello#v1.0' },
    ]);
    expect(await print(['acme/ui#feature/next'], { limit: '1' })).toContain('- acme/ui/hello#feature/next (ui)');
    expect(fetched).toEqual(['https://raw.githubusercontent.com/acme/ui/v1.0/registry.json', 'https://raw.githubusercontent.com/acme/ui/feature/next/registry.json']);
  });

  test('rejects a ref that cannot name a branch, tag or commit before it fetches anything', async () => {
    await expect(search(['acme/ui#-x'], { cwd, json: false })).rejects.toThrow('Invalid GitHub ref in registry source "acme/ui#-x".');
    await expect(search(['acme/ui#'], { cwd, json: false })).rejects.toThrow('Invalid GitHub ref in registry source "acme/ui#".');
    await expect(search(['alice/safe#../../mallory/evil/main'], { cwd, json: false })).rejects.toThrow('Invalid GitHub ref in registry source "alice/safe#../../mallory/evil/main".');
    await expect(search(['alice/safe#main/./x'], { cwd, json: false })).rejects.toThrow('Invalid GitHub ref in registry source "alice/safe#main/./x".');
    expect(fetched).toEqual([]);
  });

  test('add installs the owner/repo/name address that a result gives, at its ref', async () => {
    writeFileSync(join(cwd, 'package.json'), '{}');
    writeFileSync(
      join(cwd, 'components.json'),
      JSON.stringify({
        style: 'nova',
        iconLibrary: 'lucide',
        menuColor: 'default',
        tailwind: { css: 'src/app.css', baseColor: 'neutral' },
        aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
        typescript: true,
      }),
    );
    const addresses = [...JSON.parse(await print(['acme/ui'], { json: true, query: 'hello' })).items, ...JSON.parse(await print(['acme/ui#v1.0'], { json: true })).items].map(
      (item: { addCommandArgument: string }) => item.addCommandArgument,
    );
    expect(addresses).toEqual(['acme/ui/hello', 'acme/ui/hello#v1.0']);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const plans = [];
    for (const address of addresses) plans.push(await add([address], { cwd, yes: true, overwrite: false, all: false, dryRun: true, install: false }));
    expect(plans.map((plan) => plan.files.map(({ path, content }) => [path, content]))).toEqual([
      [['src/lib/components/ui/hello/Hello.svelte', '<p>Hello</p>\n']],
      [['src/lib/components/ui/hello/Hello.svelte', '<p>Hello v1</p>\n']],
    ]);
  });

  test('names a repository without a registry.json, and one whose registry.json uses include', async () => {
    await expect(search(['acme/none'], { cwd, json: false })).rejects.toThrow('GET https://raw.githubusercontent.com/acme/none/HEAD/registry.json failed with 404 Not Found');
    await expect(search(['acme/split'], { cwd, json: false })).rejects.toThrow('Registry acme/split uses "include", which search does not resolve in a GitHub registry yet.');
  });
});
