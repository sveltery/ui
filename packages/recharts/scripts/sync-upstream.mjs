// Copies recharts' framework-free source and its React-free tests into src/ and test/, then applies patches/*.patch.
// Usage: node scripts/sync-upstream.mjs <recharts checkout at the pinned commit> [--check]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { COMMIT, EXTRACTED_VALUES, REPLACED, SPECS, TEST_SETUP, VENDORED } from './upstream.mjs';

const REACT_MODULES = new Set(['react', 'react-dom', 'react-is', 'react-redux']);
const SHIM = 'src/react.js';
const HAND_WRITTEN_INDEX = 'src/index.ts';

const [checkout, flag] = process.argv.slice(2);
if (!checkout) throw new Error('Pass the path of a recharts checkout.');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim();
if (!commit.startsWith(COMMIT)) throw new Error(`Expected recharts at ${COMMIT}, found ${commit}.`);

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');

const read = (path) => readFileSync(join(checkout, path), 'utf8');
const parse = (path, text) => ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

function resolveImport(from, specifier) {
  const base = posix.normalize(posix.join(posix.dirname(from), specifier));
  return [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((candidate) => existsSync(join(checkout, candidate)));
}

function moduleSpecifiers(file) {
  const found = [];
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) found.push(node.moduleSpecifier);
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) found.push(node.argument.literal);
    if (ts.isCallExpression(node) && node.arguments.length && ts.isStringLiteral(node.arguments[0])) {
      const callee = node.expression.getText(file);
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword || callee === 'vi.mock' || callee === 'vi.importActual') found.push(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

function containsJsx(file) {
  let found = false;
  const visit = (node) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) found = true;
    else ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

const isTypeDeclaration = (node) => ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node);

function isTypeOnlyModule(file) {
  return file.statements.every(
    (s) => ts.isImportDeclaration(s) || isTypeDeclaration(s) || (ts.isExportDeclaration(s) && (s.isTypeOnly || !s.moduleSpecifier)),
  );
}

function declaredNames(node) {
  if (ts.isVariableStatement(node)) return node.declarationList.declarations.flatMap((d) => (ts.isIdentifier(d.name) ? [d.name.text] : []));
  if (node.name && ts.isIdentifier(node.name)) return [node.name.text];
  return [];
}

function referencedIdentifiers(node) {
  const names = new Set();
  const visit = (child) => {
    if (ts.isIdentifier(child)) names.add(child.text);
    ts.forEachChild(child, visit);
  };
  visit(node);
  return names;
}

// Keeps a React-bound module's types and the named pure functions, with the declarations and imports they use.
function extract(path, text) {
  const file = parse(path, text);
  const keep = new Set(EXTRACTED_VALUES[path] ?? []);
  const declarations = file.statements.filter((s) => !ts.isImportDeclaration(s) && !ts.isExportDeclaration(s));
  const byName = new Map(declarations.flatMap((s) => declaredNames(s).map((name) => [name, s])));
  const kept = new Set(declarations.filter((s) => isTypeDeclaration(s) || declaredNames(s).some((name) => keep.has(name))));
  for (const name of keep) if (!byName.has(name)) throw new Error(`${path} has no declaration named ${name}.`);
  const queue = [...kept];
  while (queue.length) {
    for (const name of referencedIdentifiers(queue.pop())) {
      const declaration = byName.get(name);
      if (declaration && !kept.has(declaration)) {
        kept.add(declaration);
        queue.push(declaration);
      }
    }
  }
  const used = new Set([...kept].flatMap((s) => [...referencedIdentifiers(s)]));
  const parts = [];
  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause;
      if (!clause) continue;
      const source = statement.moduleSpecifier.getText(file);
      const typeOnly = clause.isTypeOnly ? 'type ' : '';
      const named = clause.namedBindings;
      if (named && ts.isNamespaceImport(named)) {
        if (used.has(named.name.text)) parts.push(`import ${typeOnly}* as ${named.name.text} from ${source};`);
        continue;
      }
      const specifiers = named ? named.elements.filter((e) => used.has(e.name.text)).map((e) => e.getText(file)) : [];
      const defaultName = clause.name && used.has(clause.name.text) ? clause.name.text : undefined;
      if (!specifiers.length && !defaultName) continue;
      const bindings = [defaultName, specifiers.length ? `{ ${specifiers.join(', ')} }` : undefined].filter(Boolean).join(', ');
      parts.push(`import ${typeOnly}${bindings} from ${source};`);
    } else if (ts.isExportDeclaration(statement)) {
      if (statement.isTypeOnly || !statement.moduleSpecifier) parts.push(statement.getFullText(file).trim());
    } else if (kept.has(statement)) {
      const text = statement.getFullText(file);
      const start = statement.getStart(file) - statement.getFullStart();
      const exported = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      // A name listed in EXTRACTED_VALUES is what a hand-written module imports, so it is exported even where upstream keeps it private.
      const exportIt = !exported && declaredNames(statement).some((name) => keep.has(name));
      parts.push((exportIt ? `${text.slice(0, start)}export ${text.slice(start)}` : text).replace(/^\s*\n/, ''));
    }
  }
  const body = parts.join('\n').trim();
  if (/^(import|export)\b/m.test(body)) return `${body}\n`;
  return body ? `${body}\n\nexport {};\n` : 'export {};\n';
}

