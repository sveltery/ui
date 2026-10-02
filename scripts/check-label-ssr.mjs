// Supplemental source-derived SSR assertions execute the immutable pinned React Label.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { Label } from '../apps/docs/registry/bases/base/ui/label/index.js';

function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const { Label: Reference } = await import(moduleURL('tests/reference/label.tsx', { react: import.meta.resolve('react'), cn }));
const attributes = node => Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b)));
const cases = [{}, { htmlFor: 'message', id: 'label', title: 'Label & <draft>' }, { className: 'block items-end select-text gap-4 text-lg' }, { 'data-slot': 'custom', hidden: true, 'aria-label': 'Native label' }, { 'data-slot': undefined }, { 'data-slot': null }, { htmlFor: undefined, className: undefined }];
for (const props of cases) {
  const { className: classProp, htmlFor, ...rest } = props;
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props))).window.document.querySelector('label');
  const actual = new JSDOM(render(Label, { props: { ...rest, class: classProp, for: htmlFor } }).body).window.document.querySelector('label');
  assert.equal(actual.tagName, expected.tagName);
  assert.deepEqual(attributes(actual), attributes(expected), JSON.stringify(props));
  assert.equal(actual.hasAttribute('ref'), false);
}
// Bindable refs and attachments run only in the browser; see the paired hydration fixture.
console.log('Pinned React/Svelte Label SSR: native host, escaped attributes, omitted/undefined/null data-slot and class/prop precedence PASS');
