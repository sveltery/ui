/**
 * The files of the monorepo that `init --monorepo` creates, ported from upstream's `templates/vite-monorepo`: a SvelteKit
 * app in `apps/web`, the shared `@workspace/ui` package in `packages/ui`, and Turborepo at the root.
 */

export const UI_DIR = 'packages/ui';
export const APP_DIR = 'apps/web';
export const DEFAULT_PROJECT_NAME = 'sveltekit-monorepo';

/** The aliases of each workspace's components.json, as upstream's template sets them. The app's own files use SvelteKit's `#lib`. */
export const uiAliases = { components: '@workspace/ui/components', utils: '@workspace/ui/lib/utils', hooks: '@workspace/ui/hooks', lib: '@workspace/ui/lib', ui: '@workspace/ui/components' };
export const appAliases = { components: '#lib/components', hooks: '#lib/hooks', lib: '#lib', utils: '@workspace/ui/lib/utils', ui: '@workspace/ui/components' };
export const UI_CSS = 'src/styles/globals.css';
export const APP_CSS = `../../${UI_DIR}/${UI_CSS}`;

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno';

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

const versions = {
  adapterAuto: '^8.0.0',
  kit: '^3.0.0',
  vitePluginSvelte: '^7.2.0',
  tailwind: '^4.3.0',
  svelte: '^5.56.7',
  svelteCheck: '^4.6.0',
  typescript: '^6.0.3',
  vite: '^8.3.0',
  turbo: '^2.11.7',
};

const turbo = {
  $schema: 'https://turbo.build/schema.json',
  ui: 'tui',
  tasks: {
    build: { dependsOn: ['^build'], inputs: ['$TURBO_DEFAULT$', '.env*'], outputs: ['.svelte-kit/**', 'build/**'] },
    check: { dependsOn: ['^check'] },
    dev: { cache: false, persistent: true },
  },
};

const gitignore = `node_modules

# Output
.svelte-kit
build
dist

# env files (can opt-in for committing if needed)
.env*

# turbo
.turbo

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

# OS
.DS_Store
Thumbs.db
`;

const readme = `# Sveltery UI monorepo template

This is a SvelteKit monorepo template with Sveltery UI.

## Adding components

To add components to your app, run the following command at the root of your \`web\` app:

\`\`\`bash
npx @sveltery/ui@latest add button
\`\`\`

This will place the ui components in the \`packages/ui/src/components\` directory.

## Using components

To use the components in your app, import them from the \`ui\` package.

\`\`\`svelte
<script lang="ts">
  import { Button } from '@workspace/ui/components/button';
</script>
\`\`\`
`;

const viteConfig = `import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) => (filename.split(/[/\\\\]/).includes('node_modules') ? undefined : true),
      },
      // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      adapter: adapter(),
    }),
  ],
});
`;

const appHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      try {
        const stored = localStorage.getItem('theme');
        const dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', dark);
      } catch {}
    </script>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
`;

const appTypes = `// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
`;

const themeProvider = `<script lang="ts">
  import type { Snippet } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';

  let { children }: { children: Snippet } = $props();

  const systemDark = new MediaQuery('(prefers-color-scheme: dark)');

  function storedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch {
      return null;
    }
  }

  // Until the d key stores a choice, follow changes of the system color scheme while the page is open.
  $effect(() => {
    const dark = systemDark.current;
    if (storedTheme() === null) document.documentElement.classList.toggle('dark', dark);
  });

  function isEditable(target: EventTarget | null) {
    return target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true']") !== null);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.key.toLowerCase() !== 'd' || isEditable(event.target)) return;
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  }
</script>

<svelte:window {onkeydown} />

{@render children()}
`;

const layout = `<script lang="ts">
  import '@workspace/ui/globals.css';
  import ThemeProvider from '#lib/components/theme-provider.svelte';

  let { children } = $props();
</script>

<ThemeProvider>
  {@render children()}
</ThemeProvider>
`;

const page = `<script lang="ts">
  import { Button } from '@workspace/ui/components/button';
</script>

<div class="flex min-h-svh p-6">
  <div class="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
    <div>
      <h1 class="font-medium">Project ready!</h1>
      <p>You may now add components and start building.</p>
      <p>We&apos;ve already added the button component for you.</p>
      <Button class="mt-2">Button</Button>
    </div>
    <div class="text-muted-foreground font-mono text-xs">
      (Press <kbd>d</kbd> to toggle dark mode)
    </div>
  </div>
