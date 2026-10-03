import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const fixture = (name: string) => fileURLToPath(new URL(`../../tests/reference/${name}`, import.meta.url));
export default defineConfig({ plugins: [tailwindcss(), sveltekit({ adapter: adapter(), alias: { '@/registry/bases/base/ui/button': fixture('button.tsx'), '@/app/(create)/components/icon-placeholder': fixture('icon.tsx') } })] });
