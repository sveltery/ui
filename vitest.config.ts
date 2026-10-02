import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
export default defineConfig({ plugins: [svelte()], resolve: { alias: [
  // Source DOM helpers and the diagnostic app must share one icon cache/context.
  // App/browser and isolated consumers retain their actual packaged imports.
  { find: /^@sveltery\/ui\/icons$/, replacement: new URL('./apps/docs/registry/bases/base/ui/icons/index.ts', import.meta.url).pathname },
], conditions: ['browser'] }, test: { environment: 'jsdom', include: ['tests/dom/*.test.ts'] } });
