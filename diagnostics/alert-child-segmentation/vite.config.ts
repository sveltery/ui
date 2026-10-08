// Authored diagnostic only; MIT notices remain in the genuine source graph.
// Importing this module never selects a server or starts source/run checks.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readlinkSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { defineConfig, mergeConfig, type Plugin, type UserConfig } from 'vite';
import referenceConfig from '../../tests/reference/themes/reference-app/vite.config';

export const baselineHead = '028c5ec0c409440a46d61ad8b4a69f0665a0b810';
export const upstreamPin = 'd75a96ab781f3d659be1ad287347d5887ce9f2fc';
export const prefix = 'This one has an icon and a description only. No title.';
const originalHash = 'ca281e089634d7f4a1ad47e7f354695b490c552f1043424d2ba787eacd6efcc4';
const bodyHashes = ['06232817198d3f9553279ec9fda846b7b35eeacaf1d72db3fb3af81292b370b1', 'e2731215c20a22c0c560b8823903eaf6d72cd2cd658114f56542ee4f4da364b8', '6e92ff01891e856e57973f00fcdb1b14d5a9cbb38f1daae6e8e2e5b33b71753e'];
export function repositoryRoot() { return fileURLToPath(new URL('../../', import.meta.url)); }
export function sha256(value: string | Uint8Array) { return createHash('sha256').update(value).digest('hex'); }
export function jsonHash(value: unknown) { return sha256(JSON.stringify(value)); }
function gitBlob(value: Uint8Array) { return createHash('sha1').update(`blob ${value.byteLength}\0`).update(value).digest('hex'); }
export function errorRecord(error: unknown) { return error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { message: String(error) }; }

export function authenticatedEdit(code: string) {
  if (Buffer.byteLength(code) !== 6512 || sha256(code) !== originalHash) throw new Error('Unknown genuine AlertGallery input bytes');
  const source = ts.createSourceFile('AlertGallery.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const bodies = ['AlertExample1', 'AlertExample2', 'AlertExample3'].map((name, index) => {
    const matches = source.statements.filter((node): node is ts.FunctionDeclaration => ts.isFunctionDeclaration(node) && node.name?.text === name);
    if (matches.length !== 1) throw new Error(`Expected exactly one ${name}`);
    const body = matches[0].getText(source);
    if (sha256(body) !== bodyHashes[index]) throw new Error(`Changed complete original ${name}`);
    return { name, bytes: Buffer.byteLength(body), sha256: sha256(body) };
  });
  const matches: { text: ts.JsxText; space: ts.JsxExpression }[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(source) === 'AlertDescription') {
      for (const [index, child] of node.children.entries()) {
        const next = node.children[index + 1];
        if (ts.isJsxText(child) && child.text === `\n            ${prefix}` && next && ts.isJsxExpression(next) && next.expression && ts.isStringLiteral(next.expression) && next.expression.text === ' ' && next.getText(source) === '{" "}') matches.push({ text: child, space: next });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (matches.length !== 1 || code.split(`${prefix}{" "}`).length !== 2) throw new Error('Expected exactly one authentic JSXText/space pair');
  const { text, space } = matches[0];
  let owner: ts.Node | undefined = text.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  if (!owner || !ts.isFunctionDeclaration(owner) || owner.name?.text !== 'AlertExample2') throw new Error('Unexpected JSX pair owner');
  const start = text.end - prefix.length;
  const end = space.end;
  const before = code.slice(start, end);
  const replacement = `{${JSON.stringify(`${prefix} `)}}`;
  if (before !== `${prefix}{" "}` || replacement !== '{"This one has an icon and a description only. No title. "}') throw new Error('Unexpected edit span or lost U+0020');
  const joined = code.slice(0, start) + replacement + code.slice(end);
  if (joined.slice(0, start) !== code.slice(0, start) || joined.slice(start + replacement.length) !== code.slice(end)) throw new Error('Unexpected bytes outside the single span');
  const parsedJoined = ts.createSourceFile('joined.tsx', joined, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let joinedChildren = 0;
  const checkJoined = (node: ts.Node) => {
    if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression) && node.expression.text === `${prefix} `) joinedChildren++;
    ts.forEachChild(node, checkJoined);
  };
  checkJoined(parsedJoined);
  if (joinedChildren !== 1 || joined.includes(before)) throw new Error('Unexpected joined AST topology');
  return { joined, record: { module: 'tests/reference/AlertGallery.tsx', originalBytes: 6512, originalSha256: originalHash, joinedBytes: Buffer.byteLength(joined), joinedSha256: sha256(joined), editCount: 1, start, end, before, replacement, finalCodePoint: 32, originalBodies: bodies, ast: { original: 'one JSXText followed by one literal U+0020 expression', joined: 'one full-prefix-plus-U+0020 string-expression child' } } };
}

