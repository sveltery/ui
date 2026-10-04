// Supplemental source-derived SSR assertions execute the immutable pinned React Alert.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PassThrough } from 'node:stream';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { prepareIconReference } from './prepare-icon-reference.mjs';
import { createElement } from 'react';
import { renderToStaticMarkup, renderToString, renderToPipeableStream } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import GalleryFixture from '../apps/docs/examples/base/AlertGalleryFixture.svelte';

function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
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
// Preserve the unchanged Basic tree through genuine helpers and actual canonical icons.
await prepareIconReference();
const iconURL = pathToFileURL(resolve('.checks/icons-reference/icon.mjs')).href;
const providerURL = pathToFileURL(resolve('.checks/icons-reference/icons/search-params.mjs')).href;
const galleryURL = moduleURL('tests/reference/AlertGallery.tsx', { react: import.meta.resolve('react'), './icon': iconURL, './icons/search-params': providerURL, './alert': moduleURL('tests/reference/alert.tsx', { react: import.meta.resolve('react'), cn, 'class-variance-authority': import.meta.resolve('class-variance-authority') }), './example-scaffold': moduleURL('tests/reference/example-scaffold.tsx', { cn }) });
const { AlertGallery } = await import(galleryURL);
const { default: Example } = await import('../apps/docs/examples/base/AlertExample.svelte');
function semantic(node) {
  return { tag: node.tagName, attrs: attributes(node), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent.trim()).filter(Boolean).join(' '), children: [...node.children].map(semantic) };
}
const expectedGallery = new JSDOM(renderToStaticMarkup(createElement(AlertGallery))).window.document.body.firstElementChild;
const actualGallery = new JSDOM(render(Example).body).window.document.body.firstElementChild;
const basicTree = root => { const copy = root.cloneNode(true); for (const node of [...copy.firstElementChild.children].slice(1)) node.remove(); return semantic(copy); };
assert.deepEqual(basicTree(actualGallery), basicTree(expectedGallery));
// Authored source-derived shape witness: two wrapper divs, one Example/title/content tree, unchanged Basic body.
assert.equal(actualGallery.tagName, 'DIV');
assert.equal(actualGallery.className, 'w-full bg-muted dark:bg-background');
const wrapper = actualGallery.firstElementChild;
assert.equal(wrapper.tagName, 'DIV');
assert.equal(wrapper.getAttribute('data-slot'), 'example-wrapper');
assert(wrapper.classList.contains('lg:grid-cols-1'));
assert.equal(wrapper.children.length, 3);
const example = wrapper.firstElementChild;
assert.equal(example.tagName, 'DIV');
assert.equal(example.getAttribute('data-slot'), 'example');
assert.equal(example.children.length, 2);
assert.equal(example.firstElementChild.tagName, 'DIV');
assert.equal(example.firstElementChild.textContent, 'Basic');
assert.equal(example.lastElementChild.getAttribute('data-slot'), 'example-content');
assert.equal(actualGallery.querySelectorAll('section, h2').length, 0);
assert.equal(example.querySelectorAll('[role="alert"]').length, 3);
assert.equal(example.querySelectorAll('[data-slot="alert-title"]').length, 2);
assert.equal(example.querySelectorAll('[data-slot="alert-description"]').length, 2);
console.log(`Pinned React/Svelte Alert SSR: ${count} native prop/class/variant cases and Basic semantic tree PASS`);

