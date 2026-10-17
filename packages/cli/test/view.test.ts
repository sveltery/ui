// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { view } from '../src/commands/view.js';

const item = (name: string, rest: object = {}) => ({
  $schema: 'https://example.test/schema/registry-item.json',
  name,
  type: 'registry:ui',
  files: [{ type: 'registry:ui', target: `${name}/${name}.svelte`, content: `<${name}></${name}>\n` }],
  ...rest,
});
const registryFiles: Record<string, unknown> = {
  'index.json': {
    $schema: 'https://example.test/schema/registry.json',
    name: 'sveltery',
    registryVersion: 1,
    styles: ['nova', 'vega'],
    baseColors: ['neutral'],
    iconLibraries: ['lucide'],
    items: [{ name: 'button', type: 'registry:ui' }, { name: 'dialog', type: 'registry:ui' }],
    blocks: [{ name: 'login-01', type: 'registry:block' }],
  },
  'styles/nova/button.json': item('button', { dependencies: ['cn@^0.2.2'], docs: 'Use it for actions.', meta: { since: '1.2' } }),
  'styles/nova/dialog.json': item('dialog', { registryDependencies: ['button'] }),
  'styles/nova/login-01.json': item('login-01', { type: 'registry:block' }),
  'styles/vega/button.json': item('button', { description: 'The vega button.' }),
  'extra/hello-card.json': item('hello-card', { title: 'Hello card' }),
};

let server: Server;
let origin: string;
let cwd: string;

beforeAll(async () => {
  server = createServer((request, response) => {
    const body = registryFiles[(request.url ?? '').replace(/^\//, '').replace(/^r\//, '')];
    response.writeHead(body ? 200 : 404, { 'content-type': 'application/json' }).end(body ? JSON.stringify(body) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  origin = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
});
afterAll(() => void server.close());

beforeEach(() => {
  process.env.SVELTERY_REGISTRY_URL = `${origin}/r`;
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-view-'));
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

async function print(inputs: string[]) {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  try {
    await view(inputs, { cwd });
    return log.mock.calls.map(([line]) => line).join('\n');
  } finally {
    log.mockRestore();
  }
}

describe('view', () => {
  test('prints the named items as one JSON array, in argument order, without their dependencies', async () => {
    expect(JSON.parse(await print(['dialog', 'button']))).toEqual([registryFiles['styles/nova/dialog.json'], registryFiles['styles/nova/button.json']]);
  });

  test('prints fields the CLI does not read, as the registry serves them', async () => {
    expect(JSON.parse(await print(['button']))[0]).toMatchObject({ docs: 'Use it for actions.', meta: { since: '1.2' } });
  });

  test('prints the JSON with two-space indentation', async () => {
    expect((await print(['login-01'])).split('\n').slice(0, 3)).toEqual(['[', '  {', '    "$schema": "https://example.test/schema/registry-item.json",']);
  });

  test('fetches an item URL as is', async () => {
    expect(JSON.parse(await print([`${origin}/extra/hello-card.json`]))).toEqual([registryFiles['extra/hello-card.json']]);
  });

  test('takes the style from components.json', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'vega' }));
    expect(JSON.parse(await print(['button']))).toEqual([registryFiles['styles/vega/button.json']]);
  });

  test('takes the registry from components.json when the environment does not set one', async () => {
    delete process.env.SVELTERY_REGISTRY_URL;
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ registry: `${origin}/r/` }));
    expect(JSON.parse(await print(['button']))).toEqual([registryFiles['styles/nova/button.json']]);
  });

  test('names the items the registry does not have', async () => {
    await expect(view(['button', 'nope', 'nada'], { cwd })).rejects.toThrow('Not in the registry: nope, nada. Available items: button, dialog, login-01.');
  });

  test('rejects an argument that is neither a name nor a URL', async () => {
    await expect(view(['./local.json'], { cwd })).rejects.toThrow('"./local.json" is neither an item name nor an http(s) URL.');
  });

  test('rejects a components.json with an unknown style', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ style: 'bogus' }));
    await expect(view(['button'], { cwd })).rejects.toThrow(
      'components.json is invalid. style: expected "vega" or "nova" or "maia" or "lyra" or "mira" or "luma" or "sera" or "rhea", got "bogus".',
    );
  });
});
