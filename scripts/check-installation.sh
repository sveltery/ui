#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
node scripts/check-base.mjs --lockfile
node scripts/check-installation.mjs "$@"
