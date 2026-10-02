// Source-derived assertions execute all six immutable pinned React wrappers.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '../apps/docs/registry/bases/base/ui/empty/index.js';
import Fixture from '../tests/dom/EmptyFixture.svelte';
import Probe from '../apps/docs/examples/base/EmptyProbe.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const referenceURL = moduleURL('tests/reference/empty.tsx', { react: import.meta.resolve('react'), cn, 'class-variance-authority': import.meta.resolve('class-variance-authority') });
const References = await import(referenceURL);
const attributes = node => Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b)));
let count = 0;
for (const [name, Local] of Object.entries({ Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia })) {
  const cases = [{}, { id: 'empty', className: 'grid items-end text-left max-w-lg flex-row px-6', title: 'Empty & <draft>' }, { 'data-slot': 'custom', className: 'block', hidden: true }, { 'data-slot': undefined }, { 'data-slot': null }, ...(name === 'EmptyMedia' ? [{ variant: 'default' }, { variant: 'icon' }, { variant: undefined }, { variant: null }, { variant: 'icon', 'data-variant': 'custom' }, { variant: 'icon', 'data-variant': undefined }, { variant: 'icon', 'data-variant': null }] : [])];
  for (const props of cases) {
    const expected = new JSDOM(renderToStaticMarkup(createElement(References[name], props))).window.document.querySelector('div');
    const { className: classProp, ...rest } = props;
    const actual = new JSDOM(render(Local, { props: { ...rest, class: classProp } }).body).window.document.querySelector('div');
    assert.equal(actual.tagName, expected.tagName, name); assert.equal(actual.tagName, 'DIV');
    assert.deepEqual(attributes(actual), attributes(expected), `${name}: ${JSON.stringify(props)}`);
    assert.equal(actual.hasAttribute('ref'), false); assert.equal(actual.hasAttribute('variant'), false); count++;
  }
}
const hosts = [...new JSDOM(render(Fixture).body).window.document.querySelectorAll('[id^=bound-empty-]')];
assert.equal(hosts.length, 6);
for (const [index, host] of hosts.entries()) { assert.equal(host.tagName, 'DIV'); assert.equal(host.textContent, `Initial & <Empty> ${index}`); assert.equal(host.getAttribute('title'), `Initial & <Empty> ${index}`); assert.equal(host.hasAttribute('ref'), false); assert.equal(host.hasAttribute('data-attached'), false); }
const { EmptyProbe: ReferenceProbe } = await import(moduleURL('tests/reference/EmptyProbe.tsx', { react: import.meta.resolve('react'), './empty': referenceURL }));
const selector = '[data-empty-host], [data-testid="media-selectors"] > div';
const actualProbe = new JSDOM(render(Probe).body).window.document;
const expectedProbe = new JSDOM(renderToStaticMarkup(createElement(ReferenceProbe))).window.document;
// CSS string/object serialization whitespace is a framework adaptation; compare parsed CSS.
const snapshot = document => [...document.querySelectorAll(selector)].map(node => ({ tag: node.tagName, attributes: { ...attributes(node), ...(node.hasAttribute('style') ? { style: node.style.cssText } : {}) }, text: node.textContent }));
assert.equal(actualProbe.querySelectorAll(selector).length, 11);
assert.deepEqual(snapshot(actualProbe), snapshot(expectedProbe), 'supplemental probe host attributes and exact escaped aggregate host text');
assert.equal([...actualProbe.querySelectorAll(selector)].map(node => node.textContent).join('\n'), [...expectedProbe.querySelectorAll(selector)].map(node => node.textContent).join('\n'));
assert.equal(actualProbe.querySelector('[data-empty-probe]').getAttribute('data-hydrated'), 'false');
console.log(`Pinned React/Svelte six Empty SSR div hosts: ${count} source-derived class/prop/variant cases, escaped fixture children and 11 paired supplemental probe hosts PASS`);
