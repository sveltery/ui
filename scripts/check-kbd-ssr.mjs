// Source-derived assertions execute the immutable pinned React wrappers.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Kbd from '../apps/docs/registry/bases/base/ui/kbd/Kbd.svelte';
import KbdGroup from '../apps/docs/registry/bases/base/ui/kbd/KbdGroup.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const References = await import(moduleURL('tests/reference/kbd.tsx', { react: import.meta.resolve('react'), cn }));
for (const [name, Local] of [['Kbd', Kbd], ['KbdGroup', KbdGroup]]) {
  for (const props of [{}, { id: 'keys', className: 'px-6 gap-3', title: 'Ctrl & <K>' }, { 'data-slot': 'custom', className: 'pointer-events-auto' }]) {
    const expected = new JSDOM(renderToStaticMarkup(createElement(References[name], props))).window.document.querySelector('kbd');
    const { className: classProp, ...rest } = props;
    const actual = new JSDOM(render(Local, { props: { ...rest, class: classProp } }).body).window.document.querySelector('kbd');
    assert.equal(actual.tagName, expected.tagName, name);
    assert.deepEqual(Object.fromEntries([...actual.attributes].map(attr => [attr.name, attr.value])), Object.fromEntries([...expected.attributes].map(attr => [attr.name, attr.value])), name);
    assert.equal(actual.hasAttribute('ref'), false);
  }
}
console.log('Pinned React/Svelte Kbd and KbdGroup SSR actual kbd hosts, escaped attributes, class/prop precedence PASS');