const observationFiles = new Set(['tests/browser/alert-gallery-cases.ts', 'tests/browser/alert.spec.ts', 'tests/installation/alert.spec.ts', 'tests/browser/kbd-gallery-cases.ts', 'tests/browser/aspect-ratio-gallery-cases.ts']);
const observationBaselines: Record<string, [number, string]> = {
  'tests/browser/alert-gallery-cases.ts': [25020, '90db30c6835f3bd53b950ae618a7ee89e2b0a255a88aad3a6754c4a26a1a3a2e'],
  'tests/browser/alert.spec.ts': [23907, 'ce4753ad9f9515a147db448fa944e39df9f4faa7b85e03fdf9246c0cc3d4489d'],
  'tests/installation/alert.spec.ts': [15831, '689c6c46cdfe9e5cc78622b82a0edd186b20f5d0082282e8a2de142dd4f286d0'],
  'tests/browser/kbd-gallery-cases.ts': [9666, '2ca9492f5718a4fa1e6688f9141214d3dd52c91a12f0763e254933da3bc59ad2'],
  'tests/browser/aspect-ratio-gallery-cases.ts': [10136, '11ccbca8644cf0c7023197e358776552f3515da884f0cf5153e1e8b4c03034ef'],
};
const authoredFiles = ['diagnostics/alert-child-segmentation/vite.config.ts', 'diagnostics/alert-child-segmentation/playwright.config.ts', 'diagnostics/alert-child-segmentation/segmentation.spec.ts'];
const nativeGalleryPath = 'apps/docs/examples/base/AlertExample.svelte';
const nativeDeclaration = `  {#snippet alertDescriptionPrefix()}${prefix}{/snippet}\n`;
const nativeExpression = "{@render alertDescriptionPrefix()} ";
const viewportCallers: Record<string, [number, string]> = {
  'tests/browser/alert.spec.ts': [27851, 'a9b4f11a2de284d6fa3b06fd504c5cf50fae1bfbab40de309e5226ddea3f651a'],
  'tests/installation/alert.spec.ts': [19862, '476e9ffeaf4fce5b2c1d688fc2a19820ec8eeaed020a0172f427e4868e6eefe1'],
};
const parallelViewportSetup = "      const viewportResults = await Promise.allSettled([page, original].map(async current => { await current.setViewportSize({ width, height: 900 });  }));\n      const firstViewportFailure = viewportResults.find(result => result.status === 'rejected');\n      if (firstViewportFailure) {        throw firstViewportFailure.reason;\n      }\n      for (const current of [page, original]) { await alertTheme(current, style, dark); }\n";
const sequentialViewportSetup = '      for (const current of [page, original]) { await current.setViewportSize({ width, height: 900 }); await alertTheme(current, style, dark); }\n';
const historicalProtectedDigest = { rowCount: 644, canonicalBytes: 81015, sha256: '15623068bcc8e670ff9185ba3009d7f07957bdb5148b7c7315cdce0f8a89f14d' };
const allowedChanges = new Set([...observationFiles, ...authoredFiles, nativeGalleryPath, '.github/workflows/ci.yml', 'docs/alert.md', 'docs/upstream-differences.md']);

export function authenticatedNativeGallery(code: string) {
  const declarationCount = code.split(nativeDeclaration).length - 1;
  const expressionCount = code.split(nativeExpression).length - 1;
  const candidate = { bytes: Buffer.byteLength(code), sha256: sha256(code) };
  const candidateMatches = candidate.bytes === 5731 && candidate.sha256 === 'a904f98a492a26129f97716ef701056fef6e36946fa28a41c5642e48b58aaf9c';
  const ownerMatches = code.includes(`{#snippet AlertExample2()}\n${nativeDeclaration}`);
  const inverse = code.replace(nativeDeclaration, '').replace(nativeExpression, `${prefix} `);
  const baseline = { head: '38e3c8ef3a7f92073d5bb18c82c017d697e5ef58', bytes: 5649, sha256: 'bd9246b1f64fd3f64b795d972c3b243bf7edc050af7f1f344689ab69bd1aea41' };
  const inverseIdentity = { bytes: Buffer.byteLength(inverse), sha256: sha256(inverse) };
  const matchesBaseline = candidateMatches && ownerMatches && declarationCount === 1 && expressionCount === 1 && inverseIdentity.bytes === baseline.bytes && inverseIdentity.sha256 === baseline.sha256;
  return { matchesBaseline, candidate, candidateMatches, ownerMatches, declarationCount, expressionCount, declarationSha256: sha256(nativeDeclaration), expressionSha256: sha256(nativeExpression), inverse: inverseIdentity, baseline, limit: 'One private prefix snippet/render plus explicit U+0020; compiler comments are a framework translation, not serialization/timing parity.' };
}

export function authenticatedObservationSource(path: string, text: string) {
  const starts = text.split('/* alert-observation:start */').length - 1;
  const ends = text.split('/* alert-observation:end */').length - 1;
  let stripped = text.replace(/\/\* alert-observation:start \*\/[\s\S]*?\/\* alert-observation:end \*\//g, '');
  const caller = viewportCallers[path];
  let viewportSetup: { occurrenceCount: number; candidate: { bytes: number; sha256: string }; candidateMatches: boolean; parallelBytes: number; parallelSha256: string; sequentialBytes: number; sequentialSha256: string } | null = null;
  if (caller) {
    const candidate = { bytes: Buffer.byteLength(text), sha256: sha256(text) };
    const occurrenceCount = stripped.split(parallelViewportSetup).length - 1;
    viewportSetup = { occurrenceCount, candidate, candidateMatches: candidate.bytes === caller[0] && candidate.sha256 === caller[1], parallelBytes: Buffer.byteLength(parallelViewportSetup), parallelSha256: sha256(parallelViewportSetup), sequentialBytes: Buffer.byteLength(sequentialViewportSetup), sequentialSha256: sha256(sequentialViewportSetup) };
    if (occurrenceCount === 1) stripped = stripped.replace(parallelViewportSetup, sequentialViewportSetup);
  }
  const baseline = observationBaselines[path];
  const matchesBaseline = starts === ends && (!viewportSetup || viewportSetup.candidateMatches && viewportSetup.occurrenceCount === 1) && Buffer.byteLength(stripped) === baseline[0] && sha256(stripped) === baseline[1];
  return { markerCount: starts, bytes: Buffer.byteLength(stripped), sha256: sha256(stripped), matchesBaseline, viewportSetup };
}
function git(root: string, args: string[]) { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } }); }
function tree(root: string, ref: string) {
  return new Map(git(root, ['ls-tree', '-r', '-z', ref]).split('\0').filter(Boolean).map(row => {
    const [metadata, path] = row.split('\t');
    const [mode, type, blob] = metadata.split(' ');
    if (type !== 'blob') throw new Error(`Unsupported tracked type: ${path}`);
    return [path, { mode, blob }];
  }));
}

