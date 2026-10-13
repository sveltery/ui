import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushSync, hydrate, unmount } from 'svelte';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import CommandFixture from './CommandFixture.svelte';

const FIXTURE = resolve(import.meta.dirname, 'CommandFixture.svelte');
const props = { search: 'c', value: 'Carrot' };

// The test environment compiles components for the client only, so a separate Vite server renders the server side.
let serverHtml: string;
beforeAll(async () => {
  const server = await createServer({
    configFile: false,
    root: resolve(import.meta.dirname, '../..'),
    logLevel: 'silent',
    appType: 'custom',
    // Without a watcher, which would crawl the whole repository.
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    plugins: [svelte()],
    resolve: { alias: { '@sveltery/command': resolve(import.meta.dirname, '../../packages/command/src/lib/index.ts') } }
  });
  try {
    // Resolved as the fixture's own imports are, so the renderer and the components share one Svelte.
    const renderer = await server.environments.ssr.pluginContainer.resolveId('svelte/server', FIXTURE);
    const { render } = (await server.ssrLoadModule(renderer!.id)) as typeof import('svelte/server');
    const { default: Fixture } = (await server.ssrLoadModule(FIXTURE)) as { default: typeof CommandFixture };
    serverHtml = render(Fixture, { props }).body;
  } finally {
    await server.close();
  }
}, 60_000);

let instance: ReturnType<typeof hydrate> | undefined;
afterEach(async () => {
  if (instance) await unmount(instance);
  instance = undefined;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const el = (testId: string) => document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)!;
function active() {
  const id = el('input').getAttribute('aria-activedescendant');
  return id ? document.getElementById(id)?.dataset.testid : undefined;
}
const shown = () => [...document.querySelectorAll<HTMLElement>('[cmdk-item]')].filter((item) => !item.hidden).map((item) => item.dataset.testid);

describe('Command hydration', () => {
  it('adopts the server markup without warnings, then filters and keeps the bound selection', () => {
    document.body.innerHTML = serverHtml;
    const serverElements = [...document.body.querySelectorAll('*')];
    const serverApple = el('apple');
    expect(serverApple.hidden).toBe(false);
    expect(document.querySelector('[cmdk-empty]')).toBe(null);
    const warn = vi.spyOn(console, 'warn');
    const error = vi.spyOn(console, 'error');

    instance = hydrate(CommandFixture, { target: document.body, props });
    flushSync();

    expect([...warn.mock.calls, ...error.mock.calls]).toEqual([]);
    expect(serverElements.filter((element) => !element.isConnected)).toEqual([]);
    expect(document.querySelector('[cmdk-empty]')).toBe(null);
    expect(serverApple.hidden).toBe(true);
    expect(shown()).toEqual(['pineapple', 'carrot', 'cabbage', 'settings']);
    expect(el('settings').style.order).toBe('1');
    expect(active()).toBe('carrot');
    expect(el('state').textContent).toBe(`c|Carrot|4|${el('carrot').id}`);
  });
});
