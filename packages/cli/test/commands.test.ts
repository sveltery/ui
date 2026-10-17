// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { confirm, log, select } from '@clack/prompts';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { add } from '../src/commands/add.js';
import { apply, type ApplyOptions } from '../src/commands/apply.js';
import { build } from '../src/commands/build.js';
import { diff } from '../src/commands/diff.js';
import { baseDependencies, init } from '../src/commands/init.js';
import { migrate, migrateRtl, type MigrateOptions } from '../src/commands/migrate.js';
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
  'elsewhere/hello.json': item('hello', { registryDependencies: ['button'], files: [{ type: 'registry:ui', target: 'hello/Hello.svelte', content: '<p>hello</p>\n' }] }),
  'themes/neutral.json': item('neutral', {
    type: 'registry:theme',
    files: [],
    cssVars: { theme: { 'color-background': 'var(--background)' }, light: { background: 'oklch(1 0 0)' }, dark: { background: 'oklch(0.145 0 0)' } },
  }),
};

const font = (name: string, variable: string, family: string, dependency: string) =>
  item(name, { type: 'registry:font', files: [], font: { family, provider: 'google', import: name, variable, dependency } });
registryFiles['themes/stone.json'] = item('stone', {
  type: 'registry:theme',
  files: [],
  cssVars: { theme: { 'color-background': 'var(--background)' }, light: { background: 'oklch(0.99 0.001 106)' }, dark: { background: 'oklch(0.147 0.004 49)' } },
});
registryFiles['styles/vega/button.json'] = item('button', { files: [{ type: 'registry:ui', target: 'button/Button.svelte', content: button.replace('px-2.5', 'px-3') }] });
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

/** What /init serves for `only=theme`: the theme part alone, as the docs route builds it. */
const themeItem = item('nova-theme', {
  type: 'registry:base',
  config: { menuColor: 'inverted', menuAccent: 'bold', tailwind: { baseColor: 'neutral' } },
  files: [],
  cssVars: { light: { background: 'oklch(0.99 0 0)' }, dark: { background: 'oklch(0.2 0 0)' } },
});

let server: Server;
let registryUrl: string;
let origin: string;
let cwd: string;
let initRequests: string[];
let acmeRequests: string[];

