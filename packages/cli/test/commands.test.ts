// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { confirm } from '@clack/prompts';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { add } from '../src/commands/add.js';
import { diff } from '../src/commands/diff.js';
import { baseDependencies, init } from '../src/commands/init.js';
import { list } from '../src/commands/list.js';
import { update } from '../src/commands/update.js';

vi.mock('@clack/prompts', async (importOriginal) => ({ ...(await importOriginal<typeof import('@clack/prompts')>()), confirm: vi.fn() }));

const button = `<script lang="ts">
  import { IconPlaceholder } from '../icons/index.js';
  let { children } = $props();
</script>
<button class="cn-rtl-flip px-2.5">{@render children?.()}<IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" /></button>
`;
const dialogTitle = `<script lang="ts">
  import { render } from '../shared/render.js';
</script>
<h2 class="cn-font-heading text-base">{@render render()}</h2>
`;

const item = (name: string, rest: object) => ({ $schema: 'https://example.test/schema/registry-item.json', name, type: 'registry:ui', ...rest });
const registryFiles: Record<string, unknown> = {
  'index.json': {
    $schema: 'https://example.test/schema/registry.json',
    name: 'sveltery',
    registryVersion: 1,
    styles: ['nova', 'vega'],
    baseColors: ['neutral'],
    iconLibraries: ['lucide', 'tabler'],
    items: [
      { name: 'button', type: 'registry:ui' },
      { name: 'dialog', type: 'registry:ui' },
    ],
  },
  'styles/nova/button.json': item('button', { dependencies: ['cn@^0.2.2'], files: [{ type: 'registry:ui', target: 'button/Button.svelte', content: button }] }),
  'styles/nova/dialog.json': item('dialog', {
    dependencies: ['@sveltery/base'],
    registryDependencies: ['button', 'shared'],
    files: [{ type: 'registry:ui', target: 'dialog/DialogTitle.svelte', content: dialogTitle }],
  }),
  'styles/nova/shared.json': item('shared', { type: 'registry:lib', files: [{ type: 'registry:ui', target: 'shared/render.ts', content: 'export const render = () => {};\n' }] }),
  'themes/neutral.json': item('neutral', {
    type: 'registry:theme',
    files: [],
    cssVars: { theme: { 'color-background': 'var(--background)' }, light: { background: 'oklch(1 0 0)' }, dark: { background: 'oklch(0.145 0 0)' } },
  }),
};

let server: Server;
let registryUrl: string;
let cwd: string;