</div>
`;

const globalsCss = `@import 'tailwindcss';
@source '../../../apps/**/*.{ts,svelte}';
@source '../../../components/**/*.{ts,svelte}';
@source '../**/*.{ts,svelte}';
`;

const uiTsconfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    moduleResolution: 'bundler',
    verbatimModuleSyntax: true,
    isolatedModules: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    paths: { '@workspace/ui/*': ['./src/*'] },
  },
  include: ['src'],
};

/**
 * Every file of the monorepo, by path from its root. pnpm lists the workspaces in pnpm-workspace.yaml and the other package
 * managers in package.json, and npm, which has no `workspace:` protocol, depends on the ui package as `*`, as upstream's
 * `adaptWorkspaceConfig` rewrites its pnpm template. `packageManager` is the root's `packageManager` field, which Turborepo needs.
 */
export function monorepoFiles({ name, packageManager, agent }: { name: string; packageManager: string; agent: PackageManager }): Record<string, string> {
  const workspaces = ['apps/*', 'packages/*'];
  const root = {
    name,
    version: '0.0.1',
    private: true,
    scripts: { build: 'turbo build', dev: 'turbo dev', check: 'turbo check' },
    devDependencies: { turbo: versions.turbo, typescript: versions.typescript },
    packageManager,
    engines: { node: '>=20.19.0' },
    ...(agent === 'pnpm' ? {} : { workspaces }),
  };
  const app = {
    name: 'web',
    version: '0.0.1',
    type: 'module',
    private: true,
    scripts: {
      dev: 'vite dev',
      build: 'vite build',
      preview: 'vite preview',
      prepare: "svelte-kit sync || echo ''",
      check: 'svelte-kit sync && svelte-check --tsconfig ./tsconfig.json',
    },
    dependencies: { '@workspace/ui': agent === 'npm' ? '*' : 'workspace:*' },
    devDependencies: {
      '@sveltejs/adapter-auto': versions.adapterAuto,
      '@sveltejs/kit': versions.kit,
      '@sveltejs/vite-plugin-svelte': versions.vitePluginSvelte,
      '@tailwindcss/vite': versions.tailwind,
      svelte: versions.svelte,
      'svelte-check': versions.svelteCheck,
      tailwindcss: versions.tailwind,
      typescript: versions.typescript,
      vite: versions.vite,
    },
    // The index.js fallback lets TypeScript resolve a folder such as #lib/components/ui/button, as `init` adds it to a SvelteKit 3 app.
    imports: { '#lib': './src/lib/index.js', '#lib/*': ['./src/lib/*', './src/lib/*/index.js'] },
  };
  const ui = {
    name: '@workspace/ui',
    version: '0.0.0',
    type: 'module',
    private: true,
    scripts: { check: 'svelte-check --tsconfig ./tsconfig.json' },
    dependencies: { svelte: versions.svelte },
    devDependencies: {
      '@tailwindcss/vite': versions.tailwind,
      'svelte-check': versions.svelteCheck,
      tailwindcss: versions.tailwind,
      typescript: versions.typescript,
      vite: versions.vite,
    },
    exports: {
      './globals.css': `./${UI_CSS}`,
      './lib/*': './src/lib/*.ts',
      './components/*': './src/components/*/index.ts',
      './hooks/*': './src/hooks/*.ts',
    },
  };
  return {
    '.gitignore': gitignore,
    'README.md': readme,
    'package.json': json(root),
    ...(agent === 'pnpm' ? { 'pnpm-workspace.yaml': `packages:\n${workspaces.map((pattern) => `  - "${pattern}"\n`).join('')}` } : {}),
    'turbo.json': json(turbo),
    [`${APP_DIR}/components.json`]: json({ tailwind: { css: APP_CSS }, aliases: appAliases }),
    [`${APP_DIR}/package.json`]: json(app),
    [`${APP_DIR}/src/app.d.ts`]: appTypes,
    [`${APP_DIR}/src/app.html`]: appHtml,
    [`${APP_DIR}/src/lib/components/theme-provider.svelte`]: themeProvider,
    [`${APP_DIR}/src/lib/index.ts`]: "// place files you want to import through the `#lib` alias in this folder.\n",
    [`${APP_DIR}/src/routes/+layout.svelte`]: layout,
    [`${APP_DIR}/src/routes/+page.svelte`]: page,
    [`${APP_DIR}/tsconfig.json`]: json({ extends: '$app/tsconfig', compilerOptions: { strict: true }, include: ['src', 'vite.config.ts'] }),
    [`${APP_DIR}/vite.config.ts`]: viteConfig,
    [`${UI_DIR}/components.json`]: json({ tailwind: { css: UI_CSS }, aliases: uiAliases }),
    [`${UI_DIR}/package.json`]: json(ui),
    [`${UI_DIR}/${UI_CSS}`]: globalsCss,
    [`${UI_DIR}/src/components/.gitkeep`]: '',
    [`${UI_DIR}/src/hooks/.gitkeep`]: '',
    [`${UI_DIR}/src/lib/.gitkeep`]: '',
    [`${UI_DIR}/tsconfig.json`]: json(uiTsconfig),
  };
}
