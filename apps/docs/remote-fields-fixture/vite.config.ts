import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// Test-only opt-ins for the pinned Kit 3.0.1 direct remote-field contract.
export default defineConfig({ ssr: { noExternal: ['@sveltery/base', '@sveltery/components'] }, plugins: [sveltekit({ adapter: adapter(), compilerOptions: { experimental: { async: true } }, experimental: { remoteFunctions: true } })] });
