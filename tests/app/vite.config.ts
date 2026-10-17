import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
// Hosts the Playwright fixtures so test probes never ship with the docs site.
export default defineConfig({
  plugins: [tailwindcss(), sveltekit({ adapter: adapter(), alias: { $registry: '../../apps/docs/registry', $examples: '../../apps/docs/examples' } })],
  // Redux Toolkit 1.9 ships CommonJS, which the dev server cannot load externally during SSR.
  ssr: { noExternal: ['@reduxjs/toolkit'], optimizeDeps: { include: ['@sveltery/recharts > @reduxjs/toolkit'] } },
});
