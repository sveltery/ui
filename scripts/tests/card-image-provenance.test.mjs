// Authored original-source comparisons, not copied ordinary shadcn runtime tests.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { parse } from 'svelte/compiler';

export function cardImageSource(native, original, selected) {
  const names = ['CardWithImage', 'CardWithImageSmall'];
  const source = ts.createSourceFile('original.tsx', original, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const copy = ts.createSourceFile('selected.tsx', selected, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(source.parseDiagnostics.length, 0); assert.equal(copy.parseDiagnostics.length, 0);
  const functions = source.statements.filter(ts.isFunctionDeclaration);
  const declared = copy.statements.filter(ts.isFunctionDeclaration);
  assert.deepEqual(declared.map(node => node.name.text), names);
  const body = name => functions.find(node => node.name?.text === name);
  for (const node of declared) assert.equal(node.getText(copy).replace(/^export /u, ''), body(node.name.text).getText(source));
  function reactText(raw) {
    const lines = raw.replace(/\r/gu, '').split('\n'); let last = 0;
    for (let i = 0; i < lines.length; i++) if (/[^ \t]/u.test(lines[i])) last = i;
    return lines.map((line, i) => {
      let value = line.replace(/\t/gu, ' ');
      if (i) value = value.replace(/^ +/u, '');
      if (i !== lines.length - 1) value = value.replace(/ +$/u, '');
      return value ? value + (i !== last ? ' ' : '') : '';
    }).join('');
  }
  function reactNode(node) {
    if (ts.isJsxText(node)) return reactText(node.text) || null;
    const opening = ts.isJsxElement(node) ? node.openingElement : node;
    assert(ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node), 'no replaced original branch');
    const attrs = opening.attributes.properties.map(attr => {
      assert(ts.isJsxAttribute(attr) && attr.initializer && ts.isStringLiteral(attr.initializer), 'original finite literal props');
      return [attr.name.text === 'className' ? 'class' : attr.name.text, attr.initializer.text];
    });
    return { name: opening.tagName.getText(source), attrs, children: ts.isJsxElement(node) ? node.children.map(reactNode).filter(value => value !== null) : [] };
  }
  const ast = parse(native, { modern: true });
  const snippets = ast.fragment.nodes.filter(node => node.type === 'SnippetBlock');
  assert.deepEqual(snippets.map(node => node.expression.name), ['buttonText', ...names]);
  for (const node of snippets) assert.equal(node.parameters.length, 0);
  const text = snippets[0].body.nodes; assert.equal(text.length, 1); assert.equal(text[0].type, 'Text'); assert.equal(text[0].data, 'Button');
  function nativeNode(node) {
    if (node.type === 'Text') return node.data || null;
    if (node.type === 'RenderTag') {
      assert.equal(node.expression.type, 'CallExpression'); assert.equal(node.expression.callee.name, 'buttonText'); assert.equal(node.expression.arguments.length, 0);
      return 'Button';
    }
    assert(['Component', 'RegularElement'].includes(node.type), 'no substituted source helper');
    return { name: node.name, attrs: node.attributes.map(attr => {
      assert.equal(attr.type, 'Attribute'); assert(Array.isArray(attr.value)); assert.equal(attr.value.length, 1); assert.equal(attr.value[0].type, 'Text');
      return [attr.name, attr.value[0].data];
    }), children: node.fragment.nodes.map(nativeNode).filter(value => value !== null) };
  }
  const results = names.map((name, index) => {
    const returnNode = body(name).body.statements.find(ts.isReturnStatement);
    assert(ts.isParenthesizedExpression(returnNode.expression));
    const expected = reactNode(returnNode.expression.expression);
    const nodes = snippets[index + 1].body.nodes;
    assert.equal(nodes.length, 1); const actual = nativeNode(nodes[0]); assert.deepEqual(actual, expected, name);
    return expected;
  });
  const wrappers = ast.fragment.nodes.filter(node => node.type === 'Component'); assert.equal(wrappers.length, 1);
  assert.equal(wrappers[0].name, 'ExampleWrapper'); assert.equal(wrappers[0].attributes.length, 0);
  assert.deepEqual(wrappers[0].fragment.nodes.map(node => { assert.equal(node.type, 'RenderTag'); assert.equal(node.expression.arguments.length, 0); return node.expression.callee.name; }), names);
  const imports = ast.instance.content.body.filter(node => node.type === 'ImportDeclaration');
  assert.deepEqual(imports.map(node => node.source.value), ['@sveltery/ui/example', '@sveltery/ui/card', '@sveltery/ui/button', '@sveltery/ui/icons']);
  return results;
}

test('two original native-image declarations, helpers, complete CSS and raw test inventory are authenticated', () => {
  const m = JSON.parse(readFileSync('tests/reference/card-image-gallery-sources.json', 'utf8'));
  assert.equal(m.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  const sha = bytes => createHash('sha256').update(bytes).digest('hex');
  for (const row of m.originalFiles) {
    const bytes = readFileSync(row.path); assert.equal(bytes.length, row.bytes); assert.equal(sha(bytes), row.sha256);
    assert.equal(createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex'), row.gitBlob);
  }
  const inventory = JSON.parse(readFileSync('tests/reference/shadcn-test-inventory.json', 'utf8'));
  assert(inventory.current_wrapper_runtime_suite_absence.includes('Card')); assert.equal(inventory.files.length, 139);
  assert.equal(m.genuineTestInventory.trackedRecords, 139); assert.equal(m.genuineTestInventory.testSources, 133); assert.equal(m.genuineTestInventory.snapshots, 6);
  assert.equal(m.ordinaryUpstreamTestCredit, 0);
});

test('production image bodies preserve independent original ordered hosts/helpers/literal props/text and wrapper calls', () => {
  cardImageSource(readFileSync('apps/docs/examples/base/CardImageExample.svelte', 'utf8'), readFileSync('tests/reference/card-example.tsx', 'utf8'), readFileSync('tests/reference/card-image-selected-examples.tsx', 'utf8'));
});

test('actual source validator rejects independent composition, attribute, text and ordering mutations', () => {
  const native = readFileSync('apps/docs/examples/base/CardImageExample.svelte', 'utf8');
  const original = readFileSync('tests/reference/card-example.tsx', 'utf8'); const selected = readFileSync('tests/reference/card-image-selected-examples.tsx', 'utf8');
  const edits = [['src="https://images.unsplash.com/', 'src="https://example.invalid/'], ['Photo by mymind on Unsplash', 'Altered photo'], ['mix-blend-color', 'mix-blend-normal'], ['<Card size="sm"', '<Card size="default"'], ['<Button size="sm"', '<Button size="default"'], ['lucide="PlusIcon"', 'lucide="SquareIcon"'], ['{#snippet buttonText()}Button', '{#snippet buttonText()} Button'], ['{@render CardWithImage()}{@render CardWithImageSmall()}', '{@render CardWithImageSmall()}{@render CardWithImage()}']];
  for (const [before, after] of edits) { assert(native.includes(before)); assert.throws(() => cardImageSource(native.replace(before, after), original, selected), before); }
});
