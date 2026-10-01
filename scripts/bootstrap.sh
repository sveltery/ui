#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
bash scripts/prepare-base.sh
node scripts/check-base.mjs --lockfile
pnpm install --frozen-lockfile
