#!/usr/bin/env bash
# Builds every workspace package the test app or docs import from dist, so a new one can't be left out of CI.
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
mapfile -t filters < <(node -e '
const fs = require("node:fs");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const imported = new Set(["tests/app", "apps/docs"].flatMap((dir) => {
  const pkg = read(`${dir}/package.json`);
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
}));
for (const dir of fs.readdirSync("packages")) {
  const file = `packages/${dir}/package.json`;
  if (!fs.existsSync(file)) continue;
  const pkg = read(file);
  if (imported.has(pkg.name) && JSON.stringify(pkg.exports ?? {}).includes("./dist/")) console.log(`--filter=${pkg.name}`);
}')
pnpm "${filters[@]}" build
