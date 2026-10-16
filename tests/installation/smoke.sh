#!/usr/bin/env bash
# Pack every package in packages/ and Base, install the tarballs into a fresh consumer, render the helpers on the server and type-check every export.
# Base is packed from the copy this workspace installed, or taken from SVELTERY_BASE_TARBALL when set.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/toolchain.sh
consumer="$(mktemp -d)"
trap 'rm -rf "$consumer"' EXIT
pnpm --filter './packages/*' pack --pack-destination "$consumer" >/dev/null
if [[ -n "${SVELTERY_BASE_TARBALL:-}" ]]; then
  cp "$SVELTERY_BASE_TARBALL" "$consumer/sveltery-base.tgz"
else
  # npm cannot pack inside pnpm's store, so pack a copy.
  cp -RL apps/docs/node_modules/@sveltery/base "$consumer/base"
  (cd "$consumer/base" && npm pack --ignore-scripts --silent >/dev/null && mv sveltery-base-*.tgz ../sveltery-base.tgz)
  rm -rf "${consumer:?}/base"
fi
cp tests/installation/App.svelte tests/installation/check.mjs tests/installation/exports.mjs tests/installation/tsconfig.json "$consumer"
node -e '
  const fs = require("fs");
  const [root, consumer] = process.argv.slice(1);
  const pkg = require(`${root}/package.json`);
  const docs = require(`${root}/apps/docs/package.json`);
  const tarballs = {};
  for (const file of fs.readdirSync(consumer).filter((file) => file.endsWith(".tgz"))) {
    const name = file === "sveltery-base.tgz" ? "@sveltery/base" : `@sveltery/${file.replace(/^sveltery-(.+)-\d+\.\d+\.\d+.*\.tgz$/, "$1")}`;
    tarballs[name] = `file:${consumer}/${file}`;
  }
  const deps = { ...tarballs, "date-fns": docs.dependencies["date-fns"], "@date-fns/tz": require(`${root}/packages/day-picker/package.json`).devDependencies["@date-fns/tz"], svelte: pkg.devDependencies.svelte, typescript: pkg.devDependencies.typescript };
  fs.writeFileSync(`${consumer}/package.json`, JSON.stringify({ name: "consumer", private: true, type: "module", packageManager: pkg.packageManager, dependencies: deps }));
  // Point any range on a packed package at its tarball too.
  const overrides = Object.entries(tarballs).map(([name, spec]) => `  "${name}": "${spec}"\n`).join("");
  const workspace = fs.readFileSync(`${root}/pnpm-workspace.yaml`, "utf8").replace(/^packages:\n(  - .*\n)+/m, "");
  fs.writeFileSync(`${consumer}/pnpm-workspace.yaml`, /^overrides:\n/m.test(workspace) ? workspace.replace(/^overrides:\n/m, `overrides:\n${overrides}`) : `${workspace}overrides:\n${overrides}`);
' "$PWD" "$consumer"
(cd "$consumer" && pnpm install --config.auto-install-peers=true >/dev/null && node --conditions=svelte check.mjs && node exports.mjs && pnpm exec tsc -p tsconfig.json && echo 'Every export of every package type-checks')
