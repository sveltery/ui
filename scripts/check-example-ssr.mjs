// Source-derived assertions execute the immutable pinned React scaffold.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Example from '../apps/docs/registry/bases/base/ui/example/Example.svelte';
import ExampleWrapper from '../apps/docs/registry/bases/base/ui/example/ExampleWrapper.svelte';
import Probe from '../apps/docs/examples/base/ExampleProbe.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = moduleURL('tests/reference/cn.ts', { clsx: import.meta.resolve('clsx'), 'tailwind-merge': import.meta.resolve('tailwind-merge') });
const scaffoldURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const References = await import(scaffoldURL);
const { ExampleProbe } = await import(moduleURL('tests/reference/ExampleProbe.tsx', { './example-scaffold': scaffoldURL }));
function tree(node) { return { tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.name === 'style' ? node.style.cssText : attr.value])), text: node.children.length ? null : node.textContent, children: [...node.children].map(tree) }; }
for (const [name, Local] of [['Example', Example], ['ExampleWrapper', ExampleWrapper]]) {
  for (const props of [{}, { title: '' }, { title: 'Title & <draft>', className: 'gap-2 p-4', id: 'outer', 'data-slot': 'custom', style: { color: 'red' }, ...(name === 'Example' ? { containerClassName: 'max-w-md' } : {}) }]) {
    const expected = new JSDOM(renderToStaticMarkup(createElement(References[name], props))).window.document.body.firstElementChild;
    const { className: classProp, style, ...rest } = props;
    const actual = new JSDOM(render(Local, { props: { ...rest, class: classProp, style: style ? 'color: red' : undefined } }).body).window.document.body.firstElementChild;
    assert.deepEqual(tree(actual), tree(expected), name);
    assert.equal(actual.querySelectorAll('[ref],[containerclassname],h1,h2,h3,section').length, 0);
  }
}
const expected = new JSDOM(renderToStaticMarkup(createElement(ExampleProbe))).window.document.body.firstElementChild;
const actual = new JSDOM(render(Probe).body).window.document.querySelector('#probe-wrapper').parentElement;
assert.deepEqual(tree(actual), tree(expected));
console.log('Pinned React/Svelte native Example and ExampleWrapper SSR structure, title omission, snippet composition, classes and prop precedence PASS');
