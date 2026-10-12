import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', '**/build/**', '.checks/**', 'test-results/**', 'playwright-report/**', 'scripts/icons/**'] },
  js.configs.recommended, ...ts.configs.recommended, ...svelte.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  { files: ['**/*.svelte', '**/*.svelte.ts'], languageOptions: { parserOptions: { parser: ts.parser } }, rules: { 'svelte/no-at-const-tags': 'error' } },
];
