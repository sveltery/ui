import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
// Hosts the Playwright fixtures so test probes never ship with the docs site.
export default defineConfig({ plugins: [tailwindcss(), sveltekit({ adapter: adapter(), alias: { $registry: '../../apps/docs/registry', $examples: '../../apps/docs/examples' } })] });
