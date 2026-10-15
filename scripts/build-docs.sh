#!/usr/bin/env bash
# The docs build for CI and Cloudflare Workers Builds. Run from any directory.
set -euo pipefail
cd "$(dirname "$0")/.."
bash scripts/bootstrap.sh
source scripts/toolchain.sh
pnpm --filter @sveltery/ui build
pnpm --filter @sveltery/docs build
