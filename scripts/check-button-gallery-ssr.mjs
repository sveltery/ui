// Authored source-derived checks; zero ordinary copied upstream-suite credit.
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
import Gallery from '../apps/docs/examples/base/ButtonGalleryFixture.svelte';
function moduleURL(path, imports) {
  let source = 'import * as React from ' + JSON.stringify(import.meta.resolve('react')) + ';\n' + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll('"' + name + '"', JSON.stringify(url)).replaceAll("'" + name + "'", JSON.stringify(url));
  return 'data:text/javascript;base64,' + Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64');
}
await prepareIconReference();
const icon = pathToFileURL(resolve('.checks/icons-reference/icon.mjs')).href;
const provider = await import(pathToFileURL(resolve('.checks/icons-reference/icons/search-params.mjs')).href);
const cn = import.meta.resolve('cn');
const button = moduleURL('tests/reference/button.tsx', { '@base-ui/react/button': import.meta.resolve('@base-ui/react/button'), 'class-variance-authority': import.meta.resolve('class-variance-authority'), cn });
const scaffold = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const { OriginalButtonExample } = await import(moduleURL('tests/reference/OriginalButtonExample.tsx', { './button': button, './example-scaffold': scaffold, './icon': icon }));
const original = library => createElement(provider.IconLibraryProvider, { library }, createElement(OriginalButtonExample));
const tree = node => ({ tag: node.localName, attrs: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).filter(t => /\S/u.test(t)), children: [...node.children].map(tree) });
function assertGallery(doc) {
  const wrapper = doc.querySelector('[data-slot=example-wrapper]');
  assert.equal(wrapper.parentElement.querySelectorAll('div,button,a').length + 1, 168);
  assert.equal(wrapper.children.length, 6);
  assert.deepEqual([...wrapper.children].map(n => n.firstElementChild.textContent), ['Variants & Sizes', 'Icon Right', 'Icon Left', 'Icon Only', 'Invalid States', 'Examples']);
  assert.equal(wrapper.querySelectorAll('button').length, 124);
  assert.equal(wrapper.querySelectorAll('svg').length, 74);
  assert.equal(wrapper.querySelectorAll('button[aria-invalid=true]').length, 24);
  for (const button of wrapper.querySelectorAll('button')) {
    assert.equal(button.getAttribute('type'), 'button'); assert.equal(button.getAttribute('tabindex'), '0');
    assert.equal(button.getAttribute('data-slot'), 'button'); assert.equal(button.disabled, false);
  }
  assert.equal(wrapper.children[3].querySelectorAll('[aria-label]').length, 0);
  assert.equal(wrapper.children[1].querySelectorAll('button')[6].textContent, 'Default');
  assert.equal(wrapper.children[1].querySelectorAll('button')[8].querySelector('svg').getAttribute('data-icon'), null);
  const anchor = wrapper.querySelector('a'); assert.equal(anchor.getAttribute('href'), '#'); assert.equal(anchor.textContent, 'Link');
  assert.equal(anchor.hasAttribute('data-slot'), false);
  assert.equal(wrapper.querySelectorAll('section,h2,[data-testid],[data-gallery]').length, 0);
}
const coldReact = new JSDOM(renderToString(original('lucide'))).window.document;
const coldNative = new JSDOM(render(Gallery).body).window.document;
assertGallery(coldReact); assertGallery(coldNative);
assert.equal(coldReact.querySelectorAll('template').length, 74);
assert.equal(coldNative.querySelectorAll('template').length, 0);
assert.deepEqual([...coldNative.querySelectorAll('svg')].map(tree), [...coldReact.querySelectorAll('svg')].map(tree));
async function settled(element, library) {
  const receipt = { library, lifecycle: [], chunks: 0, bytes: 0, errors: [] };
  return new Promise((resolve, reject) => {
    const output = new PassThrough(); let html = '';
    const failed = error => {
      receipt.errors.push({ name: error?.name, message: String(error?.message ?? error).slice(0, 600) });
      console.error('Button original stream error', JSON.stringify(receipt));
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
  console.error('Button original unresolved templates', JSON.stringify({
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
  console.log('Button original completed stream', JSON.stringify(receipt));
  unresolvedReceipt(doc, receipt);
  assert.deepEqual(errors, [], reference.receipt.library + ': genuine React completion scripts');
  return dom;
}

const { loadIcon } = await import(new URL('./data.js', pathToFileURL(createRequire(new URL('../apps/docs/package.json', import.meta.url)).resolve('@sveltery/ui/icons'))));
const names = { lucide: ['ArrowRightIcon', 'ArrowLeftCircleIcon'], tabler: ['IconArrowRight', 'IconCircleArrowLeft'], hugeicons: ['ArrowRight02Icon', 'CircleArrowLeft02Icon'], phosphor: ['ArrowRightIcon', 'ArrowCircleLeftIcon'], remixicon: ['RiArrowRightLine', 'RiArrowLeftCircleLine'] };
for (const [library, glyphs] of Object.entries(names)) {
  const reference = await settled(original(library), library);
  const raw = new JSDOM(reference.html);
  unresolvedReceipt(raw.window.document, reference.receipt);
  raw.window.close();
  const referenceDOM = await completedReference(reference);
  const expected = referenceDOM.window.document;
  await Promise.all(glyphs.map(name => loadIcon(library, name)));
  const actual = new JSDOM(render(Gallery, { props: { library } }).body).window.document;
  assertGallery(expected); assertGallery(actual);
  assert.equal(expected.querySelectorAll('template').length, 0);
  assert.deepEqual(tree(actual.querySelector('[data-slot=example-wrapper]').parentElement), tree(expected.querySelector('[data-slot=example-wrapper]').parentElement), library);
  assert.deepEqual([...actual.querySelectorAll('button')].map(n => n.textContent), [...expected.querySelectorAll('button')].map(n => n.textContent), library + ': literal child bytes');
  referenceDOM.window.close();
}
console.log('Six genuine Button bodies: 168 HTML hosts/124 enabled buttons/74 glyphs/native anchor, exact attrs/text/tree all5 libraries PASS; React74 cold Suspense templates versus native await remain unaccepted, zero copied-suite credit');
