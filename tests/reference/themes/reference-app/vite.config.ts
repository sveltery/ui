import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
const fixture = (name: string) => fileURLToPath(new URL(`../../${name}`, import.meta.url));
export default defineConfig({ root: fileURLToPath(new URL('.', import.meta.url)), plugins: [tailwindcss()], esbuild: { jsx: 'automatic' }, resolve: { alias: { '@/registry/bases/base/ui/button': fixture('button.tsx'), '@/app/(create)/components/icon-placeholder': fixture('icon.tsx') } }, server: { fs: { allow: [fileURLToPath(new URL('../../../../..', import.meta.url))] } } });