// Finite current-source integration. Historical rows are genuine immutable Git
// inventories; this pair establishes consistency only within actual HEAD and
// independently reviewed external baseline/final-source authority.
const sourceAuthenticationManifestSha256 = '66297d63fe3feea08fe82f7e5e9316a07f04ee61a643158a6a7a0378daea53fb';
const sourceAuthenticationPath = 'diagnostics/alert-child-segmentation/source-authentication.json';
const sourceConfigPath = 'diagnostics/alert-child-segmentation/vite.config.ts';
const sourceLedgerPaths = [
  '.github/workflows/ci.yml',
  'apps/docs/examples/base/ButtonExample.svelte',
  'apps/docs/examples/base/ButtonGalleryFixture.svelte',
  'apps/docs/examples/base/ButtonProbe.svelte',
  'apps/docs/examples/base/EmptyExample.svelte',
  'apps/docs/examples/base/EmptyGalleryFixture.svelte',
  'apps/docs/examples/base/TextareaExample.svelte',
  'apps/docs/examples/base/TextareaProbe.svelte',
  'apps/docs/registry/bases/base/ui/example/Example.svelte',
  'apps/docs/registry/bases/base/ui/icons/IconPlaceholder.svelte',
  'apps/docs/registry/styles/scoped/luma.css',
  'apps/docs/registry/styles/scoped/lyra.css',
  'apps/docs/registry/styles/scoped/maia.css',
  'apps/docs/registry/styles/scoped/mira.css',
  'apps/docs/registry/styles/scoped/nova.css',
  'apps/docs/registry/styles/scoped/rhea.css',
  'apps/docs/registry/styles/scoped/sera.css',
  'apps/docs/registry/styles/scoped/vega.css',
  'apps/docs/src/routes/+page.svelte',
  'apps/docs/src/routes/button-gallery/+page.svelte',
  'apps/docs/src/routes/button/+page.svelte',
  'apps/docs/src/routes/empty-reference/+page.server.ts',
  'apps/docs/src/routes/empty-reference/+page.svelte',
  'apps/docs/src/routes/empty/+page.svelte',
  'apps/docs/src/routes/textarea-gallery-reference/+page.server.ts',
  'apps/docs/src/routes/textarea-gallery-reference/+page.svelte',
  'apps/docs/src/routes/textarea-gallery/+page.svelte',
  'apps/docs/src/routes/textarea/+page.svelte',
  'diagnostics/alert-child-segmentation/source-authentication.json',
  'diagnostics/alert-child-segmentation/vite.config.ts',
  'docs/button.md',
  'docs/empty.md',
  'docs/readiness.md',
  'docs/shadcn-css.md',
  'docs/textarea.md',
  'docs/themes.md',
  'docs/upstream-differences.md',
  'scripts/check-button-gallery-ssr.mjs',
  'scripts/check-empty-ssr.mjs',
  'scripts/check-installation.mjs',
  'scripts/check-textarea-gallery-ssr.mjs',
  'scripts/installation-playwright.config.ts',
  'scripts/tests/button-gallery-source.test.mjs',
  'scripts/tests/empty-provenance.test.mjs',
  'scripts/tests/shadcn-css.test.mjs',
  'scripts/tests/textarea-provenance.test.mjs',
  'scripts/tests/themes-provenance.test.mjs',
  'scripts/theme-assets.mjs',
  'scripts/verify.sh',
  'tests/browser/button-gallery-cases.ts',
  'tests/browser/button-gallery.spec.ts',
  'tests/browser/empty-gallery-cases.ts',
  'tests/browser/empty.spec.ts',
  'tests/browser/textarea-gallery-cases.ts',
  'tests/browser/textarea-gallery.spec.ts',
  'tests/installation/button-gallery.spec.ts',
  'tests/installation/empty.spec.ts',
  'tests/installation/textarea-gallery.spec.ts',
  'tests/reference/OriginalButtonExample.tsx',
  'tests/reference/SelectedEmptyGallery.tsx',
  'tests/reference/SelectedTextareaGallery.tsx',
  'tests/reference/button-example.tsx',
  'tests/reference/button-gallery-sources.json',
  'tests/reference/empty-gallery-sources.json',
  'tests/reference/empty-selected-examples.tsx',
  'tests/reference/textarea-gallery-sources.json',
  'tests/reference/textarea-selected-examples.tsx',
  'tests/reference/themes/reference-app/main.tsx'
].sort();
type SourceRow = [path: string, mode: string, bytes: number, sha256: string, blob: string];
type SourceChange = { path: string; operation: 'add' | 'modify'; before: SourceRow | null; purpose: string; after: { kind: 'exact' | 'normalized-config'; row: SourceRow } | { kind: 'manifest-root'; mode: '100644'; binding: 'full-manifest-sha256-via-config-slot' } };
type HistoricalSource = { head: string; tree: string; rowCount: number; canonicalBytes: number; sha256: string; replacements: { path: string; row: SourceRow | null }[] };
type SourceManifest = { schemaVersion: number; baseline: { head: string; tree: string; rowCount: number; canonicalBytes: number; sha256: string; rows: SourceRow[] }; historical: HistoricalSource[]; changes: SourceChange[]; previousGallery: HistoricalSource & { ledger: SourceChange[]; manifestBytes: number; manifestSha256: string }; previousCurrent: { head: string; tree: string; rowCount: number; canonicalBytes: number; sha256: string; replacements: { path: string; row: SourceRow | null }[]; ledger: SourceChange[]; manifestBytes: number; manifestSha256: string } };
const sourceHistory = [
  { head: '028c5ec0c409440a46d61ad8b4a69f0665a0b810', tree: '4064cfd67b7d37bac66f784fe13a20a3b50d03c7', rowCount: 652, canonicalBytes: 109983, sha256: 'bb7f58e273634768867c7ae794b7dd3b1bffa0d06a6e934e418336813de3a443' },
  { head: '38e3c8ef3a7f92073d5bb18c82c017d697e5ef58', tree: 'aceb19860d531a715903770b9080546760b1b229', rowCount: 655, canonicalBytes: 110538, sha256: 'bbfb69daca1d641d5a51ed323de3de7b261d16896b8f3cbcefd4893e7ddc1952' },
];
function sortedSourceRows(rows: SourceRow[]) { return [...rows].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); }
function validSourcePath(path: string) { return typeof path === 'string' && !path.startsWith('/') && !path.includes('\\') && path.split('/').every(part => part !== '' && part !== '.' && part !== '..'); }
function sourceRowsMap(rows: SourceRow[]) {
  const map = new Map<string, SourceRow>();
  for (const row of rows) {
    if (!Array.isArray(row) || row.length !== 5 || !validSourcePath(row[0]) || !['100644', '100755', '120000'].includes(row[1]) || !Number.isSafeInteger(row[2]) || row[2] < 0 || !/^[a-f0-9]{64}$/.test(row[3]) || !/^[a-f0-9]{40}$/.test(row[4]) || map.has(row[0])) throw new Error('Invalid or duplicate complete source row');
    map.set(row[0], row);
  }
  if (JSON.stringify(rows) !== JSON.stringify(sortedSourceRows(rows))) throw new Error('Source rows are not in canonical path order');
  return map;
}
function sourceRowsIdentity(rows: SourceRow[]) { const bytes = JSON.stringify(sortedSourceRows(rows)); return { rowCount: rows.length, canonicalBytes: Buffer.byteLength(bytes), sha256: sha256(bytes) }; }
function historicalProjection(rows: SourceRow[], exclude: Set<string>) {
  const projected = sortedSourceRows(rows).filter(row => !exclude.has(row[0])).map(row => [row[0], row[1], row[3], row[2]]);
  const bytes = JSON.stringify(projected); return { rowCount: projected.length, canonicalBytes: Buffer.byteLength(bytes), sha256: sha256(bytes) };
}
export function normalizedSourceConfig(bytes: Uint8Array) {
  const code = Buffer.from(bytes).toString('utf8');
  if (!Buffer.from(code, 'utf8').equals(Buffer.from(bytes))) throw new Error('Source config is not exact valid UTF-8');
  const source = ts.createSourceFile(sourceConfigPath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const diagnostics = (source as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics;
  if (diagnostics.length) throw new Error('Source config has parse errors');
  const slots: ts.VariableDeclaration[] = [];
  const allSlots: ts.VariableDeclaration[] = [];
  const visit = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'sourceAuthenticationManifestSha256') allSlots.push(node); ts.forEachChild(node, visit); };
  visit(source);
  for (const statement of source.statements) if (ts.isVariableStatement(statement) && statement.declarationList.flags === ts.NodeFlags.Const && statement.declarationList.declarations.length === 1 && !statement.modifiers?.length) {
    for (const declaration of statement.declarationList.declarations) if (ts.isIdentifier(declaration.name) && declaration.name.text === 'sourceAuthenticationManifestSha256') slots.push(declaration);
  }
  if (slots.length !== 1 || allSlots.length !== 1) throw new Error('Expected one AST-owned top-level const manifest digest slot');
  const initializer = slots[0].initializer;
  if (!initializer || !ts.isStringLiteral(initializer)) throw new Error('Manifest digest slot is not a plain string literal');
  const raw = initializer.getText(source);
  if (!/^'[a-f0-9]{64}'$/.test(raw) || initializer.text !== sourceAuthenticationManifestSha256) throw new Error('Manifest digest slot is not one plain unescaped lowercase64hex token');
  if (code.split(raw).length !== 2) throw new Error('Duplicate manifest digest literal token');
  const start = initializer.getStart(source) + 1; const end = initializer.end - 1;
  // AST offsets are UTF-16 character offsets; independently translate the
  // prefix to its UTF-8 byte position and prove the exact64 ASCII byte span.
  const byteStart = Buffer.byteLength(code.slice(0, start), 'utf8'); const byteEnd = Buffer.byteLength(code.slice(0, end), 'utf8');
  if (end - start !== 64 || byteEnd - byteStart !== 64 || Buffer.from(bytes).subarray(byteStart, byteEnd).toString('ascii') !== initializer.text) throw new Error('Manifest digest AST/UTF-8 span mismatch');
  const normalized = Buffer.concat([Buffer.from(bytes).subarray(0, byteStart), Buffer.from('0'.repeat(64)), Buffer.from(bytes).subarray(byteEnd)]);
  if (normalized.length !== bytes.byteLength || !normalized.subarray(0, byteStart).equals(Buffer.from(bytes).subarray(0, byteStart)) || !normalized.subarray(byteEnd).equals(Buffer.from(bytes).subarray(byteEnd))) throw new Error('Normalization changed bytes outside the sole digest interior');
  return { normalized, physicalDigestLiteral: initializer.text, byteStart, byteEnd, normalizedBytes: normalized.length, normalizedSha256: sha256(normalized), normalizedGitBlob: gitBlob(normalized) };
}
function authenticatedCurrentSourceClosure(root: string, current: Map<string, { mode: string; blob: string }>, physicalRows: { path: string; mode: string; bytes: number; sha256: string; headBlob: string }[]) {
  const manifestBytes = readFileSync(join(root, sourceAuthenticationPath));
  if (sha256(manifestBytes) !== sourceAuthenticationManifestSha256) throw new Error('Physical source-authentication manifest digest mismatch');
  const manifest = JSON.parse(manifestBytes.toString('utf8')) as SourceManifest;
  if (manifest.schemaVersion !== 1) throw new Error('Unsupported source-authentication schema');
  const baseline = sourceRowsMap(manifest.baseline.rows);
  const expectedBaseline = { head: 'a4479987172bbda3a660e82f1a94b2f00f7e4df5', tree: '40494decf79fdd6b1dc22ae2eb5cbc043bb34cd5', rowCount: 655, canonicalBytes: 110538, sha256: 'c26e4c75341710d442aa5cdbdb9a3a482cc1f72892cdf05badc21a2df0e56941' };
  const declaredBaseline = { head: manifest.baseline.head, tree: manifest.baseline.tree, rowCount: manifest.baseline.rowCount, canonicalBytes: manifest.baseline.canonicalBytes, sha256: manifest.baseline.sha256 };
  if (JSON.stringify(declaredBaseline) !== JSON.stringify(expectedBaseline) || JSON.stringify(sourceRowsIdentity(manifest.baseline.rows)) !== JSON.stringify({ rowCount: expectedBaseline.rowCount, canonicalBytes: expectedBaseline.canonicalBytes, sha256: expectedBaseline.sha256 })) throw new Error('Complete immutable a447 baseline source identity mismatch');
  if (manifest.historical.length !== sourceHistory.length) throw new Error('Missing immutable historical source closure');
  const historicalClosures = manifest.historical.map((record, index) => {
    const { replacements, ...identity } = record;
    if (JSON.stringify(identity) !== JSON.stringify(sourceHistory[index])) throw new Error('Unexpected historical source authority');
    const restored = new Map(baseline); const seen = new Set<string>();
    for (const replacement of replacements) {
      if (!validSourcePath(replacement.path) || seen.has(replacement.path) || !baseline.has(replacement.path) || JSON.stringify(baseline.get(replacement.path)) === JSON.stringify(replacement.row)) throw new Error('Invalid, duplicate or unchanged historical replacement');
      seen.add(replacement.path);
      if (replacement.row === null) restored.delete(replacement.path);
      else { sourceRowsMap([replacement.row]); if (replacement.row[0] !== replacement.path) throw new Error('Historical replacement path mismatch'); restored.set(replacement.path, replacement.row); }
    }
    const rows = sortedSourceRows([...restored.values()]);
    if (JSON.stringify(sourceRowsIdentity(rows)) !== JSON.stringify({ rowCount: identity.rowCount, canonicalBytes: identity.canonicalBytes, sha256: identity.sha256 })) throw new Error('Complete reconstructed historical source mismatch');
    const exclusions = new Set([...observationFiles, '.github/workflows/ci.yml', 'docs/alert.md', 'docs/upstream-differences.md', ...(index === 1 ? authoredFiles : [])]);
    const projection = historicalProjection(rows, exclusions);
    if (JSON.stringify(projection) !== JSON.stringify(historicalProtectedDigest)) throw new Error('Immutable historical644 aggregate mismatch');
    return { ...identity, replacements, protectedDigest: projection, scope: 'historical complete reconstruction; not current source' };
  });
  // Complete immutable pre-repair UI0f4 source and full former manifest/ledger.
  if (sha256(JSON.stringify(manifest.previousCurrent)) !== '675f22af7a7f90ed29a3bd9df1a83ca13e536580505f6a44cb30a2a00c7cbf44') throw new Error('Previous complete UI0f4 source/ledger record changed');
  const prior = new Map(baseline);
  for (const replacement of manifest.previousCurrent.replacements) {
    if (!replacement.row || replacement.path !== replacement.row[0]) throw new Error('Invalid previous complete-source replacement');
    sourceRowsMap([replacement.row]); prior.set(replacement.path, replacement.row);
  }
  if (JSON.stringify(sourceRowsIdentity([...prior.values()])) !== JSON.stringify({ rowCount: manifest.previousCurrent.rowCount, canonicalBytes: manifest.previousCurrent.canonicalBytes, sha256: manifest.previousCurrent.sha256 })) throw new Error('Previous complete UI0f4 source reconstruction failed');
  const previousManifest = JSON.stringify({ schemaVersion: manifest.schemaVersion, baseline: manifest.baseline, historical: manifest.historical, changes: manifest.previousCurrent.ledger }) + '\n';
  if (Buffer.byteLength(previousManifest) !== manifest.previousCurrent.manifestBytes || sha256(previousManifest) !== manifest.previousCurrent.manifestSha256) throw new Error('Previous byte-exact full source manifest/ledger reconstruction failed');
  // Byte-exact previous UI676 source, forty-change ledger and manifest authority.
  const previousGallery = new Map(baseline);
  for (const replacement of manifest.previousGallery.replacements) {
    if (!replacement.row || replacement.path !== replacement.row[0]) throw new Error('Invalid previous UI676 replacement');
    sourceRowsMap([replacement.row]); previousGallery.set(replacement.path, replacement.row);
  }
  if (JSON.stringify(sourceRowsIdentity([...previousGallery.values()])) !== JSON.stringify({ rowCount: 676, canonicalBytes: 114212, sha256: '0b76fddba983249d970723ed0c858acf46ad130e1c1fd8db82770a476509c241' })) throw new Error('Previous UI676 full source reconstruction failed');
  const previousGalleryManifest = JSON.stringify({ schemaVersion: manifest.schemaVersion, baseline: manifest.baseline, historical: manifest.historical, changes: manifest.previousGallery.ledger, previousCurrent: manifest.previousCurrent }) + '\n';
  if (manifest.previousGallery.head !== 'da66869098ee7fd26318431ab36251bbb6fc8d73' || manifest.previousGallery.tree !== 'af3328f70ca47d7a77934682881cccf66057a5f3' || manifest.previousGallery.rowCount !== 676 || manifest.previousGallery.canonicalBytes !== 114212 || manifest.previousGallery.sha256 !== '0b76fddba983249d970723ed0c858acf46ad130e1c1fd8db82770a476509c241' || manifest.previousGallery.ledger.length !== 40 || manifest.previousGallery.manifestBytes !== 150488 || manifest.previousGallery.manifestSha256 !== '2ae74d98e7ebfb0280d664a39827d5250eb58ae952ead33d9c2304a6cbf9cd35' || Buffer.byteLength(previousGalleryManifest) !== 150488 || sha256(previousGalleryManifest) !== '2ae74d98e7ebfb0280d664a39827d5250eb58ae952ead33d9c2304a6cbf9cd35') throw new Error('Previous byte-exact UI676 manifest/ledger authority changed');
  const oldProtected = historicalProjection(manifest.baseline.rows, allowedChanges);
  const expectedProtected = { rowCount: 643, canonicalBytes: 80886, sha256: '37f43888ce646b768081acfa425156a8197f92ed587740574cb3138c87dcc257' };
  if (JSON.stringify(oldProtected) !== JSON.stringify(expectedProtected)) throw new Error('Immutable a447 historical643 aggregate mismatch');
  if (JSON.stringify(manifest.changes.map(change => change.path)) !== JSON.stringify(sourceLedgerPaths)) throw new Error('Explicit source ledger path domain mismatch');
  const normalized = normalizedSourceConfig(readFileSync(join(root, sourceConfigPath)));
  const physical = new Map(physicalRows.map(row => [row.path, [row.path, row.mode, row.bytes, row.sha256, row.headBlob] as SourceRow]));
  const expected = new Map(baseline);
  for (const change of manifest.changes) {
    if (!validSourcePath(change.path) || typeof change.purpose !== 'string' || !change.purpose || JSON.stringify(change.before) !== JSON.stringify(baseline.get(change.path) ?? null) || change.operation !== (baseline.has(change.path) ? 'modify' : 'add')) throw new Error('Explicit source ledger preimage/operation mismatch');
    const row = physical.get(change.path); if (!row || row[1] !== '100644') throw new Error('Missing or nonregular current ledger source');
    if (change.path === sourceAuthenticationPath) {
      if (JSON.stringify(change.after) !== JSON.stringify({ kind: 'manifest-root', mode: '100644', binding: 'full-manifest-sha256-via-config-slot' }) || row[2] !== manifestBytes.length || row[3] !== sourceAuthenticationManifestSha256) throw new Error('Full physical manifest root binding mismatch');
    } else if (change.path === sourceConfigPath) {
      const normalizedRow: SourceRow = [sourceConfigPath, '100644', normalized.normalizedBytes, normalized.normalizedSha256, normalized.normalizedGitBlob];
      if (change.after.kind !== 'normalized-config' || JSON.stringify(change.after.row) !== JSON.stringify(normalizedRow)) throw new Error('Complete normalized config ledger binding mismatch');
    } else {
      if (change.after.kind !== 'exact') throw new Error('Ordinary source must have exact physical after-row');
      sourceRowsMap([change.after.row]);
      if (JSON.stringify(row) !== JSON.stringify(change.after.row)) throw new Error(`Exact new-head ledger source mismatch: ${change.path}`);
    }
    if (JSON.stringify(row) === JSON.stringify(change.before)) throw new Error('Stale unchanged source ledger entry');
    expected.set(change.path, row);
  }
  const expectedRows = sortedSourceRows([...expected.values()]); const actualRows = sortedSourceRows([...physical.values()]);
  if (current.size !== 687 || JSON.stringify(actualRows) !== JSON.stringify(expectedRows) || current.size !== expected.size || authoredFiles.some(path => !current.has(path))) throw new Error('Complete bidirectional new-head source domain/byte/mode/blob closure mismatch');
  const exactChanges = actualRows.filter(row => JSON.stringify(row) !== JSON.stringify(baseline.get(row[0]))).map(row => row[0]);
  if (JSON.stringify(exactChanges) !== JSON.stringify(sourceLedgerPaths)) throw new Error('Actual baseline-to-current delta does not equal explicit ledger');
  return { ok: true, baseline: expectedBaseline, historicalClosures, historicalA447ProtectedDigest: { ...oldProtected, expected: expectedProtected, scope: 'historical a447 reconstruction; not current source' }, currentCompleteIdentity: sourceRowsIdentity(actualRows), ledger: manifest.changes, exactChangedPaths: exactChanges, actualPhysicalManifest: { path: sourceAuthenticationPath, bytes: manifestBytes.length, sha256: sha256(manifestBytes), gitBlob: gitBlob(manifestBytes) }, configBinding: { path: sourceConfigPath, physicalGitBlob: current.get(sourceConfigPath)!.blob, normalizedBytes: normalized.normalizedBytes, normalizedSha256: normalized.normalizedSha256, normalizedGitBlob: normalized.normalizedGitBlob, physicalDigestLiteral: normalized.physicalDigestLiteral, byteStart: normalized.byteStart, byteEnd: normalized.byteEnd }, limit: 'Finite consistency within actual Git/event HEAD; independently authenticated external historical/final source review remains mandatory.' };
}