function relativeSpecifier(from, to) {
  const specifier = posix.relative(posix.dirname(from), to);
  return specifier.startsWith('.') ? specifier : `./${specifier}`;
}

function rewriteSpecifiers(path, text) {
  const file = parse(path, text);
  const edits = [];
  for (const literal of moduleSpecifiers(file)) {
    const specifier = literal.text;
    let replacement;
    if (REACT_MODULES.has(specifier)) {
      replacement = relativeSpecifier(path, SHIM);
    } else if (specifier.startsWith('.')) {
      const target = resolveImport(path, specifier);
      if (target) replacement = relativeSpecifier(path, target.replace(/\.tsx?$/, '.js'));
    }
    if (replacement && replacement !== specifier) edits.push({ start: literal.getStart(file) + 1, end: literal.getEnd() - 1, replacement });
  }
  return edits.sort((a, b) => b.start - a.start).reduce((result, edit) => result.slice(0, edit.start) + edit.replacement + result.slice(edit.end), text);
}

const vendored = new Set(VENDORED.map((path) => `src/${path}`));
const outputs = new Map();
const replaced = new Set(REPLACED);
const queue = ['types.d.ts', ...vendored, ...Object.keys(EXTRACTED_VALUES), ...SPECS.map((path) => `test/${path}`), ...TEST_SETUP.map((path) => `test/${path}`)];
while (queue.length) {
  const path = queue.shift();
  const target = path.replace(/\.tsx$/, '.ts');
  if (outputs.has(target) || replaced.has(path)) continue;
  const text = read(path);
  const file = parse(path, text);
  const extracted = path.startsWith('src/') && !vendored.has(path) && !isTypeOnlyModule(file);
  if (path.endsWith('.tsx') && !extracted && containsJsx(file)) throw new Error(`${path} contains JSX.`);
  const content = extracted ? extract(path, text) : text;
  outputs.set(target, rewriteSpecifiers(path, content));
  for (const literal of moduleSpecifiers(parse(path, content))) {
    if (!literal.text.startsWith('.')) continue;
    const resolved = resolveImport(path, literal.text);
    if (!resolved) throw new Error(`${path} imports ${literal.text}, which does not resolve.`);
    if (resolved !== HAND_WRITTEN_INDEX && !outputs.has(resolved.replace(/\.tsx$/, '.ts'))) queue.push(resolved);
  }
}

const listPath = join(pkg, 'scripts/vendored.txt');
const previous = existsSync(listPath) ? readFileSync(listPath, 'utf8').split('\n').filter(Boolean) : [];
const current = [...outputs.keys()].sort();
const handWritten = current.filter((path) => !previous.includes(path) && existsSync(join(pkg, path)));
if (handWritten.length) throw new Error(`These generated paths would overwrite hand-written files: ${handWritten.join(', ')}.`);

if (flag === '--check') {
  const scratch = mkdtempSync(join(tmpdir(), 'recharts-sync-'));
  write(scratch);
  const stale = previous.filter((path) => !outputs.has(path));
  let clean = stale.length === 0;
  for (const path of stale) console.error(`${path} is listed in scripts/vendored.txt but is no longer vendored.`);
  for (const path of current) {
    try {
      execFileSync('diff', ['-u', join(pkg, path), join(scratch, path)], { stdio: 'inherit' });
    } catch {
      clean = false;
    }
  }
  rmSync(scratch, { recursive: true });
  if (!clean) process.exit(1);
  console.log(`${current.length} vendored files match recharts ${COMMIT} plus patches/.`);
} else {
  for (const path of previous) rmSync(join(pkg, path), { force: true });
  write(pkg);
  writeFileSync(listPath, `${current.join('\n')}\n`);
}

function write(dir) {
  for (const [path, text] of outputs) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
  const patches = join(pkg, 'patches');
  for (const patch of readdirSync(patches).filter((name) => name.endsWith('.patch')).sort()) {
    execFileSync('patch', ['--strip=1', '--forward', '--silent', `--directory=${dir}`, `--input=${join(patches, patch)}`], { stdio: 'inherit' });
  }
}
