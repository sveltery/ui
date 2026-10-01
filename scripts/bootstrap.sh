#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
bash scripts/prepare-base.sh
pnpm install --frozen-lockfile
