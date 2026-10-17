// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { docs } from '../src/commands/docs.js';

const site = 'https://ui.example.test';
const manifest = {
  $schema: `${site}/schema/registry.json`,
  name: 'sveltery',
  registryVersion: 1,
  styles: ['nova'],
  baseColors: ['neutral'],
  iconLibraries: ['lucide'],
  items: [
    { name: 'accordion', type: 'registry:ui', meta: { links: { docs: `${site}/docs/components/accordion`, examples: `${site}/docs/components/accordion.md`, api: 'https://base-ui.com/react/components/accordion.md' } } },
    { name: 'card', type: 'registry:ui', meta: { links: { docs: `${site}/docs/components/card`, examples: `${site}/docs/components/card.md` } } },
    { name: 'plain', type: 'registry:ui' },
  ],
  blocks: [{ name: 'login-01', type: 'registry:block' }],
};

let server: Server;
let cwd: string;

beforeAll(async () => {
  server = createServer((request, response) => {
    const found = request.url === '/r/index.json';
    response.writeHead(found ? 200 : 404, { 'content-type': 'application/json' }).end(found ? JSON.stringify(manifest) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  process.env.SVELTERY_REGISTRY_URL = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/r`;
});
afterAll(() => void server.close());
beforeEach(() => void (cwd = mkdtempSync(join(tmpdir(), 'sveltery-docs-'))));
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

async function run(components: string[], json = false) {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    await docs(components, { cwd, json });
    return { stdout: log.mock.calls.map(([line]) => line).join('\n'), stderr: warn.mock.calls.map(([line]) => line).join('\n') };
  } finally {
    log.mockRestore();
    warn.mockRestore();
  }
}

describe('docs', () => {
  test('prints each component with its links, the keys padded to the longest one', async () => {
    expect((await run(['accordion', 'card'])).stdout).toBe(`accordion
  - docs      ${site}/docs/components/accordion
  - examples  ${site}/docs/components/accordion.md
  - api       https://base-ui.com/react/components/accordion.md

card
  - docs      ${site}/docs/components/card
  - examples  ${site}/docs/components/card.md
`);
  });

  test('--json prints the base and each component with its links', async () => {
    expect(JSON.parse((await run(['card'], true)).stdout)).toEqual({
      base: 'base',
      results: [{ component: 'card', base: 'base', links: { docs: `${site}/docs/components/card`, examples: `${site}/docs/components/card.md` } }],
    });
  });

  test('works in a project whose components.json names another style set', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'new-york' }));
    expect((await run(['card'])).stdout).toBe(`card
  - docs      ${site}/docs/components/card
  - examples  ${site}/docs/components/card.md
`);
  });

  test('warns about an item without links on stderr and still prints the others', async () => {
    const text = await run(['plain', 'card']);
    expect(text.stderr).toBe('No documentation links available for plain.');
    expect(text.stdout).toContain('card\n  - docs');
    const json = await run(['plain', 'card'], true);
    expect(JSON.parse(json.stdout).results.map((result: { component: string }) => result.component)).toEqual(['card']);
    expect(json.stderr).toBe('No documentation links available for plain.');
  });

  test('treats a block as an item without links', async () => {
    expect((await run(['login-01'])).stderr).toBe('No documentation links available for login-01.');
  });

  test('names a component the registry does not have', async () => {
    await expect(docs(['card', 'nope'], { cwd, json: false })).rejects.toThrow('Component nope not found in the Sveltery registry.');
  });

  test('works without components.json and reads the registry from it when the environment sets none', async () => {
    const url = process.env.SVELTERY_REGISTRY_URL!;
    delete process.env.SVELTERY_REGISTRY_URL;
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ registry: url }));
    try {
      expect(JSON.parse((await run(['card'], true)).stdout).results[0].component).toBe('card');
    } finally {
      process.env.SVELTERY_REGISTRY_URL = url;
    }
  });
});