beforeAll(async () => {
  server = createServer((request, response) => {
    const body = registryFiles[(request.url ?? '').replace(/^\/r\//, '')];
    response.writeHead(body ? 200 : 404, { 'content-type': 'application/json' }).end(body ? JSON.stringify(body) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  registryUrl = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/r`;
});
afterAll(() => void server.close());

beforeEach(() => {
  process.env.SVELTERY_REGISTRY_URL = registryUrl;
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-cli-'));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.0.0', svelte: '^5.0.0', tailwindcss: '^4.0.0', cn: '^0.2.2' } }));
  mkdirSync(join(cwd, 'src'));
  writeFileSync(join(cwd, 'src/app.css'), "@import 'tailwindcss';\n");
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

const read = (path: string) => readFileSync(join(cwd, path), 'utf8');
const defaults = { yes: true, install: false };

describe('init', () => {
  test('writes components.json and the theme, and a second run changes nothing', async () => {
    const first = await init({ cwd, ...defaults, icons: 'tabler' });
    expect(JSON.parse(read('components.json'))).toEqual({
      $schema: new URL('/schema.json', registryUrl).href,
      style: 'nova',
      iconLibrary: 'tabler',
      menuColor: 'default',
      tailwind: { css: 'src/app.css', baseColor: 'neutral' },
      aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
      registry: registryUrl,
      typescript: true,
    });
    expect(read('src/app.css')).toBe(`@import 'tailwindcss';
@import 'tw-animate-css';
@import '@sveltery/ui/tailwind.css';
@custom-variant dark (&:is(.dark *));
:root {
  --background: oklch(1 0 0);
}
.dark {
  --background: oklch(0.145 0 0);
}
@theme inline {
  --color-background: var(--background);
}
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`);
    expect(first.files.map((file) => file.status)).toEqual(['new', 'changed']);
    expect(first.dependencies).toEqual(['class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0', '@tabler/icons-svelte@^3.48.0']);
    expect(first.devDependencies).toEqual(['@sveltery/ui@^0.1.0']);

    const config = read('components.json');
    const css = read('src/app.css');
    const second = await init({ cwd, ...defaults });
    expect(second.files.map((file) => file.status)).toEqual(['identical', 'identical']);
    expect(read('components.json')).toBe(config);
    expect(read('src/app.css')).toBe(css);
  });

  test('keeps unknown keys and custom aliases in an existing components.json', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ custom: 1, style: 'vega', aliases: { ui: '$lib/ui' } }));
    await init({ cwd, ...defaults });
    const config = JSON.parse(read('components.json'));
    expect([config.custom, config.style, config.iconLibrary, config.aliases.ui]).toEqual([1, 'vega', 'lucide', '$lib/ui']);
  });

  test('uses #lib aliases in a SvelteKit 3 app, and add places files under src/lib', async () => {
    const manifest = JSON.parse(read('package.json'));
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ ...manifest, imports: { '#lib': './src/lib/index.js', '#lib/*': './src/lib/*' } }));
    await init({ cwd, ...defaults });
    expect(JSON.parse(read('components.json')).aliases).toEqual({ components: '#lib/components', ui: '#lib/components/ui', utils: '#lib/utils', lib: '#lib', hooks: '#lib/hooks' });
    const plan = await add(['button'], { cwd, ...defaults, overwrite: false, all: false, dryRun: true });
    expect(plan.files.map((file) => file.path)).toEqual(['src/lib/components/ui/button/Button.svelte']);
  });

  test('stops before changing anything when Tailwind is missing', async () => {
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.0.0', svelte: '^5.0.0' } }));
    await expect(init({ cwd, ...defaults })).rejects.toThrow('Sveltery needs tailwindcss 4, and package.json does not list it. Run `npx sv add tailwindcss`, then run init again.');
    expect([existsSync(join(cwd, 'components.json')), read('src/app.css')]).toEqual([false, "@import 'tailwindcss';\n"]);
  });

  test('rejects an unknown style flag', async () => {
    await expect(init({ cwd, ...defaults, style: 'nebula' })).rejects.toThrow('Unknown style "nebula". Choose one of: vega, nova, maia, lyra, mira, luma, sera, rhea.');
  });

  test('installs the base packages at the ranges packages/ui uses', () => {
    const ui = JSON.parse(readFileSync(new URL('../../ui/package.json', import.meta.url), 'utf8'));
    const declared = { ...ui.dependencies, ...ui.peerDependencies };
    for (const spec of baseDependencies) {
      const [name, range] = spec.split('@^');
      expect(declared[name!].replace(/^\^/, ''), name).toBe(range);
    }
  });
});

describe('add', () => {
  beforeEach(() => init({ cwd, ...defaults }));
  const options = (extra: { overwrite?: boolean; all?: boolean; dryRun?: boolean } = {}) => ({ ...defaults, overwrite: false, all: false, dryRun: false, cwd, ...extra });

  test('writes items and their registry dependencies with transforms applied', async () => {
    const plan = await add(['dialog'], options());
    expect(plan.files.map((file) => [file.path, file.status])).toEqual([
      ['src/lib/components/ui/button/Button.svelte', 'new'],
      ['src/lib/components/ui/shared/render.ts', 'new'],
      ['src/lib/components/ui/dialog/DialogTitle.svelte', 'new'],
    ]);
    expect(plan.dependencies).toEqual(['@lucide/svelte@^1.48.0', '@sveltery/base']);
    expect(read('src/lib/components/ui/button/Button.svelte')).toBe(`<script lang="ts">
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  let { children } = $props();
</script>
<button class="px-2.5">{@render children?.()}<ChevronRightIcon /></button>
`);
    expect(read('src/lib/components/ui/dialog/DialogTitle.svelte')).toContain('<h2 class="text-base">');
  });

  test('keeps a changed file with -y, replaces it with -o, and skips identical files', async () => {
    await add(['button'], options());
    const path = 'src/lib/components/ui/button/Button.svelte';
    writeFileSync(join(cwd, path), 'mine\n');
    const kept = await add(['button'], options());
    expect([kept.files, read(path)]).toEqual([[], 'mine\n']);
    const replaced = await add(['button'], options({ overwrite: true }));
    expect(replaced.files.map((file) => file.status)).toEqual(['changed']);
    expect(read(path)).toContain('<ChevronRightIcon />');
    expect((await add(['button'], options())).files.map((file) => file.status)).toEqual(['identical']);
  });

  test('--dry-run writes nothing, and --all adds every manifest item', async () => {
    const plan = await add([], options({ all: true, dryRun: true }));
    expect(plan.files.map((file) => file.path)).toEqual([
      'src/lib/components/ui/button/Button.svelte',
      'src/lib/components/ui/shared/render.ts',
      'src/lib/components/ui/dialog/DialogTitle.svelte',
    ]);
    expect(existsSync(join(cwd, 'src/lib'))).toBe(false);
  });

  test('adds an item by URL', async () => {
    const plan = await add([`${registryUrl}/styles/nova/button.json`], options());
    expect(plan.files.map((file) => file.path)).toEqual(['src/lib/components/ui/button/Button.svelte']);
  });

  test('names unknown items, failed requests and newer registries', async () => {
    await expect(add(['buton'], options())).rejects.toThrow('Not in the registry: buton. Available items: button, dialog.');
    await expect(add([`${registryUrl}/styles/nova/missing.json`], options())).rejects.toThrow(`GET ${registryUrl}/styles/nova/missing.json failed with 404 Not Found`);
    registryFiles['index.json'] = { ...(registryFiles['index.json'] as object), registryVersion: 2 };
    try {
      await expect(add(['button'], options())).rejects.toThrow(`The registry at ${registryUrl} uses format version 2, and this CLI reads version 1. Update it with \`npx @sveltery/ui@latest\`.`);
    } finally {
      registryFiles['index.json'] = { ...(registryFiles['index.json'] as object), registryVersion: 1 };
    }
  });

  test('rejects a registry file that would write outside the ui directory', async () => {
    registryFiles['styles/nova/evil.json'] = item('evil', { files: [{ type: 'registry:ui', target: '../../../../escape.js', content: '' }] });
    await expect(add([`${registryUrl}/styles/nova/evil.json`], options())).rejects.toThrow(
      `${registryUrl}/styles/nova/evil.json is not a valid registry response. files[0].target: expected a relative path without ".." segments, got "../../../../escape.js"`,
    );
  });
});

describe('diff', () => {
  const addOptions = { ...defaults, overwrite: false, all: false, dryRun: false };
  const buttonPath = 'src/lib/components/ui/button/Button.svelte';
  const titlePath = 'src/lib/components/ui/dialog/DialogTitle.svelte';
  beforeEach(async () => {
    await init({ cwd, ...defaults });
    await add(['button', 'dialog'], { cwd, ...addOptions });
  });
  const editButton = () => writeFileSync(join(cwd, buttonPath), read(buttonPath).replace('px-2.5', 'px-4'));

  test('prints a unified diff from your file to the registry version, and writes nothing', async () => {
    editButton();
    const edited = read(buttonPath);
    expect(await diff([], { cwd })).toBe(`--- a/src/lib/components/ui/button/Button.svelte
+++ b/src/lib/components/ui/button/Button.svelte
@@ -2,4 +2,4 @@
   import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
   let { children } = $props();
 </script>
-<button class="px-4">{@render children?.()}<ChevronRightIcon /></button>
+<button class="px-2.5">{@render children?.()}<ChevronRightIcon /></button>

1 file differs in 1 item`);
    expect(read(buttonPath)).toBe(edited);
  });

  test('counts the files and items that differ, and a named item limits the diff to itself and its dependencies', async () => {
    editButton();
    writeFileSync(join(cwd, titlePath), 'mine\n');
    expect((await diff([], { cwd })).split('\n').at(-1)).toBe('2 files differ in 2 items');
    const output = await diff(['button'], { cwd });
    expect([output.includes(titlePath), output.split('\n').at(-1)]).toEqual([false, '1 file differs in 1 item']);
  });

  test('says when nothing differs', async () => {
    expect(await diff([], { cwd })).toBe('Everything is up to date.');
  });

  test('mentions registry files that are missing from the project', async () => {
    rmSync(join(cwd, 'src/lib/components/ui/shared/render.ts'));
    expect(await diff([], { cwd })).toBe('1 file in the registry is not in your project yet. `npx @sveltery/ui@latest update` adds it.');
  });

  test('skips shared unless an installed item needs it', async () => {
    rmSync(join(cwd, 'src/lib/components/ui/dialog'), { recursive: true });
    writeFileSync(join(cwd, 'src/lib/components/ui/shared/render.ts'), 'mine\n');
    expect(await diff([], { cwd })).toBe('Everything is up to date.');
  });

  test('errors on an item that is not installed, not in the registry, or a URL', async () => {
    rmSync(join(cwd, 'src/lib/components/ui/dialog'), { recursive: true });
    await expect(diff(['dialog'], { cwd })).rejects.toThrow('dialog is not installed. Run `npx @sveltery/ui@latest add dialog` first.');
    await expect(diff(['buton'], { cwd })).rejects.toThrow('Not in the registry: buton.');
    await expect(diff([`${registryUrl}/styles/nova/button.json`], { cwd })).rejects.toThrow('URLs only work with `add`.');
  });

  test('says so when no item is installed', async () => {
    rmSync(join(cwd, 'src/lib'), { recursive: true });
    expect(await diff([], { cwd })).toBe('No items are installed. Add one with `npx @sveltery/ui@latest add button`.');
  });
});

describe('update', () => {
  const addOptions = { ...defaults, overwrite: false, all: false, dryRun: false };
  const buttonPath = 'src/lib/components/ui/button/Button.svelte';
  const titlePath = 'src/lib/components/ui/dialog/DialogTitle.svelte';
  const renderPath = 'src/lib/components/ui/shared/render.ts';
  beforeEach(async () => {
    vi.mocked(confirm).mockReset();
    await init({ cwd, ...defaults });
    await add(['button', 'dialog'], { cwd, ...addOptions });
  });

  test('-y overwrites changed files and adds missing ones, and a second diff finds nothing', async () => {
    writeFileSync(join(cwd, buttonPath), 'mine\n');
    rmSync(join(cwd, renderPath));
    const plan = await update([], { cwd, ...defaults });
    expect(plan.files.map((file) => [file.path, file.status])).toEqual([
      [buttonPath, 'changed'],
      [renderPath, 'new'],
    ]);
    expect(read(buttonPath)).toContain('<ChevronRightIcon />');
    expect(read(renderPath)).toBe('export const render = () => {};\n');
    expect(confirm).not.toHaveBeenCalled();
    expect(await diff([], { cwd })).toBe('Everything is up to date.');
  });

  test('asks per changed file, defaulting to no', async () => {
    writeFileSync(join(cwd, buttonPath), 'my button\n');
    writeFileSync(join(cwd, titlePath), 'my title\n');
    vi.mocked(confirm).mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const plan = await update([], { cwd, ...defaults, yes: false });
    expect(vi.mocked(confirm).mock.calls.map(([options]) => options)).toEqual([
      { message: `Overwrite ${buttonPath} with the registry version?`, initialValue: false },
      { message: `Overwrite ${titlePath} with the registry version?`, initialValue: false },
    ]);
    expect(plan.files.map((file) => file.path)).toEqual([titlePath]);
    expect(read(buttonPath)).toBe('my button\n');
    expect(read(titlePath)).toContain('<h2 class="text-base">');
  });

  test('a name limits the update to that item and its dependencies', async () => {
    writeFileSync(join(cwd, buttonPath), 'my button\n');
    writeFileSync(join(cwd, titlePath), 'my title\n');
    const plan = await update(['button'], { cwd, ...defaults });
    expect(plan.files.map((file) => file.path)).toEqual([buttonPath]);
    expect(read(titlePath)).toBe('my title\n');
    await expect(update(['nope'], { cwd, ...defaults })).rejects.toThrow('Not in the registry: nope.');
  });

  test('reports the packages an item now needs', async () => {
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.0.0', svelte: '^5.0.0', tailwindcss: '^4.0.0' } }));
    const plan = await update(['button'], { cwd, ...defaults });
    expect([plan.files, plan.dependencies]).toEqual([[], ['cn@^0.2.2', '@lucide/svelte@^1.48.0']]);
  });

  test('does nothing when no item is installed', async () => {
    rmSync(join(cwd, 'src/lib'), { recursive: true });
    expect((await update([], { cwd, ...defaults })).files).toEqual([]);
    expect(existsSync(join(cwd, 'src/lib'))).toBe(false);
  });
});

describe('list', () => {
  const print = async (json: boolean) => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      await list({ cwd, json });
      return log.mock.calls.map(([line]) => line).join('\n');
    } finally {
      log.mockRestore();
    }
  };
  beforeEach(() => init({ cwd, ...defaults }));

  test('prints every item with its type, and marks the installed ones', async () => {
    expect(await print(false)).toBe(`button  registry:ui
dialog  registry:ui`);
    await add(['button'], { cwd, ...defaults, overwrite: false, all: false, dryRun: false });
    expect(await print(false)).toBe(`button  registry:ui  installed
dialog  registry:ui`);
  });

  test('--json prints the entries', async () => {
    await add(['dialog'], { cwd, ...defaults, overwrite: false, all: false, dryRun: false });
    expect(JSON.parse(await print(true))).toEqual([
      { name: 'button', type: 'registry:ui', installed: true },
      { name: 'dialog', type: 'registry:ui', installed: true },
    ]);
  });

  test('asks for init when there is no components.json', async () => {
    rmSync(join(cwd, 'components.json'));
    await expect(list({ cwd, json: false })).rejects.toThrow('Run `npx @sveltery/ui@latest init` first.');
  });
});
