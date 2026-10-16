#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
node --test scripts/tests/*.test.mjs
node scripts/generate-icons.mjs --check
pnpm lint
pnpm --filter @sveltery/components build
pnpm check
pnpm test
pnpm --filter @sveltery/docs build
bash scripts/check-remote-fields.sh
bash tests/installation/smoke.sh
node .github/check-docs.mjs