// Full-tree authentication runs only when explicitly called by a test.
function authenticatedWorkflowSource(bytes: Uint8Array) {
  const candidate = Buffer.from(bytes);
  const text = candidate.toString('utf8');
  const before = '    timeout-minutes: 75\n';
  const after = "    timeout-minutes: ${{ matrix.engine == 'webkit' && 90 || 75 }}\n";
  const occurrenceCount = text.split(after).length - 1;
  const inverse = Buffer.from(text.replace(after, before));
  const baseline = inverse.subarray(0, 4618);
  const addition = inverse.subarray(4618);
  const candidateMatches = candidate.length === 5696 && sha256(candidate) === 'fdcf098808e6572ac95ad46955d0159d33310bceaa72078b401d82a8642c2f15';
  const matchesBaseline = candidateMatches && occurrenceCount === 1 &&
    inverse.length === 5654 && sha256(inverse) === '28eaa4a2c7565bba9e1b09164d2087b70ccde436215d1258967eab9cb87c90b2' &&
    baseline.length === 4618 && sha256(baseline) === '883939bcc5dc9ac15e0683efd6b2d3d9fe7958179a8bd80b255ab82642a72fe5' &&
    addition.length === 1036 && sha256(addition) === 'c82a6a45e728be6832b537aa8af10de2da977fc33bf1a83f7d28f98b11b55666';
  return { candidateBytes: candidate.length, candidateSha256: sha256(candidate), occurrenceCount, inverseBytes: inverse.length, inverseSha256: sha256(inverse), candidateMatches, matchesBaseline };
}

