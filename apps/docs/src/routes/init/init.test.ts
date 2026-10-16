// @vitest-environment node
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import cli from '../../../../../packages/cli/package.json';
import { fetchItem, openRegistry, type Registry } from '../../../../../packages/cli/src/registry.js';
import { buildRegistry } from '../../../registry/build';
import { readRegistryInput } from '../../../registry/read';
import { GET } from './+server';

const repoRoot = fileURLToPath(new URL('../../../../../', import.meta.url));
let server: Server;
let origin: string;
let registry: Registry;

// Serves the built registry under /r and the real handler under /init, as the docs site does.
beforeAll(async () => {
  server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const output = buildRegistry(readRegistryInput(repoRoot, origin));
  const serveRegistry = (path: string) => {
    const value = output.get(path.replace(/^\/r\//, ''));
    return new Response(JSON.stringify(value ?? {}), { status: value ? 200 : 404 });
  };
  server.on('request', async (request, response) => {
    const url = new URL(request.url!, origin);
    const result = url.pathname === '/init' ? await GET({ url, fetch: serveRegistry, platform: undefined } as never) : serveRegistry(url.pathname);
    response.writeHead(result.status, Object.fromEntries(result.headers)).end(await result.text());
  });
  registry = await openRegistry(`${origin}/r`);
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

const init = (query: string) => fetchItem(registry, 'nova', { kind: 'url', url: `${origin}/init?${query}` });
const initError = async (query: string) => {
  const response = await fetch(`${origin}/init?${query}`);
  return { status: response.status, body: (await response.json()) as { error: string } };
};

describe('/init', () => {
  it('expands the default preset code into a full registry:base item', async () => {
    const item = await init('preset=b0');
    expect(item.type === 'registry:base' && item.config).toEqual({ style: 'nova', iconLibrary: 'lucide', menuColor: 'default', menuAccent: 'subtle', tailwind: { baseColor: 'neutral' } });
    expect(item.dependencies).toEqual([`${cli.name}@latest`, 'cn@^0.2.2', 'class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0', '@lucide/svelte@^1.48.0']);
    expect(item.registryDependencies).toEqual(['font-inter']);
    expect(item.cssVars?.theme?.['font-heading']).toBe('var(--font-sans)');
    expect(item.cssVars?.light?.['primary']).toBe('oklch(0.205 0 0)');
    expect(item.cssVars?.dark?.['chart-1']).toBe('oklch(0.87 0 0)');
    expect(Object.keys(item.css ?? {})).toEqual(['@import "tw-animate-css"', `@import "${cli.name}/tailwind.css"`, '@layer base']);
  });

  it('builds the same item from one param per field', async () => {
    const fields = 'style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&radius=default&menuAccent=subtle&menuColor=default';
    expect(await init(fields)).toEqual(await init('preset=b0'));
  });

  it('applies the theme, chart color, heading font, radius and menu accent', async () => {
    const item = await init('style=sera&baseColor=taupe&theme=amber&chartColor=blue&iconLibrary=tabler&font=noto-sans&fontHeading=playfair-display&radius=large&menuAccent=bold&menuColor=inverted');
    expect(item.name).toBe('sera');
    expect(item.registryDependencies).toEqual(['font-noto-sans', 'font-heading-playfair-display']);
    expect(item.cssVars?.theme).not.toHaveProperty('font-heading');
    expect(item.cssVars?.light?.['primary']).toBe('oklch(0.555 0.163 48.998)');
    expect(item.cssVars?.light?.['accent']).toBe(item.cssVars?.light?.['primary']);
    expect(item.cssVars?.light?.['chart-1']).toBe((await fetchItem(registry, 'nova', { kind: 'url', url: `${registry.url}/themes/blue.json` })).cssVars?.light?.['chart-1']);
    expect(item.cssVars?.light?.['radius']).toBe('0.875rem');
    expect(item.dependencies).toContain('@tabler/icons-svelte@^3.48.0');
  });

  it('lets fontHeading and chartColor override a preset code', async () => {
    const item = await init('preset=b0&fontHeading=lora&chartColor=violet');
    expect(item.registryDependencies).toEqual(['font-inter', 'font-heading-lora']);
    expect(item.cssVars?.light?.['chart-1']).not.toBe('oklch(0.87 0 0)');
  });

  it('returns only the theme and font parts for only=theme,font', async () => {
    const item = await init('preset=b0&only=theme,font');
    expect(item).toMatchObject({ type: 'registry:base', name: 'nova-theme-font', registryDependencies: ['font-inter'], config: { menuColor: 'default', menuAccent: 'subtle', tailwind: { baseColor: 'neutral' } } });
    expect(item).not.toHaveProperty('dependencies');
    expect(item).not.toHaveProperty('css');
    expect(item.cssVars?.theme?.['font-heading']).toBe('var(--font-sans)');
    expect(item.cssVars?.light?.['primary']).toBe('oklch(0.205 0 0)');
  });

  it('leaves the font out of only=theme', async () => {
    const item = await init('preset=b0&only=theme');
    expect(item).not.toHaveProperty('registryDependencies');
    expect(item.cssVars?.theme ?? {}).not.toHaveProperty('font-heading');
  });

  it('sets a cache lifetime', async () => {
    expect((await fetch(`${origin}/init?preset=b0`)).headers.get('cache-control')).toBe('public, max-age=3600');
  });

  it.each([
    ['preset=zz', 'Invalid preset code "zz"'],
    ['style=nova', 'Missing baseColor. Use one of: neutral, stone, zinc, mauve, olive, mist, taupe'],
    ['preset=b0&only=icons', 'Invalid only "icons". Use one or more of: theme, font'],
    ['preset=b0&fontHeading=comic-sans', 'Invalid fontHeading "comic-sans"'],
    ['preset=b0&base=radix', 'Invalid base "radix"'],
  ])('rejects %s with a 400', async (query, message) => {
    const { status, body } = await initError(query);
    expect(status).toBe(400);
    expect(body.error).toContain(message);
  });

  it('rejects a theme that belongs to another base color', async () => {
    const { status, body } = await initError('style=nova&baseColor=neutral&theme=stone&iconLibrary=lucide&font=inter&radius=default&menuAccent=subtle&menuColor=default');
    expect(status).toBe(400);
    expect(body.error).toContain('Invalid theme "stone"');
  });
});
