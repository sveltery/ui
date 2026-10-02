// Source-derived paired SSR against actual pinned shadcn Input and its React1.6 dependency.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Input from '../apps/docs/registry/bases/base/ui/input/Input.svelte';
function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText;
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const { Input: Reference } = await import(moduleURL('tests/reference/input.tsx', { react: import.meta.resolve('react'), '@base-ui/react/input': import.meta.resolve('@base-ui/react/input'), cn }));
for (const props of [{}, { id: 'explicit-input', type: 'email', defaultValue: 'Draft & <value>', required: true, name: 'email' }, { defaultValue: '\nLeading draft' }, { value: 'Value & <input>', readOnly: true }, { value: 0, readOnly: true }, { value: '', readOnly: true }, { type: 'checkbox', checked: true, readOnly: true }, { type: 'checkbox', defaultChecked: true }, { type: 'file', accept: 'image/*', multiple: true }, { disabled: true, 'aria-invalid': 'true' }]) {
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props))).window.document.querySelector('input');
  const { readOnly: readonly, ...rest } = props;
  const actual = new JSDOM(render(Input, { props: { ...rest, readonly } }).body).window.document.querySelector('input');
  const names = node => node.getAttributeNames().filter(name => name !== 'id').sort();
  assert.deepEqual(names(actual), names(expected), JSON.stringify(props));
  for (const name of names(expected)) assert.equal(actual.getAttribute(name), expected.getAttribute(name), `${JSON.stringify(props)} ${name}`);
  for (const key of ['type', 'value', 'defaultValue', 'checked', 'defaultChecked']) assert.equal(actual[key], expected[key], `${JSON.stringify(props)} ${key}`);
  if (props.id) assert.equal(actual.id, expected.id); else { assert(actual.id); assert(expected.id); }
  assert(!actual.hasAttribute('defaultvalue')); assert(!actual.hasAttribute('defaultchecked'));
}
console.log('Actual pinned shadcn/React1.6 versus Svelte Input SSR attributes, native defaults, checked state and escaped values PASS; only generated ID bytes normalized');
