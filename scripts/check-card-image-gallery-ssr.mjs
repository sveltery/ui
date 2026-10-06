// Authored genuine-source runtime supplement; zero ordinary upstream-suite credit.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToString, renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { prepareIconReference } from './prepare-icon-reference.mjs';
import { render } from 'svelte/server';
import { JSDOM, VirtualConsole } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import Gallery from '../apps/docs/examples/base/CardImageGalleryFixture.svelte';
function moduleURL(path, imports) {
  let source = 'import * as React from ' + JSON.stringify(import.meta.resolve('react')) + ';\n' + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll('"' + name + '"', JSON.stringify(url)).replaceAll("'" + name + "'", JSON.stringify(url));
  return 'data:text/javascript;base64,' + Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64');
}
await prepareIconReference();
const icon = pathToFileURL(resolve('.checks/icons-reference/icon.mjs')).href;
const provider = pathToFileURL(resolve('.checks/icons-reference/icons/search-params.mjs')).href;
const cn = import.meta.resolve('cn');
const card = moduleURL('tests/reference/card.tsx', { react: import.meta.resolve('react'), cn });
const button = moduleURL('tests/reference/button.tsx', { '@base-ui/react/button': import.meta.resolve('@base-ui/react/button'), 'class-variance-authority': import.meta.resolve('class-variance-authority'), cn });
const scaffold = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const selected = moduleURL('tests/reference/card-image-selected-examples.tsx', { './card': card, './button': button, './example-scaffold': scaffold, './icon': icon });
const { CardImageGallery } = await import(moduleURL('tests/reference/CardImageGallery.tsx', { react: import.meta.resolve('react'), './example-scaffold': scaffold, './card-image-selected-examples': selected, './icons/search-params': provider }));
const original = library => createElement(CardImageGallery, { library });
function directText(node) {
  let slot = 0; const result = [];
  for (const child of node.childNodes) {
    if (child.nodeType === 1) slot++;
    else if (child.nodeType === 3 && (/\S/u.test(child.nodeValue) || node.localName === 'button')) result.push([slot, child.nodeValue]);
  }
  return result;
}
const tree = node => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), text: directText(node), children: [...node.children].map(tree) });
const wrapperOf = doc => doc.querySelector('[data-slot=example-wrapper]');
function assertGallery(doc, phase = 'settled') {
  assert(['cold-original', 'settled'].includes(phase), 'Unknown Card image SSR phase');
  const w = wrapperOf(doc); assert(w); assert.equal(w.children.length, 2);
  assert.deepEqual([...w.children].map(n => n.firstElementChild.textContent), ['With Image', 'With Image (Small)']);
  const cards = [...w.querySelectorAll('[data-slot=card]')]; assert.equal(cards.length, 2);
  assert.deepEqual(cards.map(n => n.getAttribute('data-size')), ['default', 'sm']);
  for (const card of cards) {
    assert.deepEqual([...card.children].map(n => n.localName), ['div', 'img', 'div', 'div']);
    assert.equal(card.children[0].className, 'absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color');
    assert.equal(card.children[1].matches(':first-child,:last-child'), false);
    const button = card.querySelector('button'); assert(button);
    assert.equal(button.getAttribute('type'), 'button'); assert.equal(button.getAttribute('tabindex'), '0'); assert.equal(button.disabled, false);
    assert.deepEqual([...button.children].map(node => node.localName), phase === 'cold-original' ? ['template', 'svg'] : ['svg']);
    assert.deepEqual(directText(button), [[phase === 'cold-original' ? 2 : 1, 'Button']]);
    assert.equal(button.querySelector('svg').getAttribute('data-icon'), 'inline-start');
  }
  assert.equal(w.querySelectorAll('img').length, 2); assert.equal(w.querySelectorAll('button').length, 2); assert.equal(w.querySelectorAll('svg').length, 2);
  assert.equal(w.querySelectorAll('section,h2,[data-supplemental],[data-testid]').length, 0);
}
const coldReactDOM = new JSDOM(renderToString(original('lucide')));
const coldNativeDOM = new JSDOM(render(Gallery).body);
assertGallery(coldReactDOM.window.document, 'cold-original'); assertGallery(coldNativeDOM.window.document);
assert.equal(coldReactDOM.window.document.querySelectorAll('template').length, 2); assert.equal(coldNativeDOM.window.document.querySelectorAll('template').length, 0);
console.log('Card images cold React2 templates/native0: inherited Suspense/await API limit remains unaccepted');
coldReactDOM.window.close(); coldNativeDOM.window.close();
async function settled(element, library) {
  const receipt = { library, lifecycle: [], chunks: 0, bytes: 0, errors: [] };
  return new Promise((resolve, reject) => {
    const output = new PassThrough(); let html = '';
    const failed = error => {
      receipt.errors.push({ name: error?.name, message: String(error?.message ?? error).slice(0, 600) });
      console.error('Card image original stream error', JSON.stringify(receipt));
      reject(error);
    };
    output.on('data', chunk => { html += chunk; receipt.chunks++; receipt.bytes += chunk.length; });
    output.on('finish', () => receipt.lifecycle.push('writable-finish'));
    output.on('end', () => {
      receipt.lifecycle.push('readable-end');
      receipt.sha256 = createHash('sha256').update(html).digest('hex');
      resolve({ html, receipt });
    });
    output.on('error', failed);
    const stream = renderToPipeableStream(element, {
      onShellReady() { receipt.lifecycle.push('shell-ready'); },
      onAllReady() { receipt.lifecycle.push('all-ready'); stream.pipe(output); },
      onShellError(error) { receipt.lifecycle.push('shell-error'); failed(error); },
      onError(error) { receipt.lifecycle.push('render-error'); failed(error); },
    });
  });
}

