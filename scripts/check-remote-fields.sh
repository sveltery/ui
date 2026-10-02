#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
cd apps/docs/remote-fields-fixture
node ../node_modules/@sveltejs/kit/svelte-kit.js sync
node ../../../node_modules/svelte-check/bin/svelte-check --tsconfig ./tsconfig.json
node ../../../node_modules/vite/bin/vite.js build
node ../../../scripts/check-remote-fields.mjs
