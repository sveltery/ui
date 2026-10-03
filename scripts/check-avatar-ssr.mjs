// Authored source-derived checks; no dedicated ordinary shadcn Avatar suite exists.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { prepareIconReference } from './prepare-icon-reference.mjs';
import * as Local from '../apps/docs/registry/bases/base/ui/avatar/index.js';
import Gallery from '../apps/docs/examples/base/AvatarExample.svelte';
function moduleURL(path, imports) {
  let source = `import * as React from ${JSON.stringify(import.meta.resolve('react'))};\n` + readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.React } }).outputText).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const avatarURL = moduleURL('tests/reference/avatar.tsx', { '@base-ui/react/avatar': import.meta.resolve('@base-ui/react/avatar'), cn });
const Reference = await import(avatarURL);
const documentFor = html => new JSDOM(html).window.document;
const tree = node => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), children: [...node.childNodes].flatMap(child => child.nodeType === 1 ? [tree(child)] : child.nodeType === 3 && child.textContent.trim() ? [child.textContent.replace(/\s+/gu, ' ').trim()] : []) });
let count = 0;
for (const name of ['Avatar', 'AvatarBadge', 'AvatarGroup', 'AvatarGroupCount']) {
  for (const props of [{}, { className: 'size-12 rounded-none', 'data-slot': 'caller', title: 'Avatar & <draft>' }, { 'data-slot': undefined }, { 'data-slot': null }, ...(name === 'Avatar' ? [{ size: 'sm' }, { size: 'lg' }, { size: undefined }, { size: null }, { size: 'sm', 'data-size': 'caller' }, { size: 'sm', 'data-size': undefined }, { size: 'sm', 'data-size': null }, { className: () => 'ignored-callback' }] : [])]) {
    const expected = documentFor(renderToStaticMarkup(createElement(Reference[name], props))).body.firstElementChild;
    const { className, ...rest } = props;
    const actual = documentFor(render(Local[name], { props: { ...rest, class: className } }).body).body.firstElementChild;
    assert.deepEqual(tree(actual), tree(expected), `${name}: ${JSON.stringify(props)}`);
    assert.equal(actual.hasAttribute('ref'), false); assert.equal(actual.hasAttribute('size'), false); count++;
  }
}
await prepareIconReference();
const exampleURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const buttonURL = moduleURL('tests/reference/button.tsx', { '@base-ui/react/button': import.meta.resolve('@base-ui/react/button'), 'class-variance-authority': import.meta.resolve('class-variance-authority'), cn });
const emptyURL = moduleURL('tests/reference/empty.tsx', { 'class-variance-authority': import.meta.resolve('class-variance-authority'), cn });
const iconURL = new URL('../.checks/icons-reference/icon.mjs', import.meta.url).href;
const { default: OriginalGallery } = await import(moduleURL('tests/reference/avatar-selected-examples.tsx', { './avatar': avatarURL, './button': buttonURL, './empty': emptyURL, './example-scaffold': exampleURL, './icon': iconURL }));
const original = documentFor(renderToStaticMarkup(createElement(OriginalGallery))).querySelector('[data-slot="example-wrapper"]').parentElement;
const native = documentFor(render(Gallery).body).querySelector('[data-slot="example-wrapper"]').parentElement;
assert.deepEqual(tree(native), tree(original), 'all seven genuine gallery functions, real Example/Button/Empty/icon suspension tree');
const slotCounts = slot => native.querySelectorAll(`[data-slot="${slot}"]`).length;
assert.equal(slotCounts('avatar'), 48); assert.equal(slotCounts('avatar-fallback'), 48); assert.equal(slotCounts('avatar-image'), 0);
assert.equal(slotCounts('avatar-badge'), 12); assert.equal(slotCounts('avatar-group'), 10); assert.equal(slotCounts('avatar-group-count'), 7);
assert.equal(slotCounts('example'), 7); assert.equal(slotCounts('example-content'), 7);
const htmlHosts = [...original.querySelectorAll('*')].filter(node => node.namespaceURI === 'http://www.w3.org/1999/xhtml').length + 1;
assert.equal(htmlHosts, 161, 'independently derived original initial-fallback HTML host inventory');
const hosts = original.querySelectorAll('*').length + 1;
assert.equal(native.querySelectorAll('*').length + 1, hosts);
console.log(`Pinned Avatar SSR: ${count} wrapper/default/spread/static-cn cases; seven genuine complete fallback-state gallery trees, ${hosts} actual original hosts (${htmlHosts} HTML), 48 Avatar/48 fallback/0 image, 12 badges/10 groups/7 counts PASS (authored supplements)`);
