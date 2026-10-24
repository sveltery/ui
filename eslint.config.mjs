import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import { readFileSync } from 'node:fs';

const rechartsVendored = readFileSync(new URL('./packages/charts/scripts/vendored.txt', import.meta.url), 'utf8').split('\n').filter(Boolean).map((path) => `packages/charts/${path}`);
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', '**/build/**', '.checks/**', '**/.wrangler/**', 'test-results/**', 'playwright-report/**', 'scripts/icons/**'] },
  js.configs.recommended, ...ts.configs.recommended, ...svelte.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  { files: ['**/*.svelte', '**/*.svelte.ts'], languageOptions: { parserOptions: { parser: ts.parser } }, rules: { 'svelte/no-at-const-tags': 'error' } },
  // The docs site serves from the origin root and builds its links from content data, so it does not need resolve().
  // Its {@html} only renders Shiki output built from repository files and Pagefind's escaped excerpts.
  // packages/charts/scripts/sync-upstream.mjs copies these from recharts, and src/react.ts mirrors @types/react 18, so they keep upstream's lint rules.
  { files: [...rechartsVendored, 'packages/charts/types.d.ts', 'packages/charts/src/react.ts'], linterOptions: { reportUnusedDisableDirectives: 'off' }, rules: { 'no-useless-assignment': 'off', '@typescript-eslint/no-unused-vars': 'off', '@typescript-eslint/no-explicit-any': 'off' } },
  // Its inline comment disables a rule from eslint-plugin-import, which this repo does not use.
  { files: ['packages/charts/src/animation/configUpdate.ts'], plugins: { import: { rules: { 'no-default-export': { create: () => ({}) } } } } },
  // packages/charts/scripts/convert-shadcn-charts.mjs converts these from shadcn's charts, so their Date locals stay as upstream wrote them.
  { files: ['tests/app/src/routes/chart/recharts/chart-*/+page.svelte', 'apps/docs/examples/charts/Chart*.svelte', 'apps/docs/examples/base/Chart*.svelte', 'apps/docs/blocks/dashboard-01/components/chart-area-interactive.svelte'], rules: { 'svelte/prefer-svelte-reactivity': 'off' } },
  { files: ['apps/docs/src/**/*.svelte'], rules: { 'svelte/no-navigation-without-resolve': 'off', 'svelte/no-at-html-tags': 'off' } },
];
