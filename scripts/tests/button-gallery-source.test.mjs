// Authored independent source/AST checks; zero copied ordinary suite credit.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { parse } from 'svelte/compiler';
const rawPath = 'tests/reference/button-example.tsx';
const canonicalPath = 'apps/docs/examples/base/ButtonExample.svelte';
const manifestPath = 'tests/reference/button-gallery-sources.json';
const hash = b => createHash('sha256').update(b).digest('hex');
const names = ['ButtonVariantsAndSizes', 'ButtonIconRight', 'ButtonIconLeft', 'ButtonIconOnly', 'ButtonInvalidStates', 'ButtonExamples'];
function originalText(value) {
  const lines = value.split(/\r\n|\n|\r/u);
  let last = -1; lines.forEach((line, index) => { if (/[^ \t]/u.test(line)) last = index; });
  return lines.map((line, index) => {
    line = line.replaceAll('\t', ' ');
    if (index) line = line.replace(/^ +/u, '');
    if (index !== lines.length - 1) line = line.replace(/ +$/u, '');
    return line ? line + (index !== last ? ' ' : '') : '';
  }).join('');
}
const expression = e => {
  if (ts.isStringLiteral(e)) return e.text;
  if (ts.isCallExpression(e)) return { call: e.expression.getText(), args: e.arguments.map(expression) };
  throw new Error('Unexpected original gallery expression: ' + e.getText());
};
function originalNode(n) {
  if (ts.isJsxText(n)) return originalText(n.text);
  if (ts.isJsxExpression(n)) return expression(n.expression);
  const opening = ts.isJsxElement(n) ? n.openingElement : n;
  assert(ts.isJsxOpeningElement(opening) || ts.isJsxSelfClosingElement(opening));
  return { tag: opening.tagName.getText(), attrs: opening.attributes.properties.map(a => {
    assert(ts.isJsxAttribute(a)); const name = a.name.getText() === 'className' ? 'class' : a.name.getText();
    return [name, ts.isStringLiteral(a.initializer) ? a.initializer.text : expression(a.initializer.expression)];
  }), children: ts.isJsxElement(n) ? n.children.map(originalNode).filter(n => n !== '') : [] };
}
function localExpression(e) {
  if (e.type === 'Literal') { assert.equal(e.value, ' '); return e.value; }
  if (e.type === 'CallExpression') return { call: e.callee.name, args: e.arguments.map(localExpression) };
  throw new Error('Unexpected local expression ' + e.type);
}
function localNode(n) {
  if (n.type === 'Comment') { assert.equal(n.data.trim(), 'eslint-disable-next-line svelte/no-useless-mustaches -- Preserve the original explicit JSX space.'); return ''; }
  if (n.type === 'Text') return /^\s*$/u.test(n.data) ? '' : n.data;
  if (n.type === 'ExpressionTag') return localExpression(n.expression);
  if (n.type === 'RenderTag') { assert.equal(n.expression.type, 'CallExpression'); assert.equal(n.expression.callee.name, 'LiteralSpace'); assert.deepEqual(n.expression.arguments, []); return ' '; }
  assert(['Component', 'RegularElement'].includes(n.type), n.type);
  return { tag: n.name, attrs: n.attributes.map(a => {
    assert.equal(a.type, 'Attribute');
    if (Array.isArray(a.value)) assert.equal(a.value.length, 1);
    const v = Array.isArray(a.value) ? a.value[0] : a.value; return [a.name, v.type === 'Text' ? v.data : localExpression(v.expression)];
  }), children: n.fragment.nodes.map(localNode).filter(n => n !== '') };
}
test('six production snippet bodies preserve every original host/helper, ordered prop, variant, icon and literal child boundary', () => {
  const raw = readFileSync(rawPath, 'utf8');
  const original = ts.createSourceFile(rawPath, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(original.parseDiagnostics.length, 0);
  const local = parse(readFileSync(canonicalPath, 'utf8'), { modern: true });
  const snippets = local.fragment.nodes.filter(n => n.type === 'SnippetBlock');
  assert.deepEqual(snippets.map(n => n.expression.name), [...names.slice(0, 4), 'ButtonExamples', 'ButtonInvalidStates', 'LiteralSpace']);
  const space = snippets.find(n => n.expression.name === 'LiteralSpace');
  assert.deepEqual(space.parameters, []);
  assert.deepEqual(space.body.nodes.map(localNode).filter(n => n !== ''), [' ']);
  for (const name of names) {
    const declaration = original.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === name);
    const returned = declaration.body.statements.find(ts.isReturnStatement).expression;
    const body = ts.isParenthesizedExpression(returned) ? returned.expression : returned;
    assert.deepEqual(snippets.find(n => n.expression.name === name).body.nodes.map(localNode).filter(n => n !== ''), [originalNode(body)], name);
  }
  const wrapper = local.fragment.nodes.find(n => n.type === 'Component');
  assert.equal(wrapper.name, 'ExampleWrapper');
  assert.deepEqual(wrapper.attributes.map(a => [a.name, a.value[0].data]), [['class', 'lg:grid-cols-1 2xl:grid-cols-1']]);
  assert.deepEqual(wrapper.fragment.nodes.filter(n => n.type !== 'Text').map(n => { assert.equal(n.type, 'RenderTag'); return n.expression.callee.name; }), names);
  const canonical = readFileSync(canonicalPath, 'utf8');
  assert(!canonical.includes('data-testid'));
  let originalSpaces = 0;
  const countSpaces = node => { if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression) && node.expression.text === ' ') originalSpaces++; ts.forEachChild(node, countSpaces); };
  for (const declaration of original.statements.filter(n => ts.isFunctionDeclaration(n) && names.includes(n.name?.text))) countSpaces(declaration);
  assert.equal(originalSpaces, 48);
  assert.equal(canonical.match(/\{@render LiteralSpace\(\)\}/gu).length, originalSpaces);
  assert.equal(canonical.match(/\{" "\}/gu).length, 1);
  assert.equal(canonical.match(/eslint-disable-next-line svelte\/no-useless-mustaches/gu).length, 1);
  assert(!canonical.includes('eslint-disable '));
});
test('full immutable gallery, all original declarations, helpers, complete CSS, raw test inventory and supplemental probe retain provenance', () => {
  const m = JSON.parse(readFileSync(manifestPath, 'utf8')); assert.equal(m.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc'); assert.deepEqual(m.selected, names);
  for (const r of [m.original, ...m.originalFiles, m.legacyProbe]) {
    const b = readFileSync(r[0]); assert.equal(b.length, r[2]); assert.equal(hash(b), r[3]);
    assert.equal(createHash('sha1').update('blob ' + b.length + '\0').update(b).digest('hex'), r[4]);
  }
  const raw = readFileSync(rawPath, 'utf8');
  for (const r of m.declarations) {
    const body = raw.slice(raw.indexOf('function ' + r.name + '()')).split(/\nfunction /u)[0].trimEnd();
    assert.equal(Buffer.byteLength(body), r.bytes); assert.equal(hash(body), r.sha256);
  }
  const expected = raw.replace('from "@/registry/bases/base/components/example"', 'from "./example-scaffold"').replace('from "@/registry/bases/base/ui/button"', 'from "./button"').replace('from "@/app/(create)/components/icon-placeholder"', 'from "./icon"').replace('export default function ButtonExample()', 'export function OriginalButtonExample()') + '\nexport { ' + names.join(', ') + ' }\n';
  assert.equal(readFileSync('tests/reference/OriginalButtonExample.tsx', 'utf8'), expected);
  const inventory = JSON.parse(readFileSync('tests/reference/shadcn-test-inventory.json', 'utf8'));
  assert.equal(inventory.discovery.test_related_files, 139); assert.equal(inventory.discovery.test_sources, 133); assert.equal(inventory.discovery.snapshot_artifacts, 6);
  assert(inventory.current_wrapper_runtime_suite_absence.includes('Button'));
  assert(readFileSync('apps/docs/src/routes/button/+page.svelte', 'utf8').includes('../../../examples/base/ButtonProbe.svelte'));
  const delivery = readFileSync('scripts/check-installation.mjs', 'utf8');
  for (const s of ["'src/routes/button-gallery'", "'ButtonExample.svelte', 'ButtonGalleryFixture.svelte'", "['button', 'example', 'icons']"]) assert(delivery.includes(s));
});
test('six-body integration preserves complete pre-task UI676 tree, manifest and forty-path ledger byte exactly', () => {
  const m = JSON.parse(readFileSync('diagnostics/alert-child-segmentation/source-authentication.json', 'utf8'));
  const p = m.previousGallery;
  assert.equal(p.head, 'da66869098ee7fd26318431ab36251bbb6fc8d73'); assert.equal(p.tree, 'af3328f70ca47d7a77934682881cccf66057a5f3');
  assert.equal(p.rowCount, 676); assert.equal(p.ledger.length, 40);
  const rows = new Map(m.baseline.rows.map(r => [r[0], r])); for (const r of p.replacements) rows.set(r.path, r.row);
  const canonical = JSON.stringify([...rows.values()].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  assert.equal(Buffer.byteLength(canonical), 114212); assert.equal(hash(canonical), '0b76fddba983249d970723ed0c858acf46ad130e1c1fd8db82770a476509c241');
  const former = JSON.stringify({ schemaVersion: m.schemaVersion, baseline: m.baseline, historical: m.historical, changes: p.ledger, previousCurrent: m.previousCurrent }) + '\n';
  assert.equal(Buffer.byteLength(former), 150488); assert.equal(hash(former), '2ae74d98e7ebfb0280d664a39827d5250eb58ae952ead33d9c2304a6cbf9cd35');
});

test('gallery query boundary preserves genuine literal membership, default and first-value semantics', () => {
  const original = ts.createSourceFile(rawPath, readFileSync(rawPath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const choices = new Set();
  const visit = node => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (node.tagName.getText() === 'IconPlaceholder') for (const attr of node.attributes.properties) {
        if (ts.isJsxAttribute(attr) && !['className', 'data-icon'].includes(attr.name.getText())) choices.add(attr.name.getText());
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(original);
  const defaults = ts.createSourceFile('config.ts', readFileSync('tests/reference/icons/upstream/config.ts', 'utf8'), ts.ScriptTarget.Latest, true);
  const config = defaults.statements.flatMap(n => ts.isVariableStatement(n) ? [...n.declarationList.declarations] : []).find(n => n.name.getText() === 'DEFAULT_CONFIG').initializer;
  const fallback = config.properties.find(n => n.name.getText() === 'iconLibrary').initializer.text;
  assert.equal(fallback, 'lucide');
  const upstream = readFileSync('tests/reference/icons/upstream/search-params.ts', 'utf8');
  assert(upstream.includes('iconLibrary: parseAsStringLiteral<IconLibraryName>('));
  assert(upstream.includes('Object.values(iconLibraries).map((i) => i.name)\n  ).withDefault(DEFAULT_CONFIG.iconLibrary)'));
  const localConfig = ts.createSourceFile('config.ts', readFileSync('apps/docs/registry/bases/base/ui/icons/config.ts', 'utf8'), ts.ScriptTarget.Latest, true);
  const localChoices = localConfig.statements.flatMap(n => ts.isVariableStatement(n) ? [...n.declarationList.declarations] : []).find(n => n.name.getText() === 'iconLibraries').initializer.expression.elements.map(n => n.text);
  assert.deepEqual([...localChoices].sort(), [...choices].sort());
  const route = parse(readFileSync('apps/docs/src/routes/button-gallery/+page.svelte', 'utf8'), { modern: true });
  const selected = route.instance.content.body.flatMap(n => n.type === 'VariableDeclaration' ? n.declarations : []).find(n => n.id.name === 'library').init.arguments[0];
  const evaluate = (node, value) => {
    if (node.type === 'TSAsExpression') return evaluate(node.expression, value);
    if (node.type === 'Literal') return node.value;
    if (node.type === 'ConditionalExpression') return evaluate(node.test, value) ? evaluate(node.consequent, value) : evaluate(node.alternate, value);
    assert.equal(node.type, 'CallExpression');
    assert.equal(node.callee.type, 'MemberExpression');
    if (node.callee.property.name === 'get') {
      assert.equal(node.arguments[0].value, 'library');
      assert.equal(node.callee.object.property.name, 'searchParams');
      assert.equal(node.callee.object.object.property.name, 'url');
      assert.equal(node.callee.object.object.object.name, 'page');
      return value;
    }
    assert.equal(node.callee.property.name, 'includes'); assert.equal(node.callee.object.name, 'iconLibraries');
    return localChoices.includes(evaluate(node.arguments[0], value));
  };
  for (const value of [...choices, null, '', 'bogus', 'Lucide', ' lucide ']) {
    assert.equal(evaluate(selected, value), choices.has(value) ? value : fallback);
  }
  // URLSearchParams.get is the original loader's first-value boundary; browser/consumer cases exercise both orders.
  for (const [query, expected] of [['?library=bogus&library=tabler', fallback], ['?library=tabler&library=bogus', 'tabler']]) {
    assert.equal(evaluate(selected, new URL('https://original.test/' + query).searchParams.get('library')), expected);
  }
});
