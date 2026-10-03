// Source-derived assertions execute the immutable pinned React wrapper.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Skeleton from '../apps/docs/registry/bases/base/ui/skeleton/Skeleton.svelte';
import Example from '../apps/docs/examples/base/SkeletonExample.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const { Skeleton: Reference } = await import(moduleURL('tests/reference/skeleton.tsx', { react: import.meta.resolve('react'), cn }));
const skeletonURL = moduleURL('tests/reference/skeleton.tsx', { react: import.meta.resolve('react'), cn });
const cardURL = moduleURL('tests/reference/card.tsx', { react: import.meta.resolve('react'), cn });
const scaffoldURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
// Supplemental Unicode witnesses use the genuine package independently in the
// original React wrapper and public Svelte component; literal expectations stay fixed.
for (const [className, expectedClass] of [
  ['p-2\u00a0p-4', 'cn-skeleton animate-pulse p-2\u00a0p-4'],
  ['p-2\u2028p-4', 'cn-skeleton animate-pulse p-2\u2028p-4'],
  ['p-2 p-4', 'cn-skeleton animate-pulse p-4'],
  ['p-2\tp-4', 'cn-skeleton animate-pulse p-4'],
]) {
  const original = new JSDOM(renderToStaticMarkup(createElement(Reference, { className }))).window.document.querySelector('div');
  const native = new JSDOM(render(Skeleton, { props: { class: className } }).body).window.document.querySelector('div');
  assert.equal(original.getAttribute('class'), expectedClass);
  assert.equal(native.getAttribute('class'), expectedClass);
}
const selectedURL = moduleURL('tests/reference/skeleton-selected-examples.tsx', { './skeleton': skeletonURL, './card': cardURL, './example-scaffold': scaffoldURL });
const { SkeletonGallery } = await import(moduleURL('tests/reference/SkeletonGallery.tsx', { react: import.meta.resolve('react'), './skeleton': skeletonURL, './skeleton-selected-examples': selectedURL, './example-scaffold': scaffoldURL }));
for (const props of [{}, { id: 'load', className: 'h-4 w-32', title: 'Loading & <draft>' }, { 'data-slot': 'custom', className: 'rounded-none animate-none' }]) {
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props, 'Loading & <draft>'))).window.document.querySelector('div');
  const { className: classProp, ...rest } = props;
  // Children snippets are checked by DOM/hydration tests; native SSR attributes are paired here.
  const actual = new JSDOM(render(Skeleton, { props: { ...rest, class: classProp } }).body).window.document.querySelector('div');
  assert.deepEqual(Object.fromEntries([...actual.attributes].map(attr => [attr.name, attr.value])), Object.fromEntries([...expected.attributes].map(attr => [attr.name, attr.value])));
  assert.equal(actual.hasAttribute('ref'), false);
}
const expectedGallery = new JSDOM(renderToStaticMarkup(createElement(SkeletonGallery))).window.document.querySelector('[data-gallery]');
const actualGallery = new JSDOM(render(Example).body).window.document.querySelector('[data-gallery]');
function tree(node) { return { tag: node.tagName, attributes: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])), text: node.children.length ? null : node.textContent, children: [...node.children].map(tree) }; }
assert.deepEqual(tree(actualGallery), tree(expectedGallery));
assert.equal(actualGallery.querySelectorAll('[data-slot=skeleton]').length, 24);
assert.equal(actualGallery.querySelectorAll('[data-slot]').length, 42);
const card = actualGallery.querySelector('[data-slot=card]');
assert.equal(card.getAttribute('data-size'), 'default');
assert.deepEqual([...card.children].map(child => child.getAttribute('data-slot')), ['card-header', 'card-content']);
assert.deepEqual([...card.querySelectorAll('[data-slot=skeleton]')].map(child => child.className), ['cn-skeleton animate-pulse h-4 w-2/3', 'cn-skeleton animate-pulse h-4 w-1/2', 'cn-skeleton animate-pulse aspect-square w-full']);
assert.equal(actualGallery.querySelectorAll('[ref], [role], [aria-busy], input, button, table').length, 0);
console.log('Pinned React/Svelte Skeleton SSR native host, escaped attributes, class/prop precedence and actual Card gallery composition PASS');
