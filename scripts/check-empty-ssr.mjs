// Source-derived assertions execute all six immutable pinned React wrappers.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup, renderToString, renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { prepareIconReference } from './prepare-icon-reference.mjs';
import GalleryFixture from '../apps/docs/examples/base/EmptyGalleryFixture.svelte';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '../apps/docs/registry/bases/base/ui/empty/index.js';
import Fixture from '../tests/dom/EmptyFixture.svelte';
import Probe from '../apps/docs/examples/base/EmptyProbe.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const referenceURL = moduleURL('tests/reference/empty.tsx', { react: import.meta.resolve('react'), cn, 'class-variance-authority': import.meta.resolve('class-variance-authority') });
const References = await import(referenceURL);
const attributes = node => Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b)));
let count = 0;
for (const [name, Local] of Object.entries({ Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia })) {
  const cases = [{}, { id: 'empty', className: 'grid items-end text-left max-w-lg flex-row px-6', title: 'Empty & <draft>' }, { 'data-slot': 'custom', className: 'block', hidden: true }, { 'data-slot': undefined }, { 'data-slot': null }, ...(name === 'EmptyMedia' ? [{ variant: 'default' }, { variant: 'icon' }, { variant: undefined }, { variant: null }, { variant: 'icon', 'data-variant': 'custom' }, { variant: 'icon', 'data-variant': undefined }, { variant: 'icon', 'data-variant': null }] : [])];
  for (const props of cases) {
    const expected = new JSDOM(renderToStaticMarkup(createElement(References[name], props))).window.document.querySelector('div');
    const { className: classProp, ...rest } = props;
    const actual = new JSDOM(render(Local, { props: { ...rest, class: classProp } }).body).window.document.querySelector('div');
    assert.equal(actual.tagName, expected.tagName, name); assert.equal(actual.tagName, 'DIV');
    assert.deepEqual(attributes(actual), attributes(expected), `${name}: ${JSON.stringify(props)}`);
    assert.equal(actual.hasAttribute('ref'), false); assert.equal(actual.hasAttribute('variant'), false); count++;
  }
}
const hosts = [...new JSDOM(render(Fixture).body).window.document.querySelectorAll('[id^=bound-empty-]')];
assert.equal(hosts.length, 6);
for (const [index, host] of hosts.entries()) { assert.equal(host.tagName, 'DIV'); assert.equal(host.textContent, `Initial & <Empty> ${index}`); assert.equal(host.getAttribute('title'), `Initial & <Empty> ${index}`); assert.equal(host.hasAttribute('ref'), false); assert.equal(host.hasAttribute('data-attached'), false); }
const { EmptyProbe: ReferenceProbe } = await import(moduleURL('tests/reference/EmptyProbe.tsx', { react: import.meta.resolve('react'), './empty': referenceURL }));
const selector = '[data-empty-host], [data-testid="media-selectors"] > div';
const actualProbe = new JSDOM(render(Probe).body).window.document;
const expectedProbe = new JSDOM(renderToString(createElement(ReferenceProbe))).window.document;
// CSS string/object serialization whitespace is a framework adaptation; compare parsed CSS.
const snapshot = document => [...document.querySelectorAll(selector)].map(node => ({ tag: node.tagName, attributes: { ...attributes(node), ...(node.hasAttribute('style') ? { style: node.style.cssText } : {}) }, text: node.textContent }));
assert.equal(actualProbe.querySelectorAll(selector).length, 11);
assert.deepEqual(snapshot(actualProbe), snapshot(expectedProbe), 'supplemental probe host attributes and exact escaped aggregate host text');
assert.equal([...actualProbe.querySelectorAll(selector)].map(node => node.textContent).join('\n'), [...expectedProbe.querySelectorAll(selector)].map(node => node.textContent).join('\n'));
// Match the actual reference route's hydratable SSR text-node segmentation.
for (const document of [actualProbe, expectedProbe]) {
  assert.deepEqual([...document.querySelector('#probe-empty-3').childNodes].filter(node => node.nodeType === 3).map(node => node.textContent), ['Initial 3']);
}
assert.equal(actualProbe.querySelector('[data-empty-probe]').getAttribute('data-hydrated'), 'false');
console.log(`Pinned React/Svelte six Empty SSR div hosts: ${count} source-derived class/prop/variant cases, escaped fixture children and 11 paired supplemental probe hosts PASS`);