export function protectedSourceSnapshot(root = repositoryRoot()) {
  const head = git(root, ['rev-parse', 'HEAD']).trim();
  const current = tree(root, head);
  const failures: string[] = [];
  // actions/checkout may be shallow: no runtime access to old Git objects.
  if (authoredFiles.some(path => !current.has(path))) failures.push('Missing original authored diagnostic sources');
  const dirty = git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=no']);
  if (dirty) failures.push('Tracked checkout is not clean');
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  if (untracked.length) failures.push('Nonignored untracked inputs could shadow the genuine import graph');
  let event: { pull_request?: { head?: { sha?: string } }; after?: string } | null = null;
  let eventError: ReturnType<typeof errorRecord> | null = null;
  try { event = process.env.GITHUB_EVENT_PATH ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : null; }
  catch (error) { eventError = errorRecord(error); failures.push('Actual CI event JSON unavailable'); }
  const eventName = process.env.GITHUB_EVENT_NAME ?? null;
  const intendedHead: string | null = eventName === 'pull_request' ? event?.pull_request?.head?.sha ?? null : eventName === 'push' ? event?.after ?? process.env.GITHUB_SHA ?? null : null;
  if (eventName === 'pull_request' && !intendedHead) failures.push('Actual pull-request event head identity unavailable');
  if (intendedHead && intendedHead !== head) failures.push('Actual HEAD differs from the actual event PR head/push head');
  const rows = [...current].map(([path, entry]) => {
    const absolute = resolve(root, path);
    const stat = lstatSync(absolute);
    const bytes = entry.mode === '120000' ? Buffer.from(readlinkSync(absolute)) : readFileSync(absolute);
    if (entry.mode !== '120000' && (!stat.isFile() || stat.isSymbolicLink())) failures.push(`Nonregular tracked source: ${path}`);
    if (gitBlob(bytes) !== entry.blob) failures.push(`Working bytes differ from actual head: ${path}`);
    if (allowedChanges.has(path) && entry.mode !== '100644') failures.push(`Changed authored/observation/document/workflow source mode: ${path}`);
    let reconstruction: ReturnType<typeof authenticatedObservationSource> | null = null;
    let nativeReconstruction: ReturnType<typeof authenticatedNativeGallery> | null = null;
    if (observationFiles.has(path)) {
      reconstruction = authenticatedObservationSource(path, bytes.toString('utf8'));
      if (!reconstruction.matchesBaseline) failures.push(`Narrow observation/setup inverse does not reconstruct baseline: ${path}`);
    } else if (path === nativeGalleryPath) {
      nativeReconstruction = authenticatedNativeGallery(bytes.toString('utf8'));
      if (!nativeReconstruction.matchesBaseline) failures.push('Native gallery is not the exact approved child-boundary translation/inverse');
    } else if (path === '.github/workflows/ci.yml') {
      const workflowReconstruction = authenticatedWorkflowSource(bytes);
      if (!workflowReconstruction.matchesBaseline) failures.push('CI is not the exact authenticated 4618-byte baseline plus the exact 1036-byte two-step append');
    }
    return { path, mode: entry.mode, bytes: bytes.byteLength, sha256: sha256(bytes), headBlob: entry.blob, reconstruction, nativeReconstruction };
  });
  let currentSourceClosure: ReturnType<typeof authenticatedCurrentSourceClosure> | null = null;
  let currentSourceClosureError: ReturnType<typeof errorRecord> | null = null;
  try { currentSourceClosure = authenticatedCurrentSourceClosure(root, current, rows); }
  catch (error) { currentSourceClosureError = errorRecord(error); failures.push('Finite complete historical/current source closure failed'); }
  const protectedDigest = currentSourceClosure?.historicalA447ProtectedDigest ?? null;
  const frozenArchive = rows.find(row => row.path === '.vendor/sveltery-base-0.0.0.tgz');
  if (frozenArchive?.sha256 !== '55c402730dd10e739bf1d61418b3fae2573bc5c0dabd4c2d0e98e669c91d891c') failures.push('Frozen Base archive identity mismatch');
  let transform: ReturnType<typeof authenticatedEdit>['record'] | null = null;
  let transformError: ReturnType<typeof errorRecord> | null = null;
  try { transform = authenticatedEdit(readFileSync(join(root, 'tests/reference/AlertGallery.tsx'), 'utf8')).record; }
  catch (error) { transformError = errorRecord(error); failures.push('Authentic single JSX edit/body guard failed'); }
  let baseLock: { commit?: string; sha256?: string } | null = null;
  let baseLockError: ReturnType<typeof errorRecord> | null = null;
  try { baseLock = JSON.parse(readFileSync(join(root, 'scripts/base.lock.json'), 'utf8')); }
  catch (error) { baseLockError = errorRecord(error); failures.push('Frozen Base lock unavailable'); }
  if (baseLock?.commit !== '44846f6d416225c6b6cc0dfd4465a2f7d8a3f277' || baseLock?.sha256 !== frozenArchive?.sha256) failures.push('Frozen Base lock mismatch');
  const actualParents = git(root, ['cat-file', '-p', 'HEAD']).split('\n\n')[0].split('\n').filter(line => line.startsWith('parent ')).map(line => line.slice(7));
  return { ok: failures.length === 0, failures, actualHead: head, actualTree: git(root, ['rev-parse', 'HEAD^{tree}']).trim(), actualParents, baselineHead, allowedChangedPaths: [...allowedChanges], newTrackedPaths: authoredFiles, intendedHead, eventName, eventError, eventSHA: process.env.GITHUB_SHA ?? null, dirty, untracked, historicalProtectedDigest, protectedDigest, currentSourceClosure, currentSourceClosureError, rows, licenseRows: rows.filter(row => /license/i.test(row.path)), frozenArchive, baseLock, baseLockError, transform, transformError };
}

