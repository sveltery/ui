// Source-derived assertions execute the immutable pinned React wrapper.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Skeleton from '../apps/docs/registry/bases/base/ui/skeleton/Skeleton.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const { Skeleton: Reference } = await import(moduleURL('tests/reference/skeleton.tsx', { react: import.meta.resolve('react'), cn }));
for (const props of [{}, { id: 'load', className: 'h-4 w-32', title: 'Loading & <draft>' }, { 'data-slot': 'custom', className: 'rounded-none animate-none' }]) {
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props, 'Loading & <draft>'))).window.document.querySelector('div');
  const { className: classProp, ...rest } = props;
  // Children snippets are checked by DOM/hydration tests; native SSR attributes are paired here.
  const actual = new JSDOM(render(Skeleton, { props: { ...rest, class: classProp } }).body).window.document.querySelector('div');
  assert.deepEqual(Object.fromEntries([...actual.attributes].map(attr => [attr.name, attr.value])), Object.fromEntries([...expected.attributes].map(attr => [attr.name, attr.value])));
  assert.equal(actual.hasAttribute('ref'), false);
}
console.log('Pinned React/Svelte Skeleton SSR native host, escaped attributes, class and prop precedence PASS');
