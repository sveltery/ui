// Source-derived SSR comparisons execute the byte-exact pinned wrapper; no copied upstream tests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import * as components from '../apps/docs/registry/bases/base/ui/table/index.js';
import TableProbe from '../apps/docs/examples/base/TableProbe.svelte';
import TableExample from '../apps/docs/examples/base/TableExample.svelte';
function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const tableURL = moduleURL('tests/reference/table.tsx', { react: import.meta.resolve('react'), cn });
const reference = await import(tableURL);
const { TableProbe: ReactProbe } = await import(moduleURL('tests/reference/TableProbe.tsx', { react: import.meta.resolve('react'), './table': tableURL }));
function snapshot(node) {
  if (node.nodeType === 3) return node.textContent.trim() || undefined;
  if (node.nodeType !== 1) return undefined;
  return { tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), children: [...node.childNodes].map(snapshot).filter(value => value !== undefined) };
}
const expected = new JSDOM(renderToStaticMarkup(createElement(ReactProbe))).window.document;
const actual = new JSDOM(render(TableProbe).body).window.document;
assert.deepEqual(snapshot(actual.querySelector('table')), snapshot(expected.querySelector('table')), 'paired native semantic tree with caption, scopes, spans, checkbox and footer');
const tags = { Table: 'table', TableHeader: 'thead', TableBody: 'tbody', TableFooter: 'tfoot', TableRow: 'tr', TableHead: 'th', TableCell: 'td', TableCaption: 'caption' };
function parse(html, tag) {
  const wrapper = tag === 'table' ? html : tag === 'td' || tag === 'th' ? `<table><tbody><tr>${html}</tr></tbody></table>` : tag === 'tr' ? `<table><tbody>${html}</tbody></table>` : `<table>${html}</table>`;
  return new JSDOM(wrapper).window.document.querySelector(tag);
}
for (const [name, tag] of Object.entries(tags)) {
  for (const className of [undefined, ['p-2', 'p-6'].join(' '), 'text-right']) {
    const props = { id: `ssr-${tag}`, 'data-slot': `override-${tag}`, 'data-contract': 'native & <attribute>', 'aria-label': 'Native host', className };
    const { className: classProp, ...native } = props;
    const react = parse(renderToStaticMarkup(createElement(reference[name], props)), tag);
    const svelte = parse(render(components[name], { props: { ...native, class: classProp } }).body, tag);
    assert.deepEqual(snapshot(svelte), snapshot(react), `${name} native prop and class precedence`);
    assert.equal(svelte.getAttribute('data-slot'), `override-${tag}`);
  }
}
assert.equal(actual.querySelector('[data-slot="table-container"]').className, 'cn-table-container');
assert.equal(actual.querySelector('table').parentElement.getAttribute('id'), null, 'Table props belong to table, not its pinned scroll container');
console.log('Pinned React/Svelte Table SSR: paired semantic tree and 24 native class/prop precedence cases PASS');

const exampleURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const { TableGallery } = await import(moduleURL('tests/reference/TableGallery.tsx', { react: import.meta.resolve('react'), './table': tableURL, './example-scaffold': exampleURL }));
const expectedGallery = new JSDOM(renderToStaticMarkup(createElement(TableGallery))).window.document;
const actualGallery = new JSDOM(render(TableExample).body).window.document;
assert.deepEqual([...actualGallery.querySelectorAll('table')].map(snapshot), [...expectedGallery.querySelectorAll('table')].map(snapshot), 'four selected actual example bodies, including With Badges literal spans');
assert.equal(actualGallery.querySelectorAll('table').length, 4);
assert.equal(actualGallery.querySelectorAll('table')[3].querySelectorAll('span').length, 6);
assert.equal(actualGallery.querySelectorAll('table')[3].querySelector('[data-slot="badge"], [role], button, input, select'), null);
console.log('Pinned React/Svelte Table gallery SSR: four native example trees and six literal badge spans PASS');

// Additive authored scaffold evidence: complete real helper tree, not two absent heading lists.
const gallerySelector = '[data-gallery][data-slot="example-wrapper"]';
const actualWrapper = actualGallery.querySelector(gallerySelector);
const expectedWrapper = expectedGallery.querySelector(gallerySelector);
assert(actualWrapper && expectedWrapper, 'both galleries must contain the genuine wrapper');
assert.deepEqual(snapshot(actualWrapper.parentElement), snapshot(expectedWrapper.parentElement), 'complete genuine shell/grid/four Example/title/content/Table trees');
assert.equal(actualWrapper.parentElement.className, 'w-full bg-muted dark:bg-background');
assert.equal(actualWrapper.children.length, 4);
assert.deepEqual([...actualWrapper.children].map(example => ({ tag: example.tagName, slot: example.getAttribute('data-slot'), count: example.children.length, titleTag: example.firstElementChild.tagName, title: example.firstElementChild.textContent, contentSlot: example.lastElementChild.getAttribute('data-slot') })), ['Basic', 'With Footer', 'Simple', 'With Badges'].map(title => ({ tag: 'DIV', slot: 'example', count: 2, titleTag: 'DIV', title, contentSlot: 'example-content' })));
assert.equal(actualWrapper.querySelectorAll('section,h2').length, 0);
console.log('Pinned React/Svelte Table gallery SSR: genuine shell/grid and four complete Example/title/content trees PASS (authored supplement)');