export function installedRuntime(root = repositoryRoot()) {
  const require = createRequire(join(root, 'package.json'));
  const workspace = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const packages = Object.entries(workspace.devDependencies as Record<string, string>).map(([name, requested]) => {
    try {
      let manifest: string;
      try { manifest = require.resolve(`${name}/package.json`); }
      catch { manifest = join(root, 'node_modules', name, 'package.json'); }
      const bytes = readFileSync(manifest);
      const pkg = JSON.parse(bytes.toString('utf8'));
      if (pkg.name !== name || (!requested.startsWith('file:') && pkg.version !== requested)) throw new Error(`Installed package name/version mismatch for ${name}`);
      const licenses = readdirSync(dirname(manifest)).filter(path => /^(license|copying|notice)(\.|$)/i.test(path)).map(path => { const data = readFileSync(join(dirname(manifest), path)); return { path, bytes: data.length, sha256: sha256(data) }; });
      return { name, requested, version: pkg.version, license: pkg.license ?? null, manifest, manifestBytes: bytes.length, manifestSha256: sha256(bytes), licenses };
    } catch (error) { return { name, requested, unavailable: errorRecord(error) }; }
  });
  const failures = packages.filter(row => 'unavailable' in row).map(row => `Unavailable or mismatched installed package: ${row.name}`);
  let installedShadcnCSS: { path: string; bytes: number; sha256: string } | null = null;
  let supportError: ReturnType<typeof errorRecord> | null = null;
  try {
    const path = require.resolve('shadcn/tailwind.css'); const support = readFileSync(path);
    installedShadcnCSS = { path, bytes: support.length, sha256: sha256(support) };
    if (installedShadcnCSS.sha256 !== '4c371f7a1ff5d219ae2f7ff28bd256b4346fd546fe46fbae22092e57db2f0fae') failures.push('Installed genuine shadcn support CSS mismatch');
  } catch (error) { supportError = errorRecord(error); failures.push('Installed genuine shadcn support CSS unavailable'); }
  return { ok: failures.length === 0, failures, node: process.version, packageManager: workspace.packageManager, packages, installedShadcnCSS, supportError };
}