function unresolvedReceipt(doc, receipt) {
  const templates = [...doc.querySelectorAll('template')];
  if (!templates.length) return;
  console.error('Card image original unresolved templates', JSON.stringify({
    ...receipt, templates: templates.length,
    examples: templates.slice(0, 2).map(node => ({
      attrs: [...node.attributes].map(attr => [attr.name, attr.value.slice(0, 300)]),
      parent: { tag: node.parentElement.localName, class: node.parentElement.getAttribute('class'), text: node.parentElement.textContent.slice(0, 120) },
      next: node.nextElementSibling?.outerHTML.slice(0, 600),
    })),
    glyphClasses: [...new Set([...doc.querySelectorAll('svg')].map(node => node.getAttribute('class')))],
  }));
}
async function completedReference(reference) {
  // Execute the renderer's own inline completion scripts; never remove templates or manufacture glyphs.
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push({ name: error.name, message: error.message }));
  const dom = new JSDOM(reference.html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  const doc = dom.window.document;
  const deadline = Date.now() + 5000;
  while (doc.querySelector('template') && !errors.length && Date.now() < deadline) {
    await new Promise(resolve => dom.window.setTimeout(resolve, 10));
  }
  const receipt = { ...reference.receipt, rawTemplates: (reference.html.match(/<template\b/gu) ?? []).length,
    completionScripts: [...doc.scripts].length, settledTemplates: doc.querySelectorAll('template').length, completionErrors: errors };
  console.log('Card image original completed stream', JSON.stringify(receipt));
  unresolvedReceipt(doc, receipt);
  if (errors.length) dom.window.close();
  assert.deepEqual(errors, [], reference.receipt.library + ': genuine React completion scripts');
  return dom;
}

const { loadIcon } = await import(new URL('./data.js', pathToFileURL(createRequire(new URL('../apps/docs/package.json', import.meta.url)).resolve('@sveltery/ui/icons'))));
const names = { lucide: 'PlusIcon', tabler: 'IconPlus', hugeicons: 'Add01Icon', phosphor: 'PlusIcon', remixicon: 'RiAddLine' };
for (const [library, name] of Object.entries(names)) {
  const reference = await settled(original(library), library);
  const referenceDOM = await completedReference(reference); let actualDOM;
  try {
    await loadIcon(library, name);
    actualDOM = new JSDOM(render(Gallery, { props: { library } }).body);
    const expected = referenceDOM.window.document; const actual = actualDOM.window.document;
    assertGallery(expected); assertGallery(actual);
    assert.equal(expected.querySelectorAll('template').length, 0);
    assert.deepEqual(tree(wrapperOf(actual).parentElement), tree(wrapperOf(expected).parentElement), library + ': full genuine tree, attributes, individual nonblank Text bytes and positions');
    const hosts = wrapperOf(expected).parentElement.querySelectorAll('*');
    const htmlHosts = [...hosts].filter(n => n.namespaceURI === 'http://www.w3.org/1999/xhtml').length + 1;
    assert.equal([...wrapperOf(actual).parentElement.querySelectorAll('*')].filter(n => n.namespaceURI === 'http://www.w3.org/1999/xhtml').length + 1, htmlHosts);
    console.log('Card image genuine React-derived SSR', JSON.stringify({ library, htmlHosts, allHosts: hosts.length + 1, buttons: 2, images: 2, glyphs: 2, tree: 'PASS', ordinaryCopiedCredit: 0 }));
  } finally { actualDOM?.window.close(); referenceDOM.window.close(); }
}
console.log('Two genuine native-img Card galleries all5 settled original libraries/full SSR tree/individual Text nodes PASS; actual remote-image decode is a separate secured browser gate');