// Authored source-derived whole-gallery witnesses: no ordinary copied Alert suite.
const outputPath = '.checks/alert-gallery-ssr'; mkdirSync(outputPath, { recursive: true });
const records = [];
function record(name, html) {
  writeFileSync(`${outputPath}/${name}.html`, html);
  records.push({ name, bytes: Buffer.byteLength(html), sha256: createHash('sha256').update(html).digest('hex') });
  return new JSDOM(html).window.document.body.firstElementChild;
}
function completeTree(node) {
  // Preserve raw HTML separately. Only whitespace-only framework formatting
  // runs are excluded. Join adjacent text across serialization comments so the
  // original explicit JSX space remains part of its exact untrimmed text run.
  const text = []; let run = '';
  for (const child of node.childNodes) {
    if (child.nodeType === 3) run += child.textContent;
    if (child.nodeType === 1) { if (/\S/u.test(run)) text.push(run); run = ''; }
  }
  if (/\S/u.test(run)) text.push(run);
  return { tag: node.localName, attrs: attributes(node), text, children: [...node.children].map(completeTree) };
}
const coldReact = record('cold-react', renderToString(createElement(AlertGallery)));
const coldNative = record('cold-native', render(GalleryFixture).body);
assert.deepEqual([...coldNative.querySelectorAll('svg')].map(completeTree), [...coldReact.querySelectorAll('svg')].map(completeTree));
assert.equal(coldNative.querySelectorAll('svg.lucide-square').length, 8);
assert.equal(coldReact.querySelectorAll('template').length, 8);
assert.equal(coldNative.querySelectorAll('template').length, 0);
console.log('Eight genuine cold Square SVG trees PASS; React Suspense templates versus native await boundaries remain unaccepted');
async function settled(element, progressiveChunkSize) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough(); let html = '';
    output.on('data', chunk => { html += chunk; }); output.on('end', () => resolve(html)); output.on('error', reject);
    const stream = renderToPipeableStream(element, { progressiveChunkSize, onAllReady() { stream.pipe(output); }, onError: reject });
  });
}
const { loadIcon } = await import(new URL('./data.js', pathToFileURL(createRequire(new URL('../apps/docs/package.json', import.meta.url)).resolve('@sveltery/ui/icons'))));
const names = { lucide: 'CircleAlertIcon', tabler: 'IconExclamationCircle', hugeicons: 'AlertCircleIcon', phosphor: 'WarningCircleIcon', remixicon: 'RiErrorWarningLine' };
for (const [library, name] of Object.entries(names)) {
  // React19.3's default12800-byte heuristic can emit completion segments even
  // after allReady. Retain that real stream separately. For the complete inline
  // document comparison, request an unsegmented allReady stream explicitly.
  record(`default-stream-${library}-react`, await settled(createElement(AlertGallery, { library })));
  const original = record(`settled-${library}-react`, await settled(createElement(AlertGallery, { library }), Number.MAX_SAFE_INTEGER));
  await loadIcon(library, name);
  const native = record(`settled-${library}-native`, render(GalleryFixture, { props: { library } }).body);
  assert.equal(original.querySelectorAll('template').length, 0, 'actual onAllReady output, not stripped cold markup');
  assert.deepEqual(completeTree(native), completeTree(original), library);
  for (const root of [native, original]) {
    const wrapper = root.firstElementChild;
    assert.deepEqual([...wrapper.children].map(node => node.firstElementChild.textContent), ['Basic', 'With Icons', 'Destructive']);
    assert.deepEqual([...wrapper.children].map(node => node.querySelectorAll('[role=alert]').length), [3, 6, 2]);
    assert.equal(root.querySelectorAll('[data-slot=alert-title]').length, 8);
    assert.equal(root.querySelectorAll('[data-slot=alert-description]').length, 8);
    assert.equal(root.querySelectorAll('[data-slot=alert] > svg').length, 8);
    assert.equal(root.querySelectorAll('a[href="#"]').length, 4);
    assert.equal(root.querySelectorAll('.cn-alert-variant-destructive').length, 2);
    assert.deepEqual([...root.querySelectorAll('ul.list-inside.list-disc > li')].map(node => node.textContent), ['Check your card details', 'Ensure sufficient funds', 'Verify billing address']);
    assert.equal([root, ...root.querySelectorAll('*')].filter(node => node.namespaceURI === 'http://www.w3.org/1999/xhtml').length, 50);
  }
  assert.deepEqual([...native.querySelectorAll('[data-slot=alert]')].map(node => node.textContent), [...original.querySelectorAll('[data-slot=alert]')].map(node => node.textContent), `${library}: all raw Alert text including JSX explicit spaces`);
}
writeFileSync(`${outputPath}/receipt.json`, JSON.stringify({ records, originalColdSuspenseTemplates: 8, nativeColdTemplates: 0, settledReferenceProgressiveChunkSize: Number.MAX_SAFE_INTEGER, actualDefaultStreamsRetainedSeparately: true, rawSerializationOrBoundaryEquivalence: false, meaningfulDirectTextUsesTrim: false, adjacentTextAcrossCommentsJoinedWithoutRemovingExplicitSpaces: true, whitespaceOnlyFrameworkFormattingRunsExcludedFromStructuralComparison: true, ordinaryCopiedRuntimeCredit: 0 }, null, 2) + '\n');
console.log('Settled genuine three-body HTML/SVG/text tree: five libraries, 50 HTML hosts / 11 Alerts / 8 titles / 8 descriptions / 8 glyphs PASS');
