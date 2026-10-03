// Source-derived assertions execute the immutable pinned React wrappers.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup, renderToString, renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { prepareIconReference } from './prepare-icon-reference.mjs';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Kbd from '../apps/docs/registry/bases/base/ui/kbd/Kbd.svelte';
import Gallery from '../apps/docs/examples/base/KbdExample.svelte';
import KbdGroup from '../apps/docs/registry/bases/base/ui/kbd/KbdGroup.svelte';
import GalleryFixture from '../apps/docs/examples/base/KbdGalleryFixture.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
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

const scaffoldURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const kbdURL = moduleURL('tests/reference/kbd.tsx', { cn });
await prepareIconReference();
const iconURL = pathToFileURL(resolve('.checks/icons-reference/icon.mjs')).href;
const providerURL = pathToFileURL(resolve('.checks/icons-reference/icons/search-params.mjs')).href;
const selectedURL = moduleURL('tests/reference/kbd-selected-examples.tsx', { './kbd': kbdURL, './example-scaffold': scaffoldURL, './icon': iconURL });
const { KbdGallery } = await import(moduleURL('tests/reference/KbdGallery.tsx', { './kbd': kbdURL, './example-scaffold': scaffoldURL, './kbd-selected-examples': selectedURL, './icons/search-params': providerURL }));
function tree(node) { return { tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])), text: node.children.length ? null : node.textContent, children: [...node.children].map(tree) }; }
const expectedGallery = new JSDOM(renderToStaticMarkup(createElement(KbdGallery))).window.document.body.firstElementChild;
const actualGallery = new JSDOM(render(Gallery).body).window.document.body.firstElementChild;
const oldTitles = ['Basic', 'Modifier Keys', 'KbdGroup', 'Arrow Keys', 'With samp'];
const oldExamples = root => [...root.querySelectorAll('[data-slot=example]')].filter(node => oldTitles.includes(node.firstElementChild.textContent)).map(tree);
assert.deepEqual(oldExamples(actualGallery), oldExamples(expectedGallery));
assert.equal(oldExamples(actualGallery).length, 5);
const retainedAlt = new JSDOM(render(GalleryFixture).body).window.document.querySelector('[data-testid=override]');
const originalAlt = expectedGallery.querySelector('[data-testid=override]');
assert.deepEqual(tree(retainedAlt), tree(originalAlt));
assert.equal(originalAlt.textContent, 'Alt');
console.log('Actual pinned Example scaffold and unchanged selected Kbd functions preserve the paired SSR native tree PASS');

// Keep the genuine cold fallback witness separate: React renderToString emits
// five Suspense templates; Svelte await emits its own comment boundaries. Their
// boundary/API/timing equivalence is NOT accepted or silently normalized away.
const outputPath = '.checks/kbd-gallery-ssr'; mkdirSync(outputPath, { recursive: true });
const records = [];
function record(name, html) {
  writeFileSync(`${outputPath}/${name}.html`, html);
  records.push({ name, bytes: Buffer.byteLength(html), sha256: createHash('sha256').update(html).digest('hex') });
  return new JSDOM(html).window.document;
}
const coldReact = record('cold-react', renderToString(createElement(KbdGallery)));
const coldNative = record('cold-native', render(GalleryFixture).body);
const coldWrapper = document => document.querySelector('[data-slot=example-wrapper]');
assert.deepEqual([...coldWrapper(coldNative).querySelectorAll('svg')].map(tree), [...coldWrapper(coldReact).querySelectorAll('svg')].map(tree));
assert.equal(coldWrapper(coldNative).querySelectorAll('svg.lucide-square').length, 5);
assert.equal(coldWrapper(coldReact).querySelectorAll('template').length, 5);
assert.equal(coldWrapper(coldNative).querySelectorAll('template').length, 0);
console.log('Five genuine cold Square fallback SVG trees PASS; React five Suspense templates versus Svelte await boundaries remain unaccepted');

async function settled(element) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough(); let html = '';
    output.on('data', chunk => { html += chunk; }); output.on('end', () => resolve(html)); output.on('error', reject);
    const stream = renderToPipeableStream(element, { onAllReady() { stream.pipe(output); }, onError: reject });
  });
}
function completeTree(node) {
  // Existing native Example/snippet formatting emits whitespace-only nodes.
  // Preserve full raw HTML separately and compare every meaningful text byte
  // without trim; this is not raw boundary/serialization equivalence.
  return { tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent).filter(text => /\S/u.test(text)), children: [...node.children].map(completeTree) };
}
const { loadIcon } = await import(new URL('./data.js', pathToFileURL(createRequire(new URL('../apps/docs/package.json', import.meta.url)).resolve('@sveltery/ui/icons'))));
const names = {
  lucide: ['CircleDashedIcon', 'ArrowLeftIcon', 'ArrowRightIcon'], tabler: ['IconCircleDashed', 'IconArrowLeft', 'IconArrowRight'], hugeicons: ['DashedLineCircleIcon', 'ArrowLeft01Icon', 'ArrowRight01Icon'], phosphor: ['CircleDashedIcon', 'ArrowLeftIcon', 'ArrowRightIcon'], remixicon: ['RiLoaderLine', 'RiArrowLeftLine', 'RiArrowRightLine'],
};
for (const [library, glyphs] of Object.entries(names)) {
  const original = record(`settled-${library}-react`, await settled(createElement(KbdGallery, { library })));
  await Promise.all(glyphs.map(name => loadIcon(library, name)));
  const native = record(`settled-${library}-native`, render(GalleryFixture, { props: { library } }).body);
  const originalWrapper = coldWrapper(original); const nativeWrapper = coldWrapper(native);
  assert.equal(originalWrapper.querySelectorAll('template').length, 0, 'settled original stream, not stripped cold markup');
  assert.deepEqual(completeTree(nativeWrapper.parentElement), completeTree(originalWrapper.parentElement), library);
  const htmlHosts = root => [root.parentElement, root, ...root.querySelectorAll('*')].filter(node => node.namespaceURI === 'http://www.w3.org/1999/xhtml');
  assert.equal(htmlHosts(nativeWrapper).length, 48); assert.equal(htmlHosts(originalWrapper).length, 48);
  assert.deepEqual([...nativeWrapper.querySelectorAll('kbd')].map(node => node.textContent), [...originalWrapper.querySelectorAll('kbd')].map(node => node.textContent), `${library}: exact raw text of all21 leaves/groups`);
  assert.equal(nativeWrapper.querySelectorAll('kbd').length, 21); assert.equal(nativeWrapper.querySelectorAll('svg').length, 5);
  assert.deepEqual([...nativeWrapper.children].map(node => node.firstElementChild.textContent), ['Basic', 'Modifier Keys', 'KbdGroup', 'Arrow Keys', 'With Icons', 'With Icons and Text', 'With samp']);
  assert.deepEqual([...nativeWrapper.querySelectorAll('[data-slot=kbd]')].slice(15, 17).map(node => node.textContent.trim()), ['Left', 'Voice Enabled']);
}
writeFileSync(`${outputPath}/receipt.json`, JSON.stringify({ records, originalColdSuspenseTemplates: 5, nativeColdTemplates: 0, rawSerializationOrBoundaryEquivalence: false, meaningfulDirectTextUsesTrim: false, whitespaceOnlyFrameworkFormattingNodesExcludedFromStructuralComparison: true, ordinaryCopiedRuntimeCredit: 0 }, null, 2) + '\n');
console.log('Settled genuine server-stream/source-native seven-gallery full HTML/SVG/text tree: all five libraries, 48 HTML hosts/21 kbds/5 glyphs PASS; no cold boundary equivalence claimed');
