// @vitest-environment node
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fetchItem, fetchTheme, openRegistry, type Registry } from '../../../packages/cli/src/registry.js';
import { buildRegistry } from './build';
import { readRegistryInput } from './read';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
let server: Server;
let registry: Registry;

beforeAll(async () => {
  server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const output = buildRegistry(readRegistryInput(repoRoot, origin));
  server.on('request', (request, response) => {
    const value = output.get(request.url!.replace(/^\/r\//, ''));
    response.writeHead(value ? 200 : 404, { 'content-type': 'application/json' }).end(JSON.stringify(value ?? {}));
  });
  registry = await openRegistry(`${origin}/r`);
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

describe('the CLI reading the served registry', () => {
  it('parses an accent theme', async () => {
    const amber = await fetchItem(registry, 'nova', { kind: 'url', url: `${registry.url}/themes/amber.json` });
    expect(amber.type).toBe('registry:theme');
    expect(amber.cssVars?.light?.['primary']).toBe('oklch(0.555 0.163 48.998)');
    expect(amber.cssVars).not.toHaveProperty('theme');
  });

  it('parses a font item with its font field', async () => {
    const font = await fetchItem(registry, 'lyra', { kind: 'url', url: `${registry.url}/styles/lyra/font-heading-jetbrains-mono.json` });
    expect(font.type === 'registry:font' && font.font).toEqual({
      family: "'JetBrains Mono Variable', monospace",
      provider: 'google',
      import: 'JetBrains_Mono',
      variable: '--font-heading',
      subsets: ['latin'],
      dependency: '@fontsource-variable/jetbrains-mono',
    });
  });

  it('still parses a base color theme', async () => {
    expect((await fetchTheme(registry, 'mauve')).cssVars?.theme?.['color-background']).toBe('var(--background)');
  });
});
