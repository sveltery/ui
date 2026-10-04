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
  assert.equal(currentPaths.length, 665);
  assert.equal(manifest.changes.length, 23);
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

test('five inert icon control encodings preserve the complete helper and allow only literal-empty single-directive lint exceptions', () => {
  const manifest = JSON.parse(readFileSync('diagnostics/alert-child-segmentation/source-authentication.json', 'utf8'));
  const path = 'apps/docs/registry/bases/base/ui/icons/IconPlaceholder.svelte';
  const source = readFileSync(path, 'utf8');
  const ast = parseSvelte(source, { modern: true });
  const directives = [];
  const walk = node => { if (!node || typeof node !== 'object') return; if (node.type === 'HtmlTag') directives.push(node); for (const value of Object.values(node)) { if (Array.isArray(value)) value.forEach(walk); else if (value && typeof value === 'object') walk(value); } };
  walk(ast.fragment);
  assert.equal(directives.length, 5);
  for (const node of directives) {
    assert.equal(node.expression.type, 'Literal'); assert.equal(node.expression.value, ''); assert.equal(node.expression.raw, "''");
    assert.equal(source.slice(node.start, node.end), "{@html ''}");
  }
  const exception = '<!-- eslint-disable-next-line svelte/no-at-html-tags -->';
  assert.equal(source.split('eslint-disable').length - 1, 5);
  assert.equal(source.split(exception).length - 1, 5);
  let before = source;
  for (const [control, indent] of [['{#if name}', ''], ['{#if available !== undefined}', '  '], ['{#if available}', '    '], ['{#await pending}', '    '], ['{#if data}', '      ']]) {
    const encoding = `${indent}${exception}\n${indent}{@html ''}${control}`;
    assert.equal(source.split(encoding).length, 2);
    before = before.replace(encoding, `${indent}${control}`);
  }
  before = before.replace('  // Pinned original d75a96ab icon children have no empty HTML text siblings.\n  // Svelte 5.57.1 standalone branch fragments create empty Text ownership anchors.\n  // Five constant-empty HTML encodings retain comment-only template ownership,\n  // preserving every original condition/await and all loader/cache behavior.\n', '');
  const entry = manifest.changes.find(change => change.path === path);
  assert.equal(Buffer.byteLength(before), entry.before[2]);
  assert.equal(createHash('sha256').update(before).digest('hex'), entry.before[3]);
  assert.equal(createHash('sha1').update(`blob ${Buffer.byteLength(before)}\0`).update(before).digest('hex'), entry.before[4]);
});
