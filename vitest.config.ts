import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
export default defineConfig({ plugins: [svelte()], resolve: { alias: { cn: new URL('./tests/reference/cn.ts', import.meta.url).pathname }, conditions: ['browser'] }, test: { environment: 'jsdom', include: ['tests/dom/*.test.ts'] } });
