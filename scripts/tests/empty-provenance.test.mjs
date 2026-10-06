import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { parse as parseSvelte } from 'svelte/compiler';

test('immutable Empty wrapper, complete deferred examples and scoped Nova retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/empty-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 3);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert.equal(pin.files[2].range, '585-616 (Empty section only)');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/empty-nova.css', 'utf8').trimEnd()));
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});

test('supplemental primitive probe does not claim or substitute any deferred gallery composition', () => {
  const source = readFileSync('tests/reference/empty-example.tsx', 'utf8');
  const probe = readFileSync('tests/reference/EmptyProbe.tsx', 'utf8');
  assert(source.includes('IconPlaceholder'));
  assert(source.includes('InputGroup'));
  for (const name of [...source.matchAll(/function (Empty\w+)\(/g)].map(match => match[1])) assert(!probe.includes(`function ${name}(`));
  assert(probe.includes('Supplemental Empty primitive probe'));
});

// New source-derived supplements; retain both original primitive/probe assertions above.
test('four selected Empty declarations retain complete immutable bodies and truthful dependency scope', () => {
  const manifest = JSON.parse(readFileSync('tests/reference/empty-gallery-sources.json', 'utf8'));
  const raw = readFileSync('tests/reference/empty-example.tsx', 'utf8');
  const selected = readFileSync('tests/reference/empty-selected-examples.tsx', 'utf8');
  assert.equal(manifest.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.deepEqual(manifest.selected, ['EmptyBasic', 'EmptyWithMutedBackground', 'EmptyWithIcon', 'EmptyInCard']);
  for (const record of manifest.selectedDeclarations) {
    const declaration = text => text.slice(text.indexOf(`function ${record.name}()`)).split(/\nfunction |\nexport \{/u)[0].trimEnd();
    assert.equal(declaration(selected), declaration(raw));
    assert.equal(Buffer.byteLength(declaration(selected)), record.bytes);
    assert.equal(createHash('sha256').update(declaration(selected)).digest('hex'), record.sha256);
  }
  for (const name of Object.keys(manifest.omitted)) assert(!selected.includes(`function ${name}(`));
  for (const dependency of ['InputGroup', 'Kbd', './card']) assert(!selected.includes(dependency));
  assert(selected.includes("import { Button } from './button'"));
  assert(selected.includes("import { IconPlaceholder } from './icon'"));
  const gallery = readFileSync('tests/reference/SelectedEmptyGallery.tsx', 'utf8');
  assert(gallery.includes('<ExampleWrapper><EmptyBasic /><EmptyWithMutedBackground /><EmptyWithIcon /><EmptyInCard /></ExampleWrapper>'));
  assert(!gallery.includes('function EmptyExample('));
});

test('complete original Empty environment and metadata retain independent byte and Git-blob identities', () => {
  const manifest = JSON.parse(readFileSync('tests/reference/empty-gallery-sources.json', 'utf8'));
  assert.equal(manifest.originalFiles.length, 24);
  for (const record of manifest.originalFiles.filter(record => record.byteExactFixture)) {
    const bytes = readFileSync(record.byteExactFixture);
    assert.equal(bytes.length, record.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), record.gitBlob);
  }
  assert.equal(manifest.genuineTestInventory.trackedRecords, 139);
  assert.equal(manifest.genuineTestInventory.testSources, 133);
  assert.equal(manifest.genuineTestInventory.snapshots, 6);
  assert(manifest.genuineTestInventory.wrapperAbsenceList.includes('Empty'));
  const native = readFileSync('apps/docs/examples/base/EmptyExample.svelte', 'utf8');
  for (const dependency of ['@sveltery/ui/example', '@sveltery/ui/empty', '@sveltery/ui/button', '@sveltery/ui/icons']) assert(native.includes(dependency));
  assert(native.includes('<a {...props} href="#">{@render children?.()}</a>'));
  assert(native.includes('{#snippet learnMoreText()}Learn more{/snippet}'));
  assert(native.includes('{@render learnMoreText()} <IconPlaceholder'));
  assert(native.includes('{@render postDescriptionText()} '));
  assert(!native.includes('@sveltery/ui/card'));
  assert(!native.includes('InputGroup'));
});

test('finite source integration preserves full historical proof and exactly binds every current changed path', () => {
  const path = 'diagnostics/alert-child-segmentation/source-authentication.json';
  const bytes = readFileSync(path); const manifest = JSON.parse(bytes);
  const sha = value => createHash('sha256').update(value).digest('hex');
  const blob = value => createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
  const canonical = rows => JSON.stringify([...rows].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  assert.equal(sha(canonical(manifest.baseline.rows)), 'c26e4c75341710d442aa5cdbdb9a3a482cc1f72892cdf05badc21a2df0e56941');
  assert.equal(manifest.baseline.rows.length, 655);
  for (const [index, expected] of ['bb7f58e273634768867c7ae794b7dd3b1bffa0d06a6e934e418336813de3a443', 'bbfb69daca1d641d5a51ed323de3de7b261d16896b8f3cbcefd4893e7ddc1952'].entries()) {
    const restored = new Map(manifest.baseline.rows.map(row => [row[0], row]));
    for (const change of manifest.historical[index].replacements) { if (change.row === null) restored.delete(change.path); else restored.set(change.path, change.row); }
    assert.equal(sha(canonical([...restored.values()])), expected);
  }
  const configPath = 'diagnostics/alert-child-segmentation/vite.config.ts';
  const configBytes = readFileSync(configPath); const config = configBytes.toString('utf8');
  assert.deepEqual(Buffer.from(config), configBytes);
  const ast = ts.createSourceFile(configPath, config, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(ast.parseDiagnostics.length, 0);
  const slots = ast.statements.filter(ts.isVariableStatement).flatMap(statement => statement.declarationList.flags === ts.NodeFlags.Const ? [...statement.declarationList.declarations] : []).filter(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === 'sourceAuthenticationManifestSha256');
  assert.equal(slots.length, 1);
  const literal = slots[0].initializer; assert(ts.isStringLiteral(literal));
  assert.match(literal.getText(ast), /^'[a-f0-9]{64}'$/u);
  assert.equal(literal.text, sha(bytes));
  const start = Buffer.byteLength(config.slice(0, literal.getStart(ast) + 1)); const end = Buffer.byteLength(config.slice(0, literal.end - 1));
  assert.equal(end - start, 64);
  const normalized = Buffer.concat([configBytes.subarray(0, start), Buffer.from('0'.repeat(64)), configBytes.subarray(end)]);
  const configEntry = manifest.changes.find(change => change.path === configPath);
  assert.equal(configEntry.after.kind, 'normalized-config');
  assert.deepEqual(configEntry.after.row, [configPath, '100644', normalized.length, sha(normalized), blob(normalized)]);
  const root = manifest.changes.find(change => change.path === path);
  assert.deepEqual(root.after, { kind: 'manifest-root', mode: '100644', binding: 'full-manifest-sha256-via-config-slot' });
  const baseline = new Map(manifest.baseline.rows.map(row => [row[0], row]));
  const currentPaths = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean).sort();
  const changed = [];
  for (const sourcePath of currentPaths) {
    const data = readFileSync(sourcePath); const entry = manifest.changes.find(change => change.path === sourcePath);
    const original = baseline.get(sourcePath);
    if (!original || original[2] !== data.length || original[3] !== sha(data)) changed.push(sourcePath);
    if (entry && sourcePath !== path && sourcePath !== configPath) assert.deepEqual(entry.after.row, [sourcePath, '100644', data.length, sha(data), blob(data)]);
    if (entry) { assert.deepEqual(entry.before, original ?? null); assert.equal(entry.operation, original ? 'modify' : 'add'); }
    else { assert(original, sourcePath); assert.equal(sha(data), original[3], sourcePath); }
  }
  assert.deepEqual(changed, manifest.changes.map(change => change.path));
  assert.equal(currentPaths.length, 687);
  assert.equal(manifest.changes.length, 54);
});

test('source faithful shared Example gap repair removes formatting only and preserves every original input', () => {
  const manifest = JSON.parse(readFileSync('diagnostics/alert-child-segmentation/source-authentication.json', 'utf8'));
  const path = 'apps/docs/registry/bases/base/ui/example/Example.svelte';
  const entry = manifest.changes.find(change => change.path === path);
  const repaired = readFileSync(path, 'utf8');
  const before = repaired.replace('{/if}<div data-slot="example-content"', '{/if}\n  <div data-slot="example-content"');
  assert.equal(repaired.split('{/if}<div data-slot="example-content"').length, 2);
  assert.equal(Buffer.byteLength(before), entry.before[2]);
  assert.equal(createHash('sha256').update(before).digest('hex'), entry.before[3]);
  assert.equal(createHash('sha1').update(`blob ${Buffer.byteLength(before)}\0`).update(before).digest('hex'), entry.before[4]);
});

test('eight inert icon control and HMR-body encodings preserve the complete helper and allow only literal-empty single-directive lint exceptions', () => {
  const manifest = JSON.parse(readFileSync('diagnostics/alert-child-segmentation/source-authentication.json', 'utf8'));
  const path = 'apps/docs/registry/bases/base/ui/icons/IconPlaceholder.svelte';
  const source = readFileSync(path, 'utf8');
  const ast = parseSvelte(source, { modern: true });
  const directives = [];
  const walk = node => { if (!node || typeof node !== 'object') return; if (node.type === 'HtmlTag') directives.push(node); for (const value of Object.values(node)) { if (Array.isArray(value)) value.forEach(walk); else if (value && typeof value === 'object') walk(value); } };
  walk(ast.fragment);
  assert.equal(directives.length, 8);
  for (const node of directives) {
    assert.equal(node.expression.type, 'Literal'); assert.equal(node.expression.value, ''); assert.equal(node.expression.raw, "''");
    assert.equal(source.slice(node.start, node.end), "{@html ''}");
  }
  const exception = '<!-- eslint-disable-next-line svelte/no-at-html-tags -->';
  assert.equal(source.split('eslint-disable').length - 1, 8);
  assert.equal(source.split(exception).length - 1, 8);
  let before = source;
  {
    const encoded = "    {@html ''}{#if available}\n      <!-- eslint-disable-next-line svelte/no-at-html-tags -->\n      {@html ''}<IconSvg data={available} {library} attributes={props} {children} bind:ref />\n    {/if}";
    assert.equal(before.split(encoded).length, 2);
    before = before.replace(encoded, "    {@html ''}{#if available}<IconSvg data={available} {library} attributes={props} {children} bind:ref />{/if}");
  }
  {
    const encoded = "      <!-- eslint-disable-next-line svelte/no-at-html-tags -->\n      {@html ''}<IconSvg data={fallback} library=\"fallback\" attributes={props} {children} bind:ref />";
    assert.equal(before.split(encoded).length, 2);
    before = before.replace(encoded, "      <IconSvg data={fallback} library=\"fallback\" attributes={props} {children} bind:ref />");
  }
  {
    const encoded = "      {@html ''}{#if data}\n        <!-- eslint-disable-next-line svelte/no-at-html-tags -->\n        {@html ''}<IconSvg {data} {library} attributes={props} {children} bind:ref />\n      {/if}";
    assert.equal(before.split(encoded).length, 2);
    before = before.replace(encoded, "      {@html ''}{#if data}<IconSvg {data} {library} attributes={props} {children} bind:ref />{/if}");
  }
  const historicalFive = before.replace("  // Pinned original d75a96ab icon children have no empty HTML text siblings.\n  // Svelte 5.57.1 standalone controls and HMR component bodies create Text anchors.\n  // Eight constant-empty HTML encodings retain comment-only template ownership,\n  // preserving every original condition/await and all loader/cache behavior.\n", "  // Pinned original d75a96ab icon children have no empty HTML text siblings.\n  // Svelte 5.57.1 standalone branch fragments create empty Text ownership anchors.\n  // Five constant-empty HTML encodings retain comment-only template ownership,\n  // preserving every original condition/await and all loader/cache behavior.\n");
  assert.equal(Buffer.byteLength(historicalFive), 1734);
  assert.equal(createHash('sha256').update(historicalFive).digest('hex'), 'b7e439d9bb4cdc2de5aab21d15a800723907b8562786b47d14deeca2c0ce0c5c');
  for (const [control, indent] of [['{#if name}', ''], ['{#if available !== undefined}', '  '], ['{#if available}', '    '], ['{#await pending}', '    '], ['{#if data}', '      ']]) {
    const encoding = `${indent}${exception}\n${indent}{@html ''}${control}`;
    assert.equal(source.split(encoding).length, 2);
    before = before.replace(encoding, `${indent}${control}`);
  }
  before = before.replace('  // Pinned original d75a96ab icon children have no empty HTML text siblings.\n  // Svelte 5.57.1 standalone controls and HMR component bodies create Text anchors.\n  // Eight constant-empty HTML encodings retain comment-only template ownership,\n  // preserving every original condition/await and all loader/cache behavior.\n', '');
  const entry = manifest.changes.find(change => change.path === path);
  assert.equal(Buffer.byteLength(before), entry.before[2]);
  assert.equal(createHash('sha256').update(before).digest('hex'), entry.before[3]);
  assert.equal(createHash('sha1').update(`blob ${Buffer.byteLength(before)}\0`).update(before).digest('hex'), entry.before[4]);
});

test('Empty theme readiness preserves the complete prior helper and all strict tree/measurement/action functions', () => {
  const witnessed = restoreEmptyBrowserContract('tests/browser/empty-gallery-cases.ts', readFileSync('tests/browser/empty-gallery-cases.ts', 'utf8'));
  const actionWitness = "  /* empty-action-witness:start */\n  const witness = JSON.stringify({ url: page.url(), records });\n  if (Buffer.byteLength(witness) > 4096) throw new Error('Empty trusted action witness exceeds 4096 bytes');\n  console.log('Empty trusted action witness:', witness);\n  /* empty-action-witness:end */\n";
  assert.equal(witnessed.split(actionWitness).length, 2);
  const source = witnessed.replace(actionWitness, '');
  const region = /\/\* empty-theme-readiness:start \*\/[\s\S]*?\/\* empty-theme-readiness:end \*\//gu;
  assert.equal([...source.matchAll(region)].length, 1);
  const restored = source.replace(region, 'export const emptyTheme = kbdTheme;');
  assert.equal(Buffer.byteLength(restored), 7528);
  assert.equal(createHash('sha256').update(restored).digest('hex'), '4fbe065430e8ef213ca5f3bea11439b22abda29b2d20ab45fa86e6a689101a65');
  const ast = ts.createSourceFile('empty-gallery-cases.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const expected = {"settledEmpty":"13ed9df08db6dd1b7da031ce51d5104ababa56c9ec63b012ab1ca03ee1548f2e","emptyTree":"65487a4e19622a09e657d74453c79fd15ed8eefa83b585919448762f4bb3ee2d","emptyMeasurements":"75257ba17d0ef8c29421bc2f5cb3639ea7226582b4c4d30fd6a8b2aef5206dec","assertEmptyGallery":"4e46772c9f2f3227a9c45fe13e91f8663b5d93c802bb6c35f31386d8d90f1ce7","emptyTrustedActions":"fcc07c9582269bb2e48a21ce45a63974c5e1af16858026547357407549d15f3d"};
  for (const [name, digest] of Object.entries(expected)) {
    const nodes = ast.statements.filter(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
    assert.equal(nodes.length, 1, name);
    assert.equal(createHash('sha256').update(nodes[0].getText(ast)).digest('hex'), digest, name);
  }
});

test('Empty paired action observation preserves both complete prior browser callers without weakening any expectation', () => {
  const observation = "/* empty-action-pair-witness:start */\n    const [actual] = await Promise.allSettled([emptyTrustedActions(page)]);\n    const [original] = await Promise.allSettled([emptyTrustedActions(reference)]);\n    if (actual.status === 'rejected') throw actual.reason;\n    if (original.status === 'rejected') throw original.reason;\n    expect(actual.value).toEqual(original.value);\n    /* empty-action-pair-witness:end */";
  const original = "expect(await emptyTrustedActions(page)).toEqual(await emptyTrustedActions(reference));";
  for (const [path, bytes, digest] of [
    ['tests/browser/empty.spec.ts', 9332, '7423079c682e3ef6bd0ac8784bf32bc35847ca616f5d684742d798d8498d5f17'],
    ['tests/installation/empty.spec.ts', 3409, '5cdb3bedffcf07921e55b76f7d809048fe69afe2c96f699ad7a79aea8efaa724'],
  ]) {
    const source = restoreEmptyBrowserContract(path, readFileSync(path, 'utf8'));
    assert.equal(source.split(observation).length, 2, path);
    const restored = source.replace(observation, original);
    assert.equal(Buffer.byteLength(restored), bytes, path);
    assert.equal(createHash('sha256').update(restored).digest('hex'), digest, path);
  }
});

function restoreEmptyBrowserContract(path, source) {
  const contracts = {"tests/browser/empty-gallery-cases.ts":{"bytes":11879,"sha256":"beb3c4399a2922df6690d6722a6f9278fdc3b56287fe56014c00e91acff60d60","edits":[["export async function emptyTrustedActions(page: Page) {\n","export async function emptyTrustedActions(page: Page, browserName: 'chromium' | 'firefox' | 'webkit') {\n  if (!['chromium', 'firefox', 'webkit'].includes(browserName)) throw new Error('Empty trusted actions require an actual chromium/firefox/webkit browserName');\n  const anchorDetail = { chromium: 0, firefox: 1, webkit: 0 }[browserName];\n"],["  const expectedAnchors = ['Create project', 'Learn more ', 'Learn more ', 'creating your first post', 'Create project', 'Learn more '].map(text => ({ tag: 'A', text, trusted: true, key: 0 }));\n","  const expectedAnchors = ['Create project', 'Learn more ', 'Learn more ', 'creating your first post', 'Create project', 'Learn more '].map(text => ({ tag: 'A', text, trusted: true, key: anchorDetail }));\n"]]},"tests/browser/empty.spec.ts":{"bytes":9654,"sha256":"aeb772ad36535f0f2b674f3ae7cbae1176cd5e9affa4fb5c5bb62140fe684134","edits":[["for (const library of emptyLibraries) test(`selected original Empty full composition and genuine ${library} glyphs match complete original CSS`, async ({ page, context }) => {\n","for (const library of emptyLibraries) test(`selected original Empty full composition and genuine ${library} glyphs match complete original CSS`, async ({ page, context, browserName }) => {\n"],["emptyTrustedActions(page)","emptyTrustedActions(page, browserName)"],["emptyTrustedActions(reference)","emptyTrustedActions(reference, browserName)"]]},"tests/installation/empty.spec.ts":{"bytes":3731,"sha256":"0d902b8a1b719297df7f86f5c08cd61ca3343f6acf3dd552e162e7a73e79185d","edits":[["for (const library of emptyLibraries) test(`fresh selected Empty gallery retains genuine ${library} glyphs, full tree and trusted actions`, async ({ page, context }) => {\n","for (const library of emptyLibraries) test(`fresh selected Empty gallery retains genuine ${library} glyphs, full tree and trusted actions`, async ({ page, context, browserName }) => {\n"],["emptyTrustedActions(page)","emptyTrustedActions(page, browserName)"],["emptyTrustedActions(reference)","emptyTrustedActions(reference, browserName)"]]}};
  const contract = contracts[path]; assert(contract, path);
  for (const [previous, current] of contract.edits) {
    assert.equal(source.split(current).length, 2, path);
    source = source.replace(current, previous);
  }
  assert.equal(Buffer.byteLength(source), contract.bytes, path);
  assert.equal(createHash('sha256').update(source).digest('hex'), contract.sha256, path);
  return source;
}

test('Empty strict browser action correction restores the complete df4a helper and both callers', () => {
  for (const path of ["tests/browser/empty-gallery-cases.ts","tests/browser/empty.spec.ts","tests/installation/empty.spec.ts"]) restoreEmptyBrowserContract(path, readFileSync(path, 'utf8'));
});

test('two-gallery integration reconstructs the full immutable UI0f4 source inventory and manifest', () => {
  const m = JSON.parse(readFileSync('diagnostics/alert-child-segmentation/source-authentication.json', 'utf8'));
  const p = m.previousCurrent;
  assert.equal(p.head, '0f4f421ad317c5bf85431a21c7c871bf1243200d');
  assert.equal(p.tree, 'a60b42e3d564568615f823e12629681165330f61');
  assert.equal(p.rowCount, 665); assert.equal(p.ledger.length, 23);
  const restored = new Map(m.baseline.rows.map(row => [row[0], row]));
  for (const r of p.replacements) restored.set(r.path, r.row);
  const bytes = JSON.stringify([...restored.values()].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  assert.equal(Buffer.byteLength(bytes), p.canonicalBytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), p.sha256);
  const old = JSON.stringify({ schemaVersion: m.schemaVersion, baseline: m.baseline, historical: m.historical, changes: p.ledger }) + '\n';
  assert.equal(Buffer.byteLength(old), p.manifestBytes);
  assert.equal(createHash('sha256').update(old).digest('hex'), '4f498a69413cbbf8d0962909c199348bcdaff6cde05d76d89f8ece9b45728ba8');
});
