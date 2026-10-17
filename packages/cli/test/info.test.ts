// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { info } from '../src/commands/info.js';

const manifest = {
  $schema: 'https://example.test/schema/registry.json',
  name: 'sveltery',
  registryVersion: 1,
  styles: ['nova'],
  baseColors: ['neutral'],
  iconLibraries: ['lucide'],
  items: ['button', 'dialog', 'tooltip'].map((name) => ({ name, type: 'registry:ui' })),
  blocks: [],
};
const css = `@import 'tailwindcss';
@import '@fontsource-variable/inter';
:root { --primary: oklch(0.205 0 0); --chart-1: oklch(0.87 0 0); --radius: 0.625rem; }
.dark { --primary: oklch(0.922 0 0); --chart-1: oklch(0.87 0 0); }
@theme inline { --font-sans: 'Inter Variable', sans-serif; --font-heading: var(--font-sans); }
`;
const components = {
  style: 'nova',
  iconLibrary: 'lucide',
  menuColor: 'default',
  menuAccent: 'subtle',
  tailwind: { css: 'src/app.css', baseColor: 'neutral' },
  aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
  typescript: true,
};

let server: Server;
let origin: string;
let cwd: string;

beforeAll(async () => {
  server = createServer((request, response) => {
    const found = request.url === '/r/index.json';
    response.writeHead(found ? 200 : 404, { 'content-type': 'application/json' }).end(found ? JSON.stringify(manifest) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  origin = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
});
afterAll(() => void server.close());

beforeEach(() => {
  process.env.SVELTERY_REGISTRY_URL = `${origin}/r`;
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-info-'));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.5.1', svelte: '^5.0.0', tailwindcss: '~4.1.2', vite: '^7.0.0' } }));
  mkdirSync(join(cwd, 'src'));
  writeFileSync(join(cwd, 'src/app.css'), css);
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

const write = (path: string, content: string) => {
  mkdirSync(join(cwd, path, '..'), { recursive: true });
  writeFileSync(join(cwd, path), content);
};
const initialized = () => write('components.json', JSON.stringify(components));

async function print(json: boolean) {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  try {
    await info({ cwd, json });
    return log.mock.calls.map(([line]) => line).join('\n');
  } finally {
    log.mockRestore();
  }
}

describe('info', () => {
  test('prints the project facts and says there is no components.json', async () => {
    expect(await print(false)).toBe(`Project
  framework         SvelteKit (sveltekit)
  frameworkVersion  2.5.1
  svelteVersion     5.0.0
  tailwindVersion   4.1.2
  srcDirectory      Yes
  tailwindCss       src/app.css
  importAlias       $lib

Configuration
  No components.json found.

Installed Components
  No components installed.

Links
  docs        ${origin}/docs
  components  ${origin}/docs/components/[component].md
  ui          ${origin}/r/styles/nova/[component].json
  schema      ${origin}/schema.json
`);
  });

  test('prints the configuration, the preset the CSS shows, the aliases, the resolved paths and the installed items', async () => {
    initialized();
    write('src/lib/components/ui/button/Button.svelte', '');
    write('src/lib/components/ui/tooltip/Tooltip.svelte', '');
    write('src/lib/components/ui/not-in-the-registry/Thing.svelte', '');
    write('src/lib/components/ui/dialog.svelte', '');
    expect(await print(false)).toBe(`Project
  framework         SvelteKit (sveltekit)
  frameworkVersion  2.5.1
  svelteVersion     5.0.0
  tailwindVersion   4.1.2
  srcDirectory      Yes
  tailwindCss       src/app.css
  importAlias       $lib

Configuration
  style        nova
  iconLibrary  lucide
  menuColor    default
  menuAccent   subtle
  registry     ${origin}/r

Preset
  code         b0
  version      b
  style        nova
  baseColor    neutral
  theme        neutral
  chartColor   neutral
  iconLibrary  lucide
  font         inter
  fontHeading  inherit
  radius       default
  menuAccent   subtle
  menuColor    default
  url          ${origin}/create?preset=b0

Aliases
  components  $lib/components
  ui          $lib/components/ui
  utils       $lib/utils
  lib         $lib
  hooks       $lib/hooks

Resolved Paths
  cwd          ${cwd}
  tailwindCss  ${cwd}/src/app.css
  utils        ${cwd}/src/lib/utils
  components   ${cwd}/src/lib/components
  lib          ${cwd}/src/lib
  hooks        ${cwd}/src/lib/hooks
  ui           ${cwd}/src/lib/components/ui

Installed Components
  button, tooltip

Links
  docs        ${origin}/docs
  components  ${origin}/docs/components/[component].md
  ui          ${origin}/r/styles/nova/[component].json
  schema      ${origin}/schema.json
`);
  });

  test('marks the preset values the CSS did not show with an asterisk', async () => {
    initialized();
    write('src/app.css', "@import 'tailwindcss';\n");
    const output = await print(false);
    expect(output).toContain('  theme        neutral*\n');
    expect(output).toContain('  font         geist*\n');
    expect(output).toContain('  * Uses preset defaults for values the project does not show.');
  });

  test('--json prints the same data', async () => {
    initialized();
    write('src/lib/components/ui/dialog/Dialog.svelte', '');
    const data = JSON.parse(await print(true));
    expect(data.project).toEqual({
      framework: 'SvelteKit',
      frameworkName: 'sveltekit',
      frameworkVersion: '2.5.1',
      svelteVersion: '5.0.0',
      tailwindVersion: '4.1.2',
      srcDirectory: true,
      tailwindCss: 'src/app.css',
      importAlias: '$lib',
    });
    expect(data.config).toMatchObject({ style: 'nova', menuAccent: 'subtle', aliases: components.aliases, registry: `${origin}/r`, resolvedPaths: { ui: `${cwd}/src/lib/components/ui` } });
    expect(data.preset).toEqual({
      code: 'b0',
      values: { style: 'nova', baseColor: 'neutral', theme: 'neutral', chartColor: 'neutral', iconLibrary: 'lucide', font: 'inter', fontHeading: 'inherit', radius: 'default', menuAccent: 'subtle', menuColor: 'default' },
      fallbacks: [],
    });
    expect(data.components).toEqual(['dialog']);
  });

  test('reports a Vite app, and the installed version over the declared range', async () => {
    write('package.json', JSON.stringify({ devDependencies: { svelte: '^5.0.0', tailwindcss: '^4.0.0', vite: 'latest' } }));
    write('node_modules/svelte/package.json', JSON.stringify({ version: '5.57.1' }));
    const { project } = JSON.parse(await print(true));
    expect(project).toMatchObject({ framework: 'Vite', frameworkName: 'vite', frameworkVersion: 'latest', svelteVersion: '5.57.1', importAlias: null });
  });

  test('reports no project when there is no package.json', async () => {
    rmSync(join(cwd, 'package.json'));
    expect(JSON.parse(await print(true)).project).toBeNull();
    expect(await print(false)).toContain('Project\n  No project info detected.\n');
  });

  test('reads the CSS file from components.json before it looks for one', async () => {
    write('components.json', JSON.stringify({ ...components, tailwind: { css: 'src/other.css', baseColor: 'neutral' } }));
    write('src/other.css', css);
    expect(JSON.parse(await print(true)).project.tailwindCss).toBe('src/other.css');
  });

  test('does not ask the registry when nothing is installed', async () => {
    initialized();
    process.env.SVELTERY_REGISTRY_URL = 'http://127.0.0.1:1/r';
    expect(JSON.parse(await print(true)).components).toEqual([]);
  });

  test('rejects an invalid components.json', async () => {
    write('components.json', JSON.stringify({ ...components, style: 'bogus' }));
    await expect(info({ cwd, json: false })).rejects.toThrow('components.json is invalid.');
  });
});
