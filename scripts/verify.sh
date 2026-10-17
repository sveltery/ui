#!/usr/bin/env bash
# Runs every check, or one part of them: static, unit or build. CI runs the parts as parallel jobs.
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
part="${1:-all}"
case "$part" in all | static | unit | build) ;; *) echo "Unknown part: $part (expected static, unit or build)" >&2; exit 1 ;; esac
runs() { [[ "$part" == all || "$part" == "$1" ]]; }
if runs static; then
  node --test scripts/tests/*.test.mjs
  node scripts/generate-icons.mjs --check
  pnpm lint
fi
pnpm --filter @sveltery/resizable --filter @sveltery/svelte --filter @sveltery/command build
if runs static; then pnpm check; fi
if runs unit; then
  # The docs registry tests extend the docs app's generated tsconfig, which check or build would otherwise create.
  pnpm --filter @sveltery/docs exec svelte-kit sync
  pnpm test
fi
if runs build; then
  pnpm --filter @sveltery/docs build
  bash scripts/check-remote-fields.sh
  bash tests/installation/smoke.sh
  node .github/check-docs.mjs
fi
