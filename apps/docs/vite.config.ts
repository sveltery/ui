import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { headings } from './markdown/headings';
import { docsComponents, highlightCodeBlock } from './markdown/preprocess';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  server: { fs: { allow: ['blocks', 'content', 'examples'] } },
  // Examples load through a glob, so the dependency scan has to be pointed at them or a first visit reloads the page.
  optimizeDeps: { entries: ['blocks/**/*.svelte', 'examples/**/*.svelte'] },
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter(),
      alias: { $lib: 'src/lib' },
      experimental: { remoteFunctions: true },
      extensions: ['.svelte', '.md'],
      preprocess: [
        mdsvex({ extensions: ['.md'], smartypants: false, remarkPlugins: [headings], highlight: { highlighter: highlightCodeBlock } }),
        docsComponents({ examples: path('./examples'), ui: path('../../packages/ui/src/lib') }),
      ],
      prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
    }),
  ],
});
