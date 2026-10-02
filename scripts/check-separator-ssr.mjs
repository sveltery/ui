// Supplemental source-derived SSR assertions execute the immutable pinned React Separator.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { Separator } from '../apps/docs/registry/bases/base/ui/separator/index.js';

function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const { Separator: Reference } = await import(moduleURL('tests/reference/separator.tsx', { '@base-ui/react/separator': import.meta.resolve('@base-ui/react/separator'), cn }));
const attributes = node => Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b)));
const cases = [{}, { orientation: 'horizontal' }, { orientation: 'vertical', id: 'separator', title: 'Separator & <draft>' }, { className: 'bg-red-500 w-6' }, { className: () => 'ignored' }, { 'data-slot': 'custom', role: 'presentation', 'aria-orientation': 'horizontal', 'data-vertical': '' }, { 'data-slot': undefined }, { 'data-slot': null }, { orientation: undefined, className: undefined }];
for (const props of cases) {
  const { className: classProp, ...rest } = props;
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props))).window.document.querySelector('div');
  const actual = new JSDOM(render(Separator, { props: { ...rest, class: classProp } }).body).window.document.querySelector('div');
  assert.equal(actual.tagName, expected.tagName);
  assert.deepEqual(attributes(actual), attributes(expected), JSON.stringify(props));
  assert.equal(actual.hasAttribute('ref'), false);
}
// Bindable refs and attachments run only in the browser; see the paired hydration fixture.
console.log('Pinned React/Svelte Separator SSR: native host, orientation, unchanged shared selector mismatch, ignored class callbacks, escaped attributes and caller precedence PASS');
