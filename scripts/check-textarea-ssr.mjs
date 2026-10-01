// Source-derived SSR comparisons execute the pinned wrapper; no copied upstream test provenance.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Textarea from '../apps/docs/registry/bases/base/ui/textarea/Textarea.svelte';
function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText;
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const { Textarea: Reference } = await import(moduleURL('tests/reference/textarea.tsx', { react: import.meta.resolve('react'), cn }));
for (const props of [{}, { defaultValue: 'Draft & <message>' }, { defaultValue: '\nLeading draft' }, { value: 'Value & <message>', readOnly: true }, { value: '\nLeading value', readOnly: true }, { value: 0, readOnly: true }, { value: '', readOnly: true }]) {
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props))).window.document.querySelector('textarea');
  const { readOnly: readonly, ...rest } = props;
  const actual = new JSDOM(render(Textarea, { props: { ...rest, readonly } }).body).window.document.querySelector('textarea');
  assert.equal(actual.value, expected.value, JSON.stringify(props));
  assert.equal(actual.defaultValue, expected.defaultValue, JSON.stringify(props));
  assert.equal(actual.hasAttribute('defaultvalue'), false);
}
console.log('Actual pinned React/Svelte native Textarea SSR initial/default values, escaping and leading newlines PASS');
