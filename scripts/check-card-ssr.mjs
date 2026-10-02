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
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
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
