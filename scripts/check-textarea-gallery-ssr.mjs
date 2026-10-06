// Authored source-derived supplements; no copied upstream suite or new reset acceptance.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Gallery from '../apps/docs/examples/base/TextareaExample.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const textarea = moduleURL('tests/reference/textarea.tsx', { react: import.meta.resolve('react'), cn });
const scaffold = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const selected = moduleURL('tests/reference/textarea-selected-examples.tsx', { './textarea': textarea, './example-scaffold': scaffold });
const { SelectedTextareaGallery } = await import(moduleURL('tests/reference/SelectedTextareaGallery.tsx', { './example-scaffold': scaffold, './textarea-selected-examples': selected }));
const actual = new JSDOM(render(Gallery).body).window.document;
const original = new JSDOM(renderToString(createElement(SelectedTextareaGallery))).window.document;
function tree(node) {
  return { tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).filter(t => /\S/u.test(t)), children: [...node.children].map(tree) };
}
for (const doc of [actual, original]) {
  const wrapper = doc.querySelector('[data-slot=example-wrapper]');
  assert.equal(wrapper.parentElement.querySelectorAll('*').length + 1, 10);
  assert.equal(wrapper.children.length, 2);
  assert.deepEqual([...wrapper.children].map(n => n.firstElementChild.textContent), ['Basic', 'Invalid']);
  assert.equal(wrapper.querySelectorAll('textarea[data-slot=textarea]').length, 2);
  assert.deepEqual([...wrapper.querySelectorAll('textarea')].map(n => [n.getAttribute('placeholder'), n.getAttribute('aria-invalid'), n.value]), [['Type your message here.', null, ''], ['Type your message here.', 'true', '']]);
  assert.equal(wrapper.querySelectorAll('section, h2, label, [data-testid], [data-gallery]').length, 0);
}
assert.deepEqual(tree(actual.querySelector('[data-slot=example-wrapper]').parentElement), tree(original.querySelector('[data-slot=example-wrapper]').parentElement));
console.log('Two genuine Textarea bodies: independent pinned React/Svelte complete ten-host SSR trees, exact attrs/meaningful title text and empty values PASS; authored supplement, zero copied-suite credit');
