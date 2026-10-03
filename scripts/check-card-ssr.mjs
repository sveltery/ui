// Source-derived assertions execute all seven immutable pinned React wrappers.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../apps/docs/registry/bases/base/ui/card/index.js';
import Fixture from '../tests/dom/CardFixture.svelte';
import Gallery from '../apps/docs/examples/base/CardExample.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const References = await import(moduleURL('tests/reference/card.tsx', { react: import.meta.resolve('react'), cn }));
for (const [name, Local] of Object.entries({ Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter })) {
  const cases = [{}, { id: 'card', className: 'grid items-end row-start-3 px-6', title: 'Card & <draft>' }, { 'data-slot': 'custom', className: 'block', hidden: true }, ...(name === 'Card' ? [{ size: 'sm' }, { size: undefined }, { size: null }, { size: 'sm', 'data-size': 'custom' }, { size: 'sm', 'data-size': undefined }, { size: 'sm', 'data-size': null }] : [])];
  for (const props of cases) {
    const expected = new JSDOM(renderToStaticMarkup(createElement(References[name], props))).window.document.querySelector('div');
    const { className: classProp, ...rest } = props;
    const actual = new JSDOM(render(Local, { props: { ...rest, class: classProp } }).body).window.document.querySelector('div');
    assert.equal(actual.tagName, expected.tagName, name);
    assert.deepEqual(Object.fromEntries([...actual.attributes].map(attr => [attr.name, attr.value])), Object.fromEntries([...expected.attributes].map(attr => [attr.name, attr.value])), `${name}: ${JSON.stringify(props)}`);
    assert.equal(actual.hasAttribute('ref'), false); assert.equal(actual.hasAttribute('size'), false);
  }
}
const html = render(Fixture).body;
const hosts = [...new JSDOM(html).window.document.querySelectorAll('[id^=bound-card-]')];
assert.equal(hosts.length, 7);
for (const [index, host] of hosts.entries()) { assert.equal(host.tagName, 'DIV'); assert.equal(host.textContent, `Initial & <Card> ${index}`); assert.equal(host.getAttribute('title'), `Initial & <Card> ${index}`); assert.equal(host.hasAttribute('ref'), false); assert.equal(host.hasAttribute('data-attached'), false); }
console.log('Pinned React/Svelte seven Card SSR native hosts, escaped children/attributes, size defaults and class/prop precedence PASS');

// Authored whole-gallery supplement. Raw originals and seven selected bodies stay unchanged.
const cardURL = moduleURL('tests/reference/card.tsx', { react: import.meta.resolve('react'), cn });
const exampleURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const buttonURL = moduleURL('tests/reference/button.tsx', { '@base-ui/react/button': import.meta.resolve('@base-ui/react/button'), 'class-variance-authority': import.meta.resolve('class-variance-authority'), cn });
const selectedURL = moduleURL('tests/reference/card-selected-examples.tsx', { './card': cardURL, './button': buttonURL, './example-scaffold': exampleURL });
const { CardGallery } = await import(moduleURL('tests/reference/CardGallery.tsx', { react: import.meta.resolve('react'), './card': cardURL, './button': buttonURL, './example-scaffold': exampleURL, './card-selected-examples': selectedURL }));
const referenceGallery = new JSDOM(renderToStaticMarkup(createElement(CardGallery))).window.document;
const nativeGallery = new JSDOM(render(Gallery).body).window.document;
function snapshot(node) {
  if (node.nodeType === 3) return node.textContent.replace(/\s+/gu, ' ').trim() || undefined;
  if (node.nodeType !== 1) return undefined;
  return { tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), children: [...node.childNodes].map(snapshot).filter(value => value !== undefined) };
}
const actualWrapper = nativeGallery.querySelector('[data-slot="example-wrapper"]');
const expectedWrapper = referenceGallery.querySelector('[data-slot="example-wrapper"]');
assert(actualWrapper && expectedWrapper, 'both targets execute the real wrapper');
assert.deepEqual(snapshot(actualWrapper.parentElement), snapshot(expectedWrapper.parentElement), 'complete shell/grid/seven Example/title/content/Card/Button semantic trees');
assert.equal(actualWrapper.parentElement.className, 'w-full bg-muted dark:bg-background');
assert.equal(actualWrapper.children.length, 7);
const titles = ['Default Size', 'Small Size', 'Content Edge to Edge', 'Header with Border', 'Footer with Border', 'Header with Border (Small)', 'Footer with Border (Small)'];
assert.deepEqual([...actualWrapper.children].map(example => ({ tag: example.tagName, slot: example.getAttribute('data-slot'), count: example.children.length, titleTag: example.firstElementChild.tagName, title: example.firstElementChild.textContent, contentSlot: example.lastElementChild.getAttribute('data-slot') })), titles.map(title => ({ tag: 'DIV', slot: 'example', count: 2, titleTag: 'DIV', title, contentSlot: 'example-content' })));
assert.equal(actualWrapper.querySelectorAll('section,h2,[data-supplemental]').length, 0);
assert.equal(actualWrapper.parentElement.querySelectorAll('[data-slot]').length, 55);
assert.equal(actualWrapper.querySelectorAll('[data-slot="example-content"] [data-slot]').length, 40);
for (const name of ['action', 'override']) assert.deepEqual(snapshot(nativeGallery.querySelector(`[data-supplemental="${name}"]`)), snapshot(referenceGallery.querySelector(`[data-supplemental="${name}"]`)), `${name} unchanged authored probe`);
const hostCount = expectedWrapper.parentElement.querySelectorAll('*').length + 1;
assert.equal(actualWrapper.parentElement.querySelectorAll('*').length + 1, hostCount);
console.log(`Pinned React/Svelte Card gallery SSR: genuine shell/grid/seven complete trees, 55 original slots, 40 body slots and ${hostCount} actual original native hosts PASS (authored supplement)`);
