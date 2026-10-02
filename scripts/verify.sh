#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
node --test scripts/tests/*.test.mjs
node scripts/check-base.mjs --lockfile
node scripts/generate-icons.mjs --check
pnpm lint
pnpm --filter @sveltery/ui build
pnpm check
pnpm test
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-textarea-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-skeleton-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-kbd-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-table-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-card-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-label-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-aspect-ratio-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-empty-ssr.mjs
node --import ./scripts/svelte-ssr-loader.mjs scripts/check-icons-ssr.mjs
pnpm --filter @sveltery/docs build
bash scripts/check-remote-fields.sh
bash scripts/check-package.sh
node .github/check-docs.mjs
