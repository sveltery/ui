import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', '**/build/**', '.checks/**', 'tests/reference/icons/upstream/**', 'tests/reference/icons/create-icon-loader.tsx', '.vendor/**', 'test-results/**', 'playwright-report/**', 'tests/reference/base-input-1.6/ported/*.tsx', 'tests/reference/input.tsx', 'tests/reference/input-example.tsx', 'tests/reference/dialog.tsx', 'tests/reference/button.tsx', 'tests/reference/textarea.tsx', 'tests/reference/textarea-example.tsx', 'tests/reference/skeleton.tsx', 'tests/reference/skeleton-example.tsx', 'tests/reference/kbd.tsx', 'tests/reference/kbd-example.tsx', 'tests/reference/kbd-selected-examples.tsx'] },
  js.configs.recommended, ...ts.configs.recommended, ...svelte.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  { files: ['**/*.svelte', '**/*.svelte.ts'], languageOptions: { parserOptions: { parser: ts.parser } }, rules: { 'svelte/no-at-const-tags': 'error' } },
];
