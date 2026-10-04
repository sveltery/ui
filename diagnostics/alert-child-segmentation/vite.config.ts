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
const allowedChanges = new Set([...observationFiles, ...authoredFiles, '.github/workflows/ci.yml', 'docs/alert.md', 'docs/upstream-differences.md']);
function git(root: string, args: string[]) { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } }); }
function tree(root: string, ref: string) {
  return new Map(git(root, ['ls-tree', '-r', '-z', ref]).split('\0').filter(Boolean).map(row => {
    const [metadata, path] = row.split('\t');
    const [mode, type, blob] = metadata.split(' ');
    if (type !== 'blob') throw new Error(`Unsupported tracked type: ${path}`);
    return [path, { mode, blob }];
  }));
}

// Full-tree authentication runs only when explicitly called by a test.
export function protectedSourceSnapshot(root = repositoryRoot()) {
  const head = git(root, ['rev-parse', 'HEAD']).trim();
  const current = tree(root, head);
  const failures: string[] = [];
  // actions/checkout may be shallow: no runtime access to old Git objects.
  if (current.size !== 655 || authoredFiles.some(path => !current.has(path))) failures.push('Expected the 652 baseline paths plus exactly three authored diagnostic files');
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
    let reconstruction: { markerCount: number; bytes: number; sha256: string; matchesBaseline: boolean } | null = null;
    if (observationFiles.has(path)) {
      const text = bytes.toString('utf8');
      const starts = text.split('/* alert-observation:start */').length - 1;
      const ends = text.split('/* alert-observation:end */').length - 1;
      const stripped = text.replace(/\/\* alert-observation:start \*\/[\s\S]*?\/\* alert-observation:end \*\//g, '');
      const baseline = observationBaselines[path];
      reconstruction = { markerCount: starts, bytes: Buffer.byteLength(stripped), sha256: sha256(stripped), matchesBaseline: starts === ends && Buffer.byteLength(stripped) === baseline[0] && sha256(stripped) === baseline[1] };
      if (!reconstruction.matchesBaseline) failures.push(`Observation stripping does not reconstruct baseline: ${path}`);
    } else if (path === '.github/workflows/ci.yml') {
      const addition = bytes.subarray(4618);
      if (sha256(bytes.subarray(0, 4618)) !== '883939bcc5dc9ac15e0683efd6b2d3d9fe7958179a8bd80b255ab82642a72fe5' || addition.length !== 1036 || sha256(addition) !== 'c82a6a45e728be6832b537aa8af10de2da977fc33bf1a83f7d28f98b11b55666') failures.push('CI is not the exact authenticated 4618-byte baseline plus the exact 1036-byte two-step append');
    }
    return { path, mode: entry.mode, bytes: bytes.byteLength, sha256: sha256(bytes), headBlob: entry.blob, reconstruction };
  });
  const protectedRows = rows.filter(row => !allowedChanges.has(row.path)).map(row => [row.path, row.mode, row.sha256, row.bytes] as const).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  const protectedJSON = JSON.stringify(protectedRows);
  const protectedDigest = { rowCount: protectedRows.length, canonicalBytes: Buffer.byteLength(protectedJSON), sha256: sha256(protectedJSON), expected: { rowCount: 644, canonicalBytes: 81015, sha256: '15623068bcc8e670ff9185ba3009d7f07957bdb5148b7c7315cdce0f8a89f14d' } };
  if (protectedDigest.rowCount !== protectedDigest.expected.rowCount || protectedDigest.canonicalBytes !== protectedDigest.expected.canonicalBytes || protectedDigest.sha256 !== protectedDigest.expected.sha256) failures.push('Protected baseline file-set/path/mode/full-byte aggregate mismatch');
  const frozenArchive = rows.find(row => row.path === '.vendor/sveltery-base-0.0.0.tgz');
  if (frozenArchive?.sha256 !== '915dd6aebd304a7a9c384b0dd5eecd589722686897079fb6dec2961608c564fd') failures.push('Frozen Base archive identity mismatch');
  let transform: ReturnType<typeof authenticatedEdit>['record'] | null = null;
  let transformError: ReturnType<typeof errorRecord> | null = null;
  try { transform = authenticatedEdit(readFileSync(join(root, 'tests/reference/AlertGallery.tsx'), 'utf8')).record; }
  catch (error) { transformError = errorRecord(error); failures.push('Authentic single JSX edit/body guard failed'); }
  let baseLock: { commit?: string; sha256?: string } | null = null;
  let baseLockError: ReturnType<typeof errorRecord> | null = null;
  try { baseLock = JSON.parse(readFileSync(join(root, 'scripts/base.lock.json'), 'utf8')); }
  catch (error) { baseLockError = errorRecord(error); failures.push('Frozen Base lock unavailable'); }
  if (baseLock?.commit !== 'f884f3bb265485ef8e422e43a75eb3055db11fab' || baseLock?.sha256 !== frozenArchive?.sha256) failures.push('Frozen Base lock mismatch');
  const actualParents = git(root, ['cat-file', '-p', 'HEAD']).split('\n\n')[0].split('\n').filter(line => line.startsWith('parent ')).map(line => line.slice(7));
  return { ok: failures.length === 0, failures, actualHead: head, actualTree: git(root, ['rev-parse', 'HEAD^{tree}']).trim(), actualParents, baselineHead, allowedChangedPaths: [...allowedChanges], newTrackedPaths: authoredFiles, intendedHead, eventName, eventError, eventSHA: process.env.GITHUB_SHA ?? null, dirty, untracked, protectedDigest, rows, licenseRows: rows.filter(row => /license/i.test(row.path)), frozenArchive, baseLock, baseLockError, transform, transformError };
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