beforeAll(async () => {
  server = createServer((request, response) => {
    const path = request.url ?? '';
    if (path.startsWith('/init')) initRequests.push(path);
    if (path.includes('baseColor=gray')) return void response.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'Invalid baseColor "gray"' }));
    // The @acme registry wants a bearer token or a token parameter, and serves its items in the style the URL names.
    if (path.startsWith('/acme/')) {
      acmeRequests.push(path);
      if (request.headers.authorization !== 'Bearer s3cret' && !path.endsWith('?token=s3cret')) {
        return void response.writeHead(401, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'Unauthorized', message: 'Set ACME_TOKEN.' }));
      }
    }
    const body = path.startsWith('/init') ? (path.includes('only=theme') ? themeItem : initItem) : registryFiles[path.replace(/\?.*/, '').replace(/^\/r\//, '').replace(/^\//, '')];
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
  acmeRequests = [];
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

describe('apply', () => {
  const buttonPath = 'src/lib/components/ui/button/Button.svelte';
  const options = (rest: Partial<ApplyOptions> = {}): ApplyOptions => ({ cwd, yes: true, silent: false, install: false, ...rest });

  beforeEach(async () => {
    vi.mocked(confirm).mockReset();
    await init({ cwd, ...defaults });
    await add(['button'], { cwd, ...defaults, overwrite: false, all: false, dryRun: false });
    writeFileSync(join(cwd, buttonPath), 'mine\n');
  });

  test('writes the preset like init --preset and re-adds installed items with the new style and icon library', async () => {
    const plan = await apply('b0', options());
    expect(initRequests).toEqual(['/init?style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&preset=b0']);
    expect(JSON.parse(read('components.json'))).toMatchObject({ style: 'vega', iconLibrary: 'tabler', menuColor: 'inverted-translucent', menuAccent: 'bold' });
    expect(read('src/app.css')).toContain("@import '@fontsource-variable/inter';");
    expect(plan.files.map((file) => [file.path, file.status])).toEqual([
      ['components.json', 'changed'],
      ['src/app.css', 'changed'],
      [buttonPath, 'changed'],
    ]);
    expect(read(buttonPath)).toBe(`<script lang="ts">
  import { IconChevronRight } from '@tabler/icons-svelte';
  let { children } = $props();
</script>
<button class="px-3">{@render children?.()}<IconChevronRight /></button>
`);
    expect(plan.dependencies).toContain('@tabler/icons-svelte@^3.48.0');
  });

  test('--only theme sends only=theme, keeps the style and icon library, and leaves the components alone', async () => {
    await apply(undefined, options({ preset: 'b0', only: 'theme' }));
    expect(initRequests[0]).toMatch(/&preset=b0&only=theme$/);
    expect(JSON.parse(read('components.json'))).toMatchObject({ style: 'nova', iconLibrary: 'lucide', menuColor: 'inverted', menuAccent: 'bold' });
    expect(read('src/app.css')).toContain('--background: oklch(0.99 0 0);');
    expect(read(buttonPath)).toBe('mine\n');
  });

  test('takes only from an /init URL, and --only overrides it', async () => {
    await apply(`${origin}/init?preset=b0&only=theme`, options());
    await apply(`${origin}/init?preset=b0&only=font`, options({ only: 'theme' }));
    expect(initRequests).toEqual(['/init?preset=b0&only=theme', '/init?preset=b0&only=theme']);
    expect(read(buttonPath)).toBe('mine\n');
  });

  test('lists the items it will re-add and asks, defaulting to no', async () => {
    vi.mocked(confirm).mockResolvedValueOnce(false);
    const warn = vi.spyOn(log, 'warn').mockImplementation(() => {});
    try {
      await expect(apply('b0', options({ yes: false }))).rejects.toThrow('Cancelled.');
      expect(warn.mock.calls[0]![0]).toContain('The following components will be re-installed:\n  - button');
    } finally {
      warn.mockRestore();
    }
    expect(vi.mocked(confirm).mock.calls[0]![0]).toMatchObject({ message: 'Would you like to continue?', initialValue: false });
    expect([initRequests, read(buttonPath)]).toEqual([[], 'mine\n']);
  });

  test('without a preset, points at the Create page and writes nothing', async () => {
    const config = read('components.json');
    const info = vi.spyOn(log, 'info').mockImplementation(() => {});
    try {
      expect(await apply(undefined, options())).toEqual({ files: [], dependencies: [], devDependencies: [] });
      expect(info).toHaveBeenCalledWith(`Build your custom preset on ${origin}/create.\nThen run \`npx @sveltery/ui@latest apply --preset <preset>\` with the preset code or URL from the page.`);
    } finally {
      info.mockRestore();
    }
    expect([initRequests, read('components.json')]).toEqual([[], config]);
  });

  test.each([
    [{ only: true as const }, 'b0', 'Missing value for --only.'],
    [{ only: 'theme,icons' }, 'b0', 'Invalid value for --only: theme,icons.'],
    [{ only: 'theme' }, undefined, 'Missing preset for --only.'],
    [{ preset: 'nova' }, 'sera', 'Received two different presets.'],
    [{}, 'nebula', 'Unknown preset "nebula".'],
  ])('rejects %o with %s', async (rest, preset, message) => {
    await expect(apply(preset, options(rest))).rejects.toThrow(message);
    expect(initRequests).toEqual([]);
  });

  test('needs a project that ran init', async () => {
    rmSync(join(cwd, 'components.json'));
    await expect(apply('b0', options())).rejects.toThrow(`No components.json in ${cwd}. The apply command only works in a project that ran init. Run \`npx @sveltery/ui@latest init --preset b0\` first.`);
  });
});

describe('migrate', () => {
  const buttonPath = 'src/lib/components/ui/button/Button.svelte';
  const options = (rest: Partial<MigrateOptions> = {}) => ({ cwd, yes: true, install: false, list: false, ...rest });

  describe('icons', () => {
    beforeEach(async () => {
      vi.mocked(confirm).mockReset();
      await init({ cwd, ...defaults });
      await add(['button'], { cwd, ...defaults, overwrite: false, all: false, dryRun: false });
    });

    test('swaps the icons in the ui directory and records the library in components.json', async () => {
      expect(await migrate('icons', options({ to: 'tabler' }))).toEqual({ changed: [buttonPath], skipped: [] });
      expect(read(buttonPath)).toBe(`<script lang="ts">
  import { IconChevronRight } from '@tabler/icons-svelte';
  let { children } = $props();
</script>
<button class="px-2.5">{@render children?.()}<IconChevronRight /></button>
`);
      expect(JSON.parse(read('components.json')).iconLibrary).toBe('tabler');
      expect(await diff([], { cwd })).toBe('Everything is up to date.');
    });

    test('a glob takes the files it matches and skips the directories', async () => {
      expect(await migrate('icons', options({ to: 'tabler', path: 'src/**' }))).toEqual({ changed: [buttonPath], skipped: [] });
    });

    test('reports a file that does not parse and migrates the rest', async () => {
      writeFileSync(join(cwd, 'src/lib/components/ui/no-icons.ts'), "export const html = '<script></script>';\n");
      writeFileSync(join(cwd, 'src/lib/components/ui/html.ts'), "import XIcon from '@lucide/svelte/icons/x';\nexport const html = '<script></script>';\n");
      const warn = vi.spyOn(log, 'warn').mockImplementation(() => {});
      try {
        expect(await migrate('icons', options({ to: 'tabler' }))).toEqual({ changed: [buttonPath], skipped: [] });
        expect(warn.mock.calls).toEqual([['Skipped 1 file. These were left untouched:\n  - src/lib/components/ui/html.ts: could not parse (Unterminated string constant at line 2)']]);
      } finally {
        warn.mockRestore();
      }
    });

    test('a path limits the run and leaves components.json alone', async () => {
      await migrate('icons', options({ to: 'tabler', path: buttonPath }));
      expect([read(buttonPath).includes('<IconChevronRight />'), JSON.parse(read('components.json')).iconLibrary]).toEqual([true, 'lucide']);
    });

    test('asks to continue, defaulting to yes, and a no changes nothing', async () => {
      vi.mocked(confirm).mockResolvedValueOnce(false);
      const before = read(buttonPath);
      await migrate('icons', options({ yes: false, from: 'lucide', to: 'tabler' }));
      expect(vi.mocked(confirm).mock.calls[0]![0]).toMatchObject({ message: 'We will migrate 1 files in ./src/lib/components/ui from lucide to tabler. Continue?', initialValue: true });
      expect(read(buttonPath)).toBe(before);
    });

    test.each([
      [{ to: 'feather' }, 'Unknown icon library: feather. Available libraries: lucide, tabler, hugeicons, phosphor, remixicon.'],
      [{ to: 'lucide' }, 'You cannot migrate to the same icon library.'],
      [{}, 'Pass the icon library to migrate to with --to.'],
    ])('rejects %o', async (rest, message) => {
      await expect(migrate('icons', options(rest))).rejects.toThrow(message);
    });
  });

  test('base-color changes the tokens that hold the old color and records the new one', async () => {
    await init({ cwd, ...defaults });
    await migrate('base-color', options({ to: 'stone' }));
    expect(read('src/app.css')).toContain(':root {\n  --background: oklch(0.99 0.001 106);\n}\n.dark {\n  --background: oklch(0.147 0.004 49);\n}');
    expect(JSON.parse(read('components.json')).tailwind.baseColor).toBe('stone');
  });

  test('base-color takes the source from components.json and asks only for the target', async () => {
    await init({ cwd, ...defaults });
    vi.mocked(select).mockReset().mockResolvedValueOnce('stone');
    vi.mocked(confirm).mockReset().mockResolvedValueOnce(true);
    await migrate('base-color', options({ yes: false }));
    expect(vi.mocked(select).mock.calls.map(([prompt]) => prompt.message)).toEqual(['Which base color would you like to migrate to?']);
    expect(JSON.parse(read('components.json')).tailwind.baseColor).toBe('stone');
  });

  describe('cn', () => {
    const utils = "import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n";
    beforeEach(() => {
      writeFileSync(join(cwd, 'package.json'), JSON.stringify({ dependencies: { clsx: '^2.1.1', 'tailwind-merge': '^3.3.1' }, devDependencies: { tailwindcss: '^4.0.0' } }));
      mkdirSync(join(cwd, 'src/lib'), { recursive: true });
      writeFileSync(join(cwd, 'src/lib/utils.ts'), utils);
      mkdirSync(join(cwd, 'node_modules/clsx'), { recursive: true });
      writeFileSync(join(cwd, 'node_modules/clsx/index.ts'), utils);
    });

    test('migrates the source files outside node_modules, and needs no components.json', async () => {
      expect(await migrate('cn', options())).toEqual({ changed: ['src/lib/utils.ts'], removed: [] });
      expect(read('src/lib/utils.ts')).toBe("export { cn } from 'cn';\n");
      expect(read('node_modules/clsx/index.ts')).toBe(utils);
    });

    test('a glob takes the files it matches and skips the directories', async () => {
      mkdirSync(join(cwd, 'src/lib/components'));
      writeFileSync(join(cwd, 'src/lib/components/a.ts'), utils);
      expect(await migrate('cn', options({ path: 'src/lib/*' }))).toEqual({ changed: ['src/lib/utils.ts'], removed: [] });
      expect(read('src/lib/components/a.ts')).toBe(utils);
    });

    test('migrates a script with a hashbang, and reports a file that does not parse and migrates the rest', async () => {
      const html = 'import { clsx } from "clsx";\nexport const html = `<script>${clsx("a")}</script>`;\n';
      writeFileSync(join(cwd, 'src/lib/html.ts'), html);
      mkdirSync(join(cwd, 'scripts'));
      writeFileSync(join(cwd, 'scripts/gen.mjs'), `#!/usr/bin/env node\n${utils}`);
      const warn = vi.spyOn(log, 'warn').mockImplementation(() => {});
      try {
        expect(await migrate('cn', options())).toEqual({ changed: ['scripts/gen.mjs', 'src/lib/utils.ts'], removed: [] });
        expect(warn.mock.calls).toEqual([['Manual review required for 1 item:\n  - src/lib/html.ts: could not parse (Unterminated template literal at line 2)']]);
      } finally {
        warn.mockRestore();
      }
      expect([read('scripts/gen.mjs'), read('src/lib/html.ts')]).toEqual(["#!/usr/bin/env node\n\nexport { cn } from 'cn';\n", html]);
    });

    test('refuses tailwind-merge v2', async () => {
      writeFileSync(join(cwd, 'package.json'), JSON.stringify({ dependencies: { 'tailwind-merge': '^2.6.0' } }));
      await expect(migrate('cn', options())).rejects.toThrow('The cn migration requires Tailwind CSS v4 and tailwind-merge v3.');
      expect(read('src/lib/utils.ts')).toBe(utils);
    });
  });

  describe('rtl', () => {
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

    test('skips the directories a glob matches', async () => {
      const result = await migrateRtl({ cwd, yes: true, path: `${ui}/**` });
      expect(result.transformed.sort()).toEqual([`${ui}/card/Card.svelte`, `${ui}/card/variants.ts`]);
      expect(read(`${ui}/card/Card.svelte`)).toContain('ms-2');
    });

    test('takes an absolute glob', async () => {
      const result = await migrateRtl({ cwd, yes: true, path: join(cwd, ui, 'card/*.svelte') });
      expect(result.transformed).toHaveLength(1);
      expect(read(`${ui}/card/Card.svelte`)).toContain('ms-2');
    });

    test('skips a file the parser rejects and migrates the rest', async () => {
      writeFileSync(join(cwd, ui, 'card/snippet.ts'), "export const s = '</script>';\n");
      const result = await migrateRtl({ cwd, yes: true });
      expect(result.transformed.sort()).toEqual(['card/Card.svelte', 'card/variants.ts']);
      expect(read(`${ui}/card/snippet.ts`)).toBe("export const s = '</script>';\n");
    });

    test('changes nothing when the prompt is declined', async () => {
      vi.mocked(confirm).mockResolvedValueOnce(false);
      await migrateRtl({ cwd, yes: false });
      expect(JSON.parse(read('components.json')).rtl).toBe(false);
      expect(read(`${ui}/card/Card.svelte`)).toContain('ml-2');
    });
  });

  test('lists the migrations, and rejects an unknown one', async () => {
    const info = vi.spyOn(log, 'info').mockImplementation(() => {});
    try {
      await migrate(undefined, options());
      expect(info).toHaveBeenCalledWith('Available migrations:\n- cn: migrate clsx and tailwind-merge to cn.\n- icons: migrate your ui components to a different icon library.\n- base-color: migrate your theme to a different base color.\n- rtl: migrate your components to support RTL (right-to-left).');
    } finally {
      info.mockRestore();
    }
    await expect(migrate('radix', options())).rejects.toThrow("shadcn/ui's radix migration moves @radix-ui/react-* imports to the radix-ui package. A Svelte project has no such imports, so Sveltery UI has no radix migration.");
    await expect(migrate('rename', options())).rejects.toThrow('Unknown migration "rename".');
  });
});

describe('add', () => {
  beforeEach(() => init({ cwd, ...defaults }));
  const options = (extra: { overwrite?: boolean; all?: boolean; dryRun?: boolean; diff?: string | true; view?: string | true } = {}) => ({ ...defaults, overwrite: false, all: false, dryRun: false, cwd, ...extra });

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

  describe('--diff and --view', () => {
    const buttonPath = 'src/lib/components/ui/button/Button.svelte';
    const titlePath = 'src/lib/components/ui/dialog/DialogTitle.svelte';
    const printed = async (args: string[], extra: Parameters<typeof options>[0]) => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await add(args, options(extra));
        return spy.mock.calls.map(([line]) => line);
      } finally {
        spy.mockRestore();
      }
    };

    test('--diff prints the diff of each file that would change, and writes nothing', async () => {
      await add(['button', 'dialog'], options());
      writeFileSync(join(cwd, buttonPath), read(buttonPath).replace('px-2.5', 'px-4'));
      rmSync(join(cwd, titlePath));
      const edited = read(buttonPath);
      expect(await printed(['dialog'], { diff: true })).toEqual([
        `--- a/${buttonPath}
+++ b/${buttonPath}
@@ -2,4 +2,4 @@
   import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
   let { children } = $props();
 </script>
-<button class="px-4">{@render children?.()}<ChevronRightIcon /></button>
+<button class="px-2.5">{@render children?.()}<ChevronRightIcon /></button>

--- /dev/null
+++ b/${titlePath}
@@ -0,0 +1,4 @@
+<script lang="ts">
+  import { render } from '../shared/render.js';
+</script>
+<h2 class="text-base">{@render render()}</h2>`,
      ]);
      expect([read(buttonPath), existsSync(join(cwd, titlePath))]).toEqual([edited, false]);
    });

    test('--diff <path> shows the files whose path contains it, and says when none does', async () => {
      await add(['button', 'dialog'], options());
      writeFileSync(join(cwd, buttonPath), 'mine\n');
      writeFileSync(join(cwd, titlePath), 'mine\n');
      const [onlyButton] = await printed(['dialog'], { diff: 'button/Button' });
      expect([onlyButton.startsWith(`--- a/${buttonPath}\n`), onlyButton.includes(titlePath)]).toEqual([true, false]);
      expect(await printed(['dialog'], { diff: 'render.ts' })).toEqual(['src/lib/components/ui/shared/render.ts is identical to the registry version.']);
      expect(await printed(['dialog'], { diff: 'nothing' })).toEqual(['No file matching "nothing" found.']);
    });

    test('--diff says so when nothing would change', async () => {
      await add(['button'], options());
      expect(await printed(['button'], { diff: true })).toEqual(['No changes.']);
    });

    test('--diff shows five files at most, and --diff <path> shows one of the rest', async () => {
      const files = Array.from({ length: 7 }, (_, index) => ({ type: 'registry:ui', target: `many/File${index}.ts`, content: `export const n = ${index};\n` }));
      registryFiles['styles/nova/many.json'] = item('many', { files });
      try {
        const [overview] = await printed([`${registryUrl}/styles/nova/many.json`], { diff: true });
        expect([overview.match(/^\+\+\+ /gm)?.length, overview.endsWith('Showing 5 of 7 files. Use --diff <path> to show one file.')]).toEqual([5, true]);
        expect(await printed([`${registryUrl}/styles/nova/many.json`], { diff: 'File6' })).toEqual([
          '--- /dev/null\n+++ b/src/lib/components/ui/many/File6.ts\n@@ -0,0 +1,1 @@\n+export const n = 6;',
        ]);
      } finally {
        delete registryFiles['styles/nova/many.json'];
      }
    });

    test('--view prints the contents the files would have, and writes nothing', async () => {
      expect(await printed(['button'], { view: true })).toEqual([
        `${buttonPath} (new, 5 lines)
<script lang="ts">
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  let { children } = $props();
</script>
<button class="px-2.5">{@render children?.()}<ChevronRightIcon /></button>`,
      ]);
      expect(existsSync(join(cwd, 'src/lib'))).toBe(false);
      expect(await printed(['dialog'], { view: 'DialogTitle' })).toEqual([
        `${titlePath} (new, 4 lines)
<script lang="ts">
  import { render } from '../shared/render.js';
</script>
<h2 class="text-base">{@render render()}</h2>`,
      ]);
    });

    test('--view marks a changed file as changed', async () => {
      await add(['button'], options());
      writeFileSync(join(cwd, buttonPath), 'mine\n');
      expect((await printed(['button'], { view: 'Button.svelte' }))[0].split('\n')[0]).toBe(`${buttonPath} (changed, 5 lines)`);
    });
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

  test('adds an item that build wrote', async () => {
    const source = mkdtempSync(join(tmpdir(), 'sveltery-source-'));
    try {
      mkdirSync(join(source, 'src/lib/components/ui/hello'), { recursive: true });
      writeFileSync(join(source, 'src/lib/components/ui/hello/Hello.svelte'), '<p>Hello</p>\n');
      const files = [{ path: 'src/lib/components/ui/hello/Hello.svelte', type: 'registry:ui' }];
      writeFileSync(join(source, 'registry.json'), JSON.stringify({ name: 'acme', homepage: 'https://acme.test', items: [{ name: 'hello', type: 'registry:ui', registryDependencies: ['button'], files }] }));
      build('registry.json', { cwd: source, output: 'static/r' });
      registryFiles['acme/hello.json'] = JSON.parse(readFileSync(join(source, 'static/r/hello.json'), 'utf8'));
    } finally {
      rmSync(source, { recursive: true, force: true });
    }
    const plan = await add([`${registryUrl}/acme/hello.json`], options());
    expect(plan.files.map((file) => file.path)).toEqual(['src/lib/components/ui/button/Button.svelte', 'src/lib/components/ui/hello/Hello.svelte']);
    expect(read('src/lib/components/ui/hello/Hello.svelte')).toBe('<p>Hello</p>\n');
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

describe('namespaced registries', () => {
  const addOptions = { ...defaults, overwrite: false, all: false, dryRun: false };
  const hello = '<p>Hello</p>\n';
  beforeAll(() => {
    registryFiles['acme/nova/hello.json'] = item('hello', { registryDependencies: ['button', '@acme/greet'], files: [{ type: 'registry:ui', target: 'hello/Hello.svelte', content: hello }] });
    registryFiles['acme/nova/greet.json'] = item('greet', { type: 'registry:lib', files: [{ type: 'registry:ui', target: 'greet/index.ts', content: 'export const greet = 1;\n' }] });
  });
  beforeEach(() => init({ cwd, ...defaults }));
  afterEach(() => void delete process.env.ACME_TOKEN);
  const configure = (registries: unknown) => writeFileSync(join(cwd, 'components.json'), JSON.stringify({ ...JSON.parse(read('components.json')), registries }));
  const acme = () => ({ url: `${origin}/acme/{style}/{name}.json`, headers: { Authorization: 'Bearer ${ACME_TOKEN}' } });

  test('adds @namespace/item with its headers, and namespaced registryDependencies', async () => {
    configure({ '@acme': acme() });
    process.env.ACME_TOKEN = 's3cret';
    const plan = await add(['@acme/hello'], { ...addOptions, cwd });
    expect(plan.files.map((file) => file.path)).toEqual([
      'src/lib/components/ui/button/Button.svelte',
      'src/lib/components/ui/greet/index.ts',
      'src/lib/components/ui/hello/Hello.svelte',
    ]);
    expect(read('src/lib/components/ui/hello/Hello.svelte')).toBe(hello);
    expect(await diff(['@acme/hello'], { cwd })).toBe('Everything is up to date.');
  });

  test('reads the token from .env.local, and the process environment wins', async () => {
    configure({ '@acme': acme() });
    writeFileSync(join(cwd, '.env'), 'ACME_TOKEN=wrong\n');
    writeFileSync(join(cwd, '.env.local'), 'ACME_TOKEN=s3cret\n');
    expect((await add(['@acme/greet'], { ...addOptions, cwd })).files.map((file) => file.path)).toEqual(['src/lib/components/ui/greet/index.ts']);
    process.env.ACME_TOKEN = 'wrong';
    await expect(add(['@acme/greet'], { ...addOptions, cwd })).rejects.toThrow(
      `You are not authorized to access the item at ${origin}/acme/nova/greet.json. If this is a remote registry, you may need to authenticate.\n[Unauthorized] Set ACME_TOKEN.\nCheck your authentication credentials and environment variables.`,
    );
  });

  test('sends params as a query string', async () => {
    configure({ '@acme': { url: `${origin}/acme/{style}/{name}.json`, params: { token: '${ACME_TOKEN}' } } });
    process.env.ACME_TOKEN = 's3cret';
    expect((await add(['@acme/greet'], { ...addOptions, cwd })).files.map((file) => file.path)).toEqual(['src/lib/components/ui/greet/index.ts']);
    expect(acmeRequests).toEqual(['/acme/nova/greet.json?token=s3cret']);
  });

  test('prints ${VAR} in place of the values it expands to', async () => {
    configure({ '@acme': { url: `${origin}/acme/{style}/{name}.json`, params: { token: '${ACME_TOKEN}' } } });
    process.env.ACME_TOKEN = 'wrong';
    await expect(add(['@acme/greet'], { ...addOptions, cwd })).rejects.toMatchObject({
      message: `You are not authorized to access the item at ${origin}/acme/nova/greet.json?token=\${ACME_TOKEN}. If this is a remote registry, you may need to authenticate.\n[Unauthorized] Set ACME_TOKEN.\nCheck your authentication credentials and environment variables.`,
    });
    configure({ '@acme': acme() });
    process.env.ACME_TOKEN = 's3\ncret';
    await expect(add(['@acme/greet'], { ...addOptions, cwd })).rejects.toMatchObject({ message: `Could not reach ${origin}/acme/nova/greet.json: a header name or value is not valid` });
  });

  test('rejects an item name that would expand a variable or leave the namespace path', async () => {
    configure({ '@acme': acme() });
    process.env.ACME_TOKEN = 's3cret';
    registryFiles['acme/nova/leak.json'] = item('leak', { registryDependencies: ['@acme/${ACME_TOKEN}'], files: [] });
    await expect(add(['@acme/leak'], { ...addOptions, cwd })).rejects.toThrow('"@acme/${ACME_TOKEN}" is not a valid item name. An @namespace/item name cannot contain "${", "?", "#" or a ".." segment.');
    expect(acmeRequests).toEqual(['/acme/nova/leak.json']);
    for (const name of ['@acme/greet?x=1', '@acme/greet#x', '@acme/../r/index', '@acme/a/%2e%2e/greet']) {
      await expect(add([name], { ...addOptions, cwd })).rejects.toThrow(`"${name}" is not a valid item name.`);
    }
    expect(acmeRequests).toEqual(['/acme/nova/leak.json']);
  });

  test('names an unknown namespace, a missing variable and an invalid registries entry', async () => {
    await expect(add(['@nope/hello'], { ...addOptions, cwd })).rejects.toThrow(
      'Unknown registry "@nope". Make sure it is defined under "registries" in your components.json file:\n{\n  "registries": {\n    "@nope": "[URL_TO_REGISTRY]"\n  }\n}',
    );
    configure({ '@acme': acme() });
    await expect(add(['@acme/hello'], { ...addOptions, cwd })).rejects.toThrow(
      'Registry "@acme" requires the following environment variables:\n\n  • ACME_TOKEN\n\nSet the required environment variables to your .env or .env.local file.',
    );
    configure({ acme: `${origin}/acme/{name}.json` });
    await expect(add(['@acme/hello'], { ...addOptions, cwd })).rejects.toThrow('components.json is invalid. registries.acme: registry names must start with @, such as @acme.');
    configure({ '@acme': `${origin}/acme/hello.json` });
    await expect(add(['@acme/hello'], { ...addOptions, cwd })).rejects.toThrow('registries.@acme: expected a URL with a {name} placeholder');
  });

  test('@sveltery names the project registry, and init keeps registries', async () => {
    expect((await add(['@sveltery/button'], { ...addOptions, cwd })).files.map((file) => file.path)).toEqual(['src/lib/components/ui/button/Button.svelte']);
    configure({ '@acme': acme() });
    await init({ cwd, ...defaults });
    expect(JSON.parse(read('components.json')).registries).toEqual({ '@acme': acme() });
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

  test('errors on an item that is not installed or not in the registry', async () => {
    rmSync(join(cwd, 'src/lib/components/ui/dialog'), { recursive: true });
    await expect(diff(['dialog'], { cwd })).rejects.toThrow('dialog is not installed. Run `npx @sveltery/ui@latest add dialog` first.');
    await expect(diff(['buton'], { cwd })).rejects.toThrow('Not in the registry: buton.');
  });

  describe('items added by URL', () => {
    const helloPath = 'src/lib/components/ui/hello/Hello.svelte';
    let helloUrl: string;
    beforeEach(() => {
      helloUrl = `${origin}/r/elsewhere/hello.json`;
      return add([helloUrl], { cwd, ...addOptions });
    });

    test('a URL counts as installed when its file exists, and diffs against its own item and its registry dependencies', async () => {
      expect(await diff([helloUrl], { cwd })).toBe('Everything is up to date.');
      writeFileSync(join(cwd, helloPath), '<p>mine</p>\n');
      editButton();
      const output = await diff([helloUrl], { cwd });
      expect([output.includes(`--- a/${helloPath}\n+++ b/${helloPath}\n@@ -1,1 +1,1 @@\n-<p>mine</p>\n+<p>hello</p>`), output.includes(`--- a/${buttonPath}`), output.split('\n').at(-1)]).toEqual([true, true, '2 files differ in 2 items']);
      expect((await diff(['button'], { cwd })).includes(helloPath)).toBe(false);
    });

    test('a URL whose files are gone is not installed', async () => {
      rmSync(join(cwd, 'src/lib/components/ui/hello'), { recursive: true });
      await expect(diff([helloUrl], { cwd })).rejects.toThrow(`${helloUrl} is not installed. Run \`npx @sveltery/ui@latest add ${helloUrl}\` first.`);
    });

    test('naming no item checks the registry\'s items, not the URLs', async () => {
      writeFileSync(join(cwd, helloPath), '<p>mine</p>\n');
      expect(await diff([], { cwd })).toBe('Everything is up to date.');
    });

    test('a missing file names the URL in the update hint', async () => {
      rmSync(join(cwd, buttonPath));
      expect((await diff([helloUrl], { cwd })).split('\n').at(-1)).toBe(`1 file in the registry is not in your project yet. \`npx @sveltery/ui@latest update ${helloUrl}\` adds it.`);
    });

    test('a URL that the registry does not serve is a request error', async () => {
      await expect(diff([`${origin}/r/elsewhere/missing.json`], { cwd })).rejects.toThrow(`GET ${origin}/r/elsewhere/missing.json failed with 404 Not Found`);
    });
  });

  test('says so when no item is installed', async () => {
    rmSync(join(cwd, 'src/lib'), { recursive: true });
    expect(await diff([], { cwd })).toBe('No items from the registry are installed. Name an item you added by URL, or add one with `npx @sveltery/ui@latest add button`.');
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

  test('a URL limits the update to that item and its registry dependencies, and needs it installed', async () => {
    const helloUrl = `${origin}/r/elsewhere/hello.json`;
    const helloPath = 'src/lib/components/ui/hello/Hello.svelte';
    await expect(update([helloUrl], { cwd, ...defaults })).rejects.toThrow(`${helloUrl} is not installed. Run \`npx @sveltery/ui@latest add ${helloUrl}\` first.`);
    await add([helloUrl], { cwd, ...addOptions });
    writeFileSync(join(cwd, helloPath), 'mine\n');
    writeFileSync(join(cwd, buttonPath), 'my button\n');
    writeFileSync(join(cwd, titlePath), 'my title\n');
    const plan = await update([helloUrl], { cwd, ...defaults });
    expect(plan.files.map((file) => file.path)).toEqual([buttonPath, helloPath]);
    expect([read(helloPath), read(titlePath)]).toEqual(['<p>hello</p>\n', 'my title\n']);
    expect(await diff([helloUrl], { cwd })).toBe('Everything is up to date.');
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