// Authored full-composition supplements; all original wrapper/probe assertions remain above.
await prepareIconReference();
const scaffoldURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const buttonURL = moduleURL('tests/reference/button.tsx', { cn, '@base-ui/react/button': import.meta.resolve('@base-ui/react/button'), 'class-variance-authority': import.meta.resolve('class-variance-authority') });
const iconURL = pathToFileURL(resolve('.checks/icons-reference/icon.mjs')).href;
const providerURL = pathToFileURL(resolve('.checks/icons-reference/icons/search-params.mjs')).href;
const selectedURL = moduleURL('tests/reference/empty-selected-examples.tsx', { './button': buttonURL, './empty': referenceURL, './example-scaffold': scaffoldURL, './icon': iconURL });
const { SelectedEmptyGallery } = await import(moduleURL('tests/reference/SelectedEmptyGallery.tsx', { './example-scaffold': scaffoldURL, './empty-selected-examples': selectedURL, './icons/search-params': providerURL }));
function selectedWrapper(document) { return document.querySelector('[data-slot=example-wrapper]'); }
function galleryTree(node) {
  // Existing helper indentation is separate from meaningful child topology;
  // no meaningful text is trimmed, concatenated, or otherwise normalized.
  const exactText = node.matches('a, button, [data-slot=empty-title], [data-slot=empty-description]');
  return { tag: node.localName, attrs: attributes(node), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent).filter(text => /\S/u.test(text) || text === ' ' || exactText), children: [...node.children].map(galleryTree) };
}
const coldOriginal = new JSDOM(renderToString(createElement(SelectedEmptyGallery))).window.document;
const coldNative = new JSDOM(render(GalleryFixture).body).window.document;
assert.equal(selectedWrapper(coldOriginal).querySelectorAll('template').length, 6);
assert.equal(selectedWrapper(coldOriginal).querySelectorAll('svg.lucide-square').length, 6);
assert.equal(selectedWrapper(coldNative).querySelectorAll('template').length, 0);
assert.equal(selectedWrapper(coldNative).querySelectorAll('svg.lucide-square').length, 6);
const { loadIcon } = await import(new URL('./data.js', pathToFileURL(createRequire(new URL('../apps/docs/package.json', import.meta.url)).resolve('@sveltery/ui/icons'))));
const glyphs = {
  lucide: ['ArrowUpRightIcon', 'FolderIcon', 'PlusIcon'], tabler: ['IconArrowUpRight', 'IconFolder', 'IconPlus'], hugeicons: ['ArrowUpRight01Icon', 'Folder01Icon', 'PlusSignIcon'], phosphor: ['ArrowUpRightIcon', 'FolderIcon', 'PlusIcon'], remixicon: ['RiArrowRightUpLine', 'RiFolderLine', 'RiAddLine'],
};
async function allReady(element) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough(); let html = '';
    output.on('data', chunk => { html += chunk; }); output.on('end', () => resolve(html)); output.on('error', reject);
    const stream = renderToPipeableStream(element, { progressiveChunkSize: Number.MAX_SAFE_INTEGER, onAllReady() { stream.pipe(output); }, onError: reject });
  });
}
for (const [library, names] of Object.entries(glyphs)) {
  const original = new JSDOM(await allReady(createElement(SelectedEmptyGallery, { library }))).window.document;
  await Promise.all(names.map(name => loadIcon(library, name)));
  const native = new JSDOM(render(GalleryFixture, { props: { library } }).body).window.document;
  const originalWrapper = selectedWrapper(original); const nativeWrapper = selectedWrapper(native);
  assert.equal(originalWrapper.querySelectorAll('template').length, 0, 'actual all-ready stream contains settled source glyphs, never stripped fallback markup');
  assert.deepEqual(galleryTree(nativeWrapper.parentElement), galleryTree(originalWrapper.parentElement), library);
  const hosts = wrapper => [wrapper.parentElement, wrapper, ...wrapper.querySelectorAll('*')].filter(node => node.namespaceURI === 'http://www.w3.org/1999/xhtml');
  assert.equal(hosts(nativeWrapper).length, 48); assert.equal(hosts(originalWrapper).length, 48);
  assert.equal(nativeWrapper.querySelectorAll('[data-slot=empty]').length, 4);
  assert.equal(nativeWrapper.querySelectorAll('[data-slot=empty-icon][data-variant=icon]').length, 2);
  assert.equal(nativeWrapper.querySelectorAll('svg').length, 6);
  assert.equal(nativeWrapper.querySelectorAll('a[data-slot=button]').length, 5);
  assert.equal(nativeWrapper.querySelectorAll('button[data-slot=button]').length, 4);
  assert.equal(nativeWrapper.querySelectorAll('a[href="#"]').length, 6);
  assert.deepEqual([...nativeWrapper.children].map(node => node.firstElementChild.textContent), ['Basic', 'With Muted Background', 'With Icon', 'In Card']);
  const explicitTexts = document => [...document.querySelectorAll('a[data-slot=button].cn-button-variant-link')].map(node => [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent));
  assert.deepEqual(explicitTexts(original), [['Learn more', ' '], ['Learn more', ' '], ['Learn more', ' ']]);
  assert.deepEqual(explicitTexts(native), explicitTexts(original));
  const inline = wrapper => [...wrapper.querySelectorAll('[data-slot=empty-description]')][2];
  const directText = node => [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent);
  assert.deepEqual(directText(inline(originalWrapper)), ['No posts have been created yet. Get started by', ' ', '.']);
  assert.deepEqual(directText(inline(nativeWrapper)), directText(inline(originalWrapper)));
}
console.log('Four genuine selected Empty galleries: all-five-library settled full HTML/SVG/meaningful-text trees, 48 HTML hosts, genuine rendered anchors and exact explicit U+0020 topology PASS; cold boundary/serialization/timing equivalence remains unaccepted');
