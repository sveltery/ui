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
  { files: ['apps/docs/src/**/*.svelte'], rules: { 'svelte/no-navigation-without-resolve': 'off', 'svelte/no-at-html-tags': 'off' } },
];
