#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
node --test scripts/tests/*.test.mjs
node scripts/check-base.mjs --lockfile
pnpm lint
pnpm --filter @sveltery/ui build
pnpm check
pnpm test
pnpm --filter @sveltery/docs build
bash scripts/check-package.sh
node .github/check-docs.mjs
