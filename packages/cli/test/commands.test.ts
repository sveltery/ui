// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { confirm, log, select } from '@clack/prompts';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { add } from '../src/commands/add.js';
import { diff } from '../src/commands/diff.js';
import { baseDependencies, init } from '../src/commands/init.js';
import { list } from '../src/commands/list.js';
import { migrateRtl } from '../src/commands/migrate.js';
import { update } from '../src/commands/update.js';
import { cliPackage } from '../src/version.js';

vi.mock('@clack/prompts', async (importOriginal) => ({ ...(await importOriginal<typeof import('@clack/prompts')>()), confirm: vi.fn(), select: vi.fn() }));

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
    blocks: [{ name: 'login-01', type: 'registry:block', description: 'A simple login form.' }],
  },
  'styles/nova/button.json': item('button', { dependencies: ['cn@^0.2.2'], files: [{ type: 'registry:ui', target: 'button/Button.svelte', content: button }] }),
  'styles/nova/dialog.json': item('dialog', {
    dependencies: ['@sveltery/base'],
    registryDependencies: ['button', 'shared'],
    files: [{ type: 'registry:ui', target: 'dialog/DialogTitle.svelte', content: dialogTitle }],
  }),
  'styles/nova/login-01.json': item('login-01', {
    type: 'registry:block',
    devDependencies: ['@types/d3-scale@^4.0.9'],
    registryDependencies: ['button'],
    files: [
      { type: 'registry:page', target: 'src/routes/login/+page.svelte', content: "<script lang=\"ts\">\n  import LoginForm from '$registry/bases/base/components/login-form.svelte';\n</script>\n<LoginForm />\n" },
      { type: 'registry:component', target: 'login-form.svelte', content: "<script lang=\"ts\">\n  import { Button } from '$registry/bases/base/ui/button';\n</script>\n<form class=\"cn-font-heading\"><Button>Login</Button></form>\n" },
      { type: 'registry:file', target: 'src/routes/login/data.json', content: '[]\n' },
    ],
  }),
  'styles/nova/shared.json': item('shared', { type: 'registry:lib', files: [{ type: 'registry:ui', target: 'shared/render.ts', content: 'export const render = () => {};\n' }] }),
  'themes/neutral.json': item('neutral', {
    type: 'registry:theme',
    files: [],
    cssVars: { theme: { 'color-background': 'var(--background)' }, light: { background: 'oklch(1 0 0)' }, dark: { background: 'oklch(0.145 0 0)' } },
  }),
};

const font = (name: string, variable: string, family: string, dependency: string) =>
  item(name, { type: 'registry:font', files: [], font: { family, provider: 'google', import: name, variable, dependency } });
registryFiles['styles/vega/font-inter.json'] = font('font-inter', '--font-sans', "'Inter Variable', sans-serif", '@fontsource-variable/inter');
registryFiles['styles/vega/font-heading-playfair-display.json'] = font('font-heading-playfair-display', '--font-heading', "'Playfair Display Variable', serif", '@fontsource-variable/playfair-display');

const initDependencies = ['font-inter', 'font-heading-playfair-display'];
const initItem = item('init', {
  type: 'registry:base',
  config: { style: 'vega', iconLibrary: 'tabler', menuColor: 'inverted-translucent', menuAccent: 'bold', tailwind: { baseColor: 'neutral' } },
  dependencies: [`${cliPackage}@latest`, 'cn@^0.2.2'],
  registryDependencies: initDependencies,
  files: [],
  cssVars: { theme: { 'color-background': 'var(--background)' }, light: { background: 'oklch(1 0 0)', radius: '0.875rem' }, dark: { background: 'oklch(0.145 0 0)' } },
  css: {
    '@import "tw-animate-css"': {},
    [`@import "${cliPackage}/tailwind.css"`]: {},
    '@layer base': { '*': { '@apply border-border outline-ring/50': {} }, body: { '@apply bg-background text-foreground': {} } },
  },
});

let server: Server;
let registryUrl: string;
let origin: string;
let cwd: string;
let initRequests: string[];

