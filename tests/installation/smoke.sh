#!/usr/bin/env bash
# Pack @sveltery/ui, @sveltery/resizable, @sveltery/message-scroller, @sveltery/questionnaire and @sveltery/command, install them into a fresh consumer and render every component on the server.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/toolchain.sh
consumer="$(mktemp -d)"
trap 'rm -rf "$consumer"' EXIT
pnpm --filter @sveltery/ui --filter @sveltery/resizable --filter @sveltery/message-scroller --filter @sveltery/questionnaire --filter @sveltery/command pack --pack-destination "$consumer" >/dev/null
cp tests/installation/App.svelte tests/installation/check.mjs "$consumer"
node -e '
  const [root, consumer] = process.argv.slice(1);
  const pkg = require(`${root}/package.json`);
  const base = pkg.devDependencies["@sveltery/base"].replace(/^file:/, `file:${root}/`);
  const deps = { "@sveltery/ui": `file:${consumer}/sveltery-ui-0.0.0.tgz`, "@sveltery/resizable": `file:${consumer}/sveltery-resizable-0.0.0.tgz`, "@sveltery/message-scroller": `file:${consumer}/sveltery-message-scroller-0.0.0.tgz`, "@sveltery/questionnaire": `file:${consumer}/sveltery-questionnaire-0.0.0.tgz`, "@sveltery/command": `file:${consumer}/sveltery-command-0.0.0.tgz`, "@sveltery/base": base, layerchart: require(`${root}/packages/ui/package.json`).devDependencies.layerchart, svelte: pkg.devDependencies.svelte };
  require("fs").writeFileSync(`${consumer}/package.json`, JSON.stringify({ name: "consumer", private: true, type: "module", packageManager: pkg.packageManager, dependencies: deps }));
' "$PWD" "$consumer"
cp pnpm-workspace.yaml "$consumer/"
(cd "$consumer" && pnpm install --config.auto-install-peers=true >/dev/null && node --conditions=svelte check.mjs)
