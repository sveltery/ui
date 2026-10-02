import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
test('immutable configurable icon contract, five real maps and renderer licenses retain source provenance', () => {
  const manifest = JSON.parse(readFileSync('tests/reference/icon-sources.json', 'utf8'));
  assert.equal(manifest.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of [...manifest.files, ...manifest.auxiliaryLicenses]) assert.equal(hash(file.local), file.sha256, file.local);
  const workspace = JSON.parse(readFileSync('package.json', 'utf8'));
  const lockfile = readFileSync('pnpm-lock.yaml', 'utf8');
  for (const pin of manifest.packages) { assert.equal(workspace.devDependencies[pin.name], pin.version); assert(lockfile.includes(pin.integrity), pin.name); }
  let source = readFileSync('tests/reference/icons/upstream/icon-placeholder.tsx', 'utf8').replace('import { lazy, Suspense } from "react"', 'import * as React from "react"\nimport { lazy, Suspense } from "react"').replace('from "shadcn/icons"', 'from "./icons/config"').replace('@/app/(app)/(create)/lib/search-params', './icons/search-params').replaceAll('@/registry/icons/', './icons/');
  assert.equal(readFileSync('tests/reference/icon.tsx', 'utf8'), source, 'genuine pinned placeholder: only React namespace and import-path substitutions');
  source = readFileSync('tests/reference/icons/upstream/create-icon-loader.tsx', 'utf8').replace('import { use } from "react"', 'import * as React from "react"\nimport { use } from "react"').replace('import(`./__${libraryName}__`)', 'loadLibrary(libraryName)').replace('const iconPromiseCaches', 'import { loadLibrary } from "./load-library"\n\nconst iconPromiseCaches');
  assert.equal(readFileSync('tests/reference/icons/create-icon-loader.tsx', 'utf8'), source, 'pinned loader logic preserved');
  for (const library of ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']) for (const file of [`__${library}__.ts`, `icon-${library}.tsx`]) assert.equal(readFileSync(`tests/reference/icons/${file}`, 'utf8'), readFileSync(`tests/reference/icons/upstream/${file}`, 'utf8'));
  const inventory = JSON.parse(readFileSync('tests/reference/icon-data.json', 'utf8'));
  assert.equal(inventory.generator.sha256, hash(inventory.generator.local));
  assert.deepEqual(inventory.outputs.map(entry => entry.declared), [186, 181, 191, 157, 156]);
  for (const output of inventory.outputs) { assert.equal(hash(output.local), output.sha256); assert.equal(output.extracted, output.declared); assert.deepEqual(output.missing, []); }
});