beforeAll(async () => {
  server = createServer((request, response) => {
    const path = request.url ?? '';
    if (path.startsWith('/init')) initRequests.push(path);
    if (path.includes('baseColor=gray')) return void response.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'Invalid baseColor "gray"' }));
    const body = path.startsWith('/init') ? initItem : registryFiles[path.replace(/^\/r\//, '')];
    response.writeHead(body ? 200 : 404, { 'content-type': 'application/json' }).end(body ? JSON.stringify(body) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  origin = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
  registryUrl = `${origin}/r`;
});
afterAll(() => void server.close());

beforeEach(() => {
  initRequests = [];
  process.stdin.isTTY = true;
  vi.mocked(select).mockReset();
  process.env.SVELTERY_REGISTRY_URL = registryUrl;
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-cli-'));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.0.0', svelte: '^5.0.0', tailwindcss: '^4.0.0', cn: '^0.2.2' } }));
  mkdirSync(join(cwd, 'src'));
  writeFileSync(join(cwd, 'src/app.css'), "@import 'tailwindcss';\n");
});
afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
  process.stdin.isTTY = false;
});

const read = (path: string) => readFileSync(join(cwd, path), 'utf8');
const defaults = { yes: true, install: false };

describe('init', () => {
  test('writes components.json and the theme, and a second run changes nothing', async () => {
    const first = await init({ cwd, ...defaults, icons: 'tabler' });
    expect(JSON.parse(read('components.json'))).toEqual({
      $schema: new URL('/schema.json', registryUrl).href,
      style: 'nova',
      iconLibrary: 'tabler',
      rtl: false,
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
    expect(first.devDependencies).toEqual(['@sveltery/ui@^0.2.0']);

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

  test('gives #lib/* an index.js fallback in a SvelteKit 3 app, keeping the indentation, once', async () => {
    writeFileSync(join(cwd, 'package.json'), `{\n\t"devDependencies": ${JSON.stringify(JSON.parse(read('package.json')).devDependencies)},\n\t"imports": { "#lib": "./src/lib/index.js", "#lib/*": "./src/lib/*" }\n}\n`);
    await init({ cwd, ...defaults });
    const written = read('package.json');
    expect([written.split('\n')[1]?.startsWith('\t"devDependencies"'), JSON.parse(written).imports]).toEqual([true, { '#lib': './src/lib/index.js', '#lib/*': ['./src/lib/*', './src/lib/*/index.js'] }]);
    const second = await init({ cwd, ...defaults });
    expect([read('package.json'), second.files.some((file) => file.path === 'package.json')]).toEqual([written, false]);
  });

  test('stops before changing anything when Tailwind is missing', async () => {
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.0.0', svelte: '^5.0.0' } }));
    await expect(init({ cwd, ...defaults })).rejects.toThrow('Sveltery needs tailwindcss 4, and package.json does not list it. Run `npx sv add tailwindcss`, then run init again.');
    expect([existsSync(join(cwd, 'components.json')), read('src/app.css')]).toEqual([false, "@import 'tailwindcss';\n"]);
  });

  test('rejects an unknown style flag', async () => {
    await expect(init({ cwd, ...defaults, style: 'nebula' })).rejects.toThrow('Unknown style "nebula". Choose one of: vega, nova, maia, lyra, mira, luma, sera, rhea.');
  });

  test('installs the base packages at the ranges the registry source uses', () => {
    const docs = JSON.parse(readFileSync(new URL('../../../apps/docs/package.json', import.meta.url), 'utf8'));
    const declared = { ...docs.dependencies, ...docs.devDependencies };
    for (const spec of baseDependencies) {
      const [name, range] = spec.split('@^');
      expect(declared[name!].replace(/^\^/, ''), name).toBe(range);
    }
  });

  test('keeps the menu settings of an existing components.json when the flags path runs', async () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ menuColor: 'inverted', menuAccent: 'bold' }));
    await init({ cwd, ...defaults });
    expect(JSON.parse(read('components.json'))).toMatchObject({ menuColor: 'inverted', menuAccent: 'bold' });
  });

  test('--rtl writes rtl: true, add then flips the marked icons, and a later run keeps it', async () => {
    await init({ cwd, ...defaults, rtl: true });
    expect(JSON.parse(read('components.json')).rtl).toBe(true);
    await add(['button'], { ...defaults, overwrite: false, all: false, dryRun: false, cwd });
    expect(read('src/lib/components/ui/button/Button.svelte')).toContain('<button class="rtl:rotate-180 px-2.5">');
    await init({ cwd, ...defaults });
    expect(JSON.parse(read('components.json')).rtl).toBe(true);
    await init({ cwd, ...defaults, rtl: false });
    expect(JSON.parse(read('components.json')).rtl).toBe(false);
  });

  test('a bold menuAccent in components.json gives the flags path theme the primary color as its accent', async () => {
    const neutral = registryFiles['themes/neutral.json'];
    const modes = (primary: string, foreground: string) => ({ primary, 'primary-foreground': foreground, accent: 'oklch(0.97 0 0)', 'accent-foreground': 'oklch(0.205 0 0)' });
    registryFiles['themes/neutral.json'] = item('neutral', { type: 'registry:theme', files: [], cssVars: { light: modes('oklch(0.205 0 0)', 'oklch(0.985 0 0)'), dark: modes('oklch(0.922 0 0)', 'oklch(0.205 0 0)') } });
    try {
      writeFileSync(join(cwd, 'components.json'), JSON.stringify({ menuAccent: 'bold' }));
      await init({ cwd, ...defaults });
      const css = read('src/app.css');
      expect(css).toContain('--accent: oklch(0.205 0 0);\n  --accent-foreground: oklch(0.985 0 0);');
      expect(css).toContain('--accent: oklch(0.922 0 0);\n  --accent-foreground: oklch(0.205 0 0);');
      expect(css).not.toContain('oklch(0.97 0 0)');
    } finally {
      registryFiles['themes/neutral.json'] = neutral;
    }
  });

  describe('--preset', () => {
    const b0Url = '/init?style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&preset=b0';

    test('a preset code fetches the init item and writes its settings, fonts and packages, the same way twice', async () => {
      const first = await init({ cwd, ...defaults, preset: 'b0' });
      expect(initRequests).toEqual([b0Url]);
      expect(JSON.parse(read('components.json'))).toEqual({
        $schema: new URL('/schema.json', registryUrl).href,
        style: 'vega',
        iconLibrary: 'tabler',
        rtl: false,
        menuColor: 'inverted-translucent',
        menuAccent: 'bold',
        tailwind: { css: 'src/app.css', baseColor: 'neutral' },
        aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
        registry: registryUrl,
        typescript: true,
      });
      expect(Object.keys(JSON.parse(read('components.json'))).slice(2, 6)).toEqual(['iconLibrary', 'rtl', 'menuColor', 'menuAccent']);
      expect(read('src/app.css')).toBe(`@import 'tailwindcss';
@import 'tw-animate-css';
@import '${cliPackage}/tailwind.css';
@import '@fontsource-variable/inter';
@import '@fontsource-variable/playfair-display';
@custom-variant dark (&:is(.dark *));
:root {
  --background: oklch(1 0 0);
  --radius: 0.875rem;
}
.dark {
  --background: oklch(0.145 0 0);
}
@theme inline {
  --color-background: var(--background);
  --font-sans: 'Inter Variable', sans-serif;
  --font-heading: 'Playfair Display Variable', serif;
}
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
`);
      expect(first.dependencies).toEqual(['class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0', '@tabler/icons-svelte@^3.48.0', '@fontsource-variable/inter', '@fontsource-variable/playfair-display']);
      expect(first.devDependencies).toEqual([`${cliPackage}@^0.2.0`]);

      const config = read('components.json');
      const css = read('src/app.css');
      const second = await init({ cwd, ...defaults, preset: 'b0' });
      expect(second.files.map((file) => file.status)).toEqual(['identical', 'identical']);
      expect([read('components.json'), read('src/app.css')]).toEqual([config, css]);
    });

    test('a named preset sends its heading font, and an init URL passes through unchanged', async () => {
      await init({ cwd, ...defaults, preset: 'sera' });
      await init({ cwd, ...defaults, preset: `${origin}/init?style=nova&font=inter` });
      expect(initRequests).toEqual([
        '/init?style=sera&baseColor=taupe&theme=taupe&iconLibrary=lucide&font=noto-sans&menuAccent=subtle&menuColor=default&radius=default&chartColor=taupe&fontHeading=playfair-display',
        '/init?style=nova&font=inter',
      ]);
    });

    test('--rtl adds rtl=true to the init URL, --no-rtl drops it from a URL, and the preset item can set it', async () => {
      await init({ cwd, ...defaults, preset: 'nova', rtl: true });
      await init({ cwd, ...defaults, preset: `${origin}/init?style=nova&rtl=true`, rtl: false });
      expect(initRequests).toEqual([
        '/init?style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=geist&menuAccent=subtle&menuColor=default&radius=default&rtl=true',
        '/init?style=nova',
      ]);
      const { config } = initItem as unknown as { config: { rtl?: boolean } };
      config.rtl = true;
      try {
        await init({ cwd, ...defaults, preset: 'b0' });
        expect(JSON.parse(read('components.json')).rtl).toBe(true);
        await init({ cwd, ...defaults, preset: 'b0', rtl: false });
        expect(JSON.parse(read('components.json')).rtl).toBe(false);
      } finally {
        delete config.rtl;
      }
    });

    test('prints the preset item\'s docs', async () => {
      Object.assign(initItem, { docs: 'See the RTL docs.' });
      const info = vi.spyOn(log, 'info');
      try {
        await init({ cwd, ...defaults, preset: 'b0' });
        expect(info).toHaveBeenCalledWith('See the RTL docs.');
      } finally {
        info.mockRestore();
        delete (initItem as { docs?: string }).docs;
      }
    });

    test('a code with a chart color keeps it, and neutral is left out', async () => {
      await init({ cwd, ...defaults, preset: 'b4rwZGojoh' });
      expect(initRequests[0]).toBe(
        '/init?style=sera&baseColor=taupe&theme=blue&iconLibrary=lucide&font=noto-sans&menuAccent=bold&menuColor=inverted-translucent&radius=large&chartColor=emerald&fontHeading=playfair-display&preset=b4rwZGojoh',
      );
    });

    test('writes the files of items the preset depends on, with this project\'s transforms', async () => {
      initDependencies.push(`${registryUrl}/styles/nova/button.json`);
      try {
        const plan = await init({ cwd, ...defaults, preset: 'b0' });
        expect(plan.files.map((file) => [file.path, file.status])).toEqual([
          ['components.json', 'new'],
          ['src/app.css', 'changed'],
          ['src/lib/components/ui/button/Button.svelte', 'new'],
        ]);
        expect(read('src/lib/components/ui/button/Button.svelte')).toContain("import { IconChevronRight } from '@tabler/icons-svelte';");
        expect(plan.dependencies).toContain('@tabler/icons-svelte@^3.48.0');
      } finally {
        initDependencies.pop();
      }
    });

    test('rejects an unknown name, a bad code, a conflicting flag and an item that is not a base', async () => {
      await expect(init({ cwd, ...defaults, preset: 'nebula' })).rejects.toThrow('Unknown preset "nebula". Use one of nova, vega, maia, lyra, mira, luma, sera, rhea, a preset code, or the URL of an /init item.');
      await expect(init({ cwd, ...defaults, preset: 'b!!' })).rejects.toThrow('Unknown preset "b!!".');
      await expect(init({ cwd, ...defaults, preset: 'b0', style: 'nova' })).rejects.toThrow('--preset sets the style, icon library and base color.');
      const url = `${registryUrl}/styles/nova/button.json`;
      await expect(init({ cwd, ...defaults, preset: url })).rejects.toThrow(`${url} is a registry:ui item, and a preset must be a registry:base item.`);
      expect([initRequests, existsSync(join(cwd, 'components.json'))]).toEqual([[], false]);
    });

    test('prints the reason /init gives for rejecting a preset', async () => {
      await expect(init({ cwd, ...defaults, preset: 'btLmMa' })).rejects.toThrow(/failed with 400 Bad Request: Invalid baseColor "gray"$/);
      expect(existsSync(join(cwd, 'components.json'))).toBe(false);
    });

    test('--preset without a value uses nova with --yes', async () => {
      await init({ cwd, ...defaults, preset: true });
      expect(initRequests[0]).toContain('/init?style=nova&');
      expect(select).not.toHaveBeenCalled();
    });

    test('--preset without a value asks, and Custom writes nothing and points at the create page', async () => {
      vi.mocked(select).mockResolvedValueOnce('custom');
      const info = vi.spyOn(log, 'info').mockImplementation(() => {});
      try {
        const plan = await init({ cwd, ...defaults, yes: false, preset: true });
        expect(plan).toEqual({ files: [], dependencies: [], devDependencies: [] });
        expect(info).toHaveBeenCalledWith(`Build your custom preset on ${origin}/create, then copy and run the command from the page.`);
      } finally {
        info.mockRestore();
      }
      expect([initRequests, existsSync(join(cwd, 'components.json'))]).toEqual([[], false]);
      const options = vi.mocked(select).mock.calls[0]![0].options as { value: string; label: string; hint?: string }[];
      expect([options[0], options.at(-1)]).toEqual([
        { value: 'nova', label: 'Nova', hint: 'Lucide / Geist' },
        { value: 'custom', label: 'Custom', hint: `Build your own at ${origin}/create` },
      ]);
    });

    test('choosing a preset from the prompt fetches it', async () => {
      vi.mocked(select).mockResolvedValueOnce('maia');
      await init({ cwd, ...defaults, yes: false, preset: true });
      expect(initRequests[0]).toContain('/init?style=maia&');
    });
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

  test('adds a block: its page in the route, its components under the components alias, its imports on the aliases', async () => {
    const plan = await add(['login-01'], options());
    expect(plan.files.map((file) => file.path)).toEqual([
      'src/lib/components/ui/button/Button.svelte',
      'src/routes/login/+page.svelte',
      'src/lib/components/login-form.svelte',
      'src/routes/login/data.json',
    ]);
    expect(plan.devDependencies).toEqual(['@types/d3-scale@^4.0.9']);
    expect(read('src/routes/login/+page.svelte')).toContain("import LoginForm from '$lib/components/login-form.svelte';");
    expect(read('src/lib/components/login-form.svelte')).toBe("<script lang=\"ts\">\n  import { Button } from '$lib/components/ui/button';\n</script>\n<form class=\"\"><Button>Login</Button></form>\n");
    expect(await diff(['login-01'], { cwd })).toBe('Everything is up to date.');
  });

  test('adds an item by URL', async () => {
    const plan = await add([`${registryUrl}/styles/nova/button.json`], options());
    expect(plan.files.map((file) => file.path)).toEqual(['src/lib/components/ui/button/Button.svelte']);
  });

  test('names unknown items, failed requests and newer registries', async () => {
    await expect(add(['buton'], options())).rejects.toThrow('Not in the registry: buton. Available items: button, dialog, login-01.');
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

describe('migrate rtl', () => {
  const ui = 'src/lib/components/ui';
  beforeEach(async () => {
    await init({ cwd, ...defaults });
    mkdirSync(join(cwd, ui, 'card'), { recursive: true });
    mkdirSync(join(cwd, ui, 'calendar'), { recursive: true });
    writeFileSync(join(cwd, ui, 'card/Card.svelte'), '<div class="ml-2 text-left">x</div>\n');
    writeFileSync(join(cwd, ui, 'card/variants.ts'), "export const v = cva('pl-2 rounded-l-md');\n");
    writeFileSync(join(cwd, ui, 'calendar/Calendar.svelte'), '<div class="flex">x</div>\n');
  });

  test('sets rtl: true and rewrites every component under the ui alias', async () => {
    const result = await migrateRtl({ cwd, yes: true });
    expect(JSON.parse(read('components.json')).rtl).toBe(true);
    expect(read(`${ui}/card/Card.svelte`)).toBe('<div class="ms-2 text-start">x</div>\n');
    expect(read(`${ui}/card/variants.ts`)).toBe("export const v = cva('ps-2 rounded-s-md');\n");
    expect(result.transformed.sort()).toEqual(['card/Card.svelte', 'card/variants.ts']);
    expect(result.review).toEqual(['calendar/Calendar.svelte']);
  });

  test('limits the migration to a file, a directory or a glob', async () => {
    await migrateRtl({ cwd, yes: true, path: `${ui}/card/Card.svelte` });
    expect(read(`${ui}/card/variants.ts`)).toContain('pl-2');
    expect(read(`${ui}/card/Card.svelte`)).toContain('ms-2');
    await migrateRtl({ cwd, yes: true, path: `${ui}/**/*.ts` });
    expect(read(`${ui}/card/variants.ts`)).toContain('ps-2');
    await expect(migrateRtl({ cwd, yes: true, path: 'nope' })).rejects.toThrow('File not found: nope');
    await expect(migrateRtl({ cwd, yes: true, path: 'src/**/*.md' })).rejects.toThrow('No files found matching: src/**/*.md');
  });

  test('changes nothing when the prompt is declined', async () => {
    vi.mocked(confirm).mockResolvedValueOnce(false);
    await migrateRtl({ cwd, yes: false });
    expect(JSON.parse(read('components.json')).rtl).toBe(false);
    expect(read(`${ui}/card/Card.svelte`)).toContain('ml-2');
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
