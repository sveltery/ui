import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', '**/build/**', '.checks/**', '**/.wrangler/**', 'test-results/**', 'playwright-report/**', 'scripts/icons/**'] },
  js.configs.recommended, ...ts.configs.recommended, ...svelte.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  { files: ['**/*.svelte', '**/*.svelte.ts'], languageOptions: { parserOptions: { parser: ts.parser } }, rules: { 'svelte/no-at-const-tags': 'error' } },
  // The docs site serves from the origin root and builds its links from content data, so it does not need resolve().
  // Its {@html} only renders Shiki output built from repository files and Pagefind's escaped excerpts.
  // scripts/sync-upstream.mjs copies these from react-resizable-panels unchanged, so they keep upstream's lint rules.
  { files: ['packages/resizable/src/lib/{constants,types}.ts', 'packages/resizable/src/lib/{global,utils,vendor}/**', 'packages/resizable/src/lib/components/group/{sortByElementOffset*,auto-save/**}'], rules: { 'no-useless-assignment': 'off', '@typescript-eslint/no-unused-vars': 'off' } },
  { files: ['apps/docs/src/**/*.svelte'], rules: { 'svelte/no-navigation-without-resolve': 'off', 'svelte/no-at-html-tags': 'off' } },
];
