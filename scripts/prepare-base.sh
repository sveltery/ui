#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
base_source="$sveltery_repo_root/.checks/base"
base_commit="$(node -p "require('./scripts/base.lock.json').commit")"
base_repository="$(node -p "require('./scripts/base.lock.json').repository")"
mkdir -p .vendor
if [[ ! -d "$base_source/.git" ]]; then
  git clone --quiet "$base_repository" "$base_source"
fi
git -C "$base_source" fetch --quiet origin "$base_commit"
git -C "$base_source" checkout --quiet --detach "$base_commit"
test "$(git -C "$base_source" rev-parse HEAD)" = "$base_commit"
test -z "$(git -C "$base_source" status --porcelain)"
# Base is a single sv-scaffolded package at its repository root since its restart (sveltery/base#93).
(cd "$base_source" && pnpm install --frozen-lockfile && pnpm build && pnpm pack --pack-destination "$sveltery_repo_root/.vendor")
node scripts/check-base.mjs
