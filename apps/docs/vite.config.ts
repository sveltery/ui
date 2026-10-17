import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { headings } from './markdown/headings';
import { docsComponents, highlightCodeBlock } from './markdown/preprocess';
import { registryStyles } from './registry/vite';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  server: { fs: { allow: ['blocks', 'content', 'examples', 'registry'] } },
  // Examples load through a glob, so the dependency scan has to be pointed at them or a first visit reloads the page.
  optimizeDeps: { entries: ['blocks/**/*.svelte', 'examples/**/*.svelte'] },
  // Redux Toolkit 1.9 ships CommonJS, which the dev server cannot load externally during SSR.
  ssr: { noExternal: ['@reduxjs/toolkit'], optimizeDeps: { include: ['@sveltery/recharts > @reduxjs/toolkit'] } },
  plugins: [
    // As on ui.shadcn.com, only the Create preview renders raw tokens, and the homepage cards render in Rhea.
    registryStyles({ root: path('.'), zones: { 'src/routes/preview/': 'tokens', 'src/routes/(site)/cards/': 'rhea' } }),
    tailwindcss(),
    sveltekit({
      adapter: adapter(),
      alias: { $lib: 'src/lib', $registry: 'registry' },
      experimental: { remoteFunctions: true },
      extensions: ['.svelte', '.md'],
      preprocess: [
        mdsvex({ extensions: ['.md'], smartypants: false, remarkPlugins: [headings], highlight: { highlighter: highlightCodeBlock } }),
        docsComponents({ examples: path('./examples'), repoRoot: path('../..') }),
      ],
      prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
    }),
  ],
});