export default defineConfig(({ command, mode }) => {
  // The selector is read only in this explicit isolated server factory.
  const variant = process.env.SVELTERY_ALERT_SEGMENTATION_VARIANT;
  if (command !== 'serve' || mode !== 'development' || (variant !== 'split' && variant !== 'joined')) throw new Error('Use explicit split/joined development servers only');
  const root = repositoryRoot();
  const target = resolve(root, 'tests/reference/AlertGallery.tsx');
  const plugin: Plugin = {
    name: 'authored-isolated-original-react-child-segmentation', enforce: 'pre',
    transform(code, id) {
      const module = id.split('?')[0];
      if (module !== target) {
        if (module.replace(/\\/g, '/').endsWith('/AlertGallery.tsx')) throw new Error(`Unexpected AlertGallery module identity: ${id}`);
        return null;
      }
      if (id !== target) throw new Error(`Unexpected AlertGallery module query: ${id}`);
      const edit = authenticatedEdit(code);
      return variant === 'joined' ? { code: edit.joined, map: null } : null;
    },
  };
  return mergeConfig(referenceConfig as UserConfig, {
    cacheDir: resolve(root, `.checks/alert-child-segmentation-vite-${variant}`),
    plugins: [plugin], server: { host: '127.0.0.1', port: variant === 'split' ? 5176 : 5177, strictPort: true },
  });
});
