// Supplemental source-derived SSR assertions execute the immutable pinned React Alert.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';

function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const Reference = await import(moduleURL('tests/reference/alert.tsx', { react: import.meta.resolve('react'), cn, 'class-variance-authority': import.meta.resolve('class-variance-authority') }));
const Parts = await import('../apps/docs/registry/bases/base/ui/alert/index.js');
const attributes = node => Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b)));
const cases = [{}, { id: 'alert', title: 'Alert & <draft>' }, { className: 'static w-auto text-lg' }, { 'data-slot': 'custom', role: 'status', hidden: true, 'aria-label': 'Native alert' }, { 'data-slot': undefined }, { 'data-slot': null }, { role: undefined }, { role: null }];
let count = 0;
for (const name of ['Alert', 'AlertTitle', 'AlertDescription', 'AlertAction']) {
  for (const props of [...cases, ...(name === 'Alert' ? [{ variant: 'default' }, { variant: 'destructive' }, { variant: null }, { variant: undefined }] : [])]) {
    const { className: classProp, ...rest } = props;
    const expected = new JSDOM(renderToStaticMarkup(createElement(Reference[name], props))).window.document;
    const actual = new JSDOM(render(Parts[name], { props: { ...rest, class: classProp } }).body).window.document;
    assert.equal(actual.body.childElementCount, 1);
    assert.equal(actual.body.firstElementChild.tagName, expected.body.firstElementChild.tagName);
    assert.deepEqual(attributes(actual.body.firstElementChild), attributes(expected.body.firstElementChild), `${name} ${JSON.stringify(props)}`);
    assert.equal(actual.body.firstElementChild.hasAttribute('ref'), false);
    count++;
  }
}
// Full child-tree SSR comparison executes the selected immutable Basic example body under the documented native scaffold.
const galleryURL = moduleURL('tests/reference/AlertGallery.tsx', { react: import.meta.resolve('react'), './alert': moduleURL('tests/reference/alert.tsx', { react: import.meta.resolve('react'), cn, 'class-variance-authority': import.meta.resolve('class-variance-authority') }) });
const { AlertGallery } = await import(galleryURL);
const { default: Example } = await import('../apps/docs/examples/base/AlertExample.svelte');
function semantic(node) {
  return { tag: node.tagName, attrs: attributes(node), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent.trim()).filter(Boolean).join(' '), children: [...node.children].map(semantic) };
}
const expectedGallery = new JSDOM(renderToStaticMarkup(createElement(AlertGallery))).window.document.body.firstElementChild;
const actualGallery = new JSDOM(render(Example).body).window.document.body.firstElementChild;
assert.deepEqual(semantic(actualGallery), semantic(expectedGallery));
console.log(`Pinned React/Svelte Alert SSR: ${count} native prop/class/variant cases and Basic semantic tree PASS`);
