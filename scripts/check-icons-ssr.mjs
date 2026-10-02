// Source-derived SSR assertions; none are copies of an upstream icon runtime test inventory.
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { prepareIconReference } from './prepare-icon-reference.mjs';
import IconSvg from '../apps/docs/examples/icons/IconSvg.svelte';
import Fixture from '../apps/docs/examples/icons/IconsProbe.svelte';
const { IconPlaceholder } = await prepareIconReference();
const { loadLibrary } = await import(pathToFileURL(resolve('.checks/icons-reference/icons/load-library.mjs')));
const { HugeiconsIcon } = await import(import.meta.resolve('@hugeicons/react'));
const documentFor = html => new JSDOM(html).window.document;
const tree = element => ({ tag: element.localName, attrs: Object.fromEntries([...element.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: element.children.length ? undefined : element.textContent, nodes: [...element.children].map(tree) });
const names = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
const expectedFallback = documentFor(renderToString(createElement(IconPlaceholder, { ...names, 'data-testid': 'selected-icon', strokeWidth: 7 }))).querySelector('svg');
const actualFallback = documentFor(render(Fixture).body).querySelector('svg');
assert.deepEqual(tree(actualFallback), tree(expectedFallback), 'fresh SSR preserves genuine pinned Square suspension fallback, including unconsumed strokeWidth');
assert.equal(actualFallback.getAttribute('stroke-width'), '7');
let count = 0;
for (const library of ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']) {
  const reference = await loadLibrary(library);
  const data = JSON.parse(readFileSync(`apps/docs/examples/icons/data/${library}.json`, 'utf8'));
  for (const [name, iconData] of Object.entries(data)) {
    const attributes = {};
    const actual = documentFor(render(IconSvg, { props: { data: iconData, library, attributes } }).body).querySelector('svg');
    const expected = documentFor(renderToStaticMarkup(createElement(library === 'hugeicons' ? HugeiconsIcon : reference[name], library === 'hugeicons' ? { icon: reference[name], strokeWidth: 2 } : {}))).querySelector('svg');
    assert.deepEqual(tree(actual), tree(expected), `${library}/${name}`); count++;
  }
}
const hugeData = JSON.parse(readFileSync('apps/docs/examples/icons/data/hugeicons.json', 'utf8'));
const localHuge = documentFor(render(IconSvg, { props: { data: hugeData.ArrowLeft01Icon, library: 'hugeicons', attributes: {} } }).body).querySelector('svg');
assert.equal(localHuge.getAttribute('class'), '', 'genuine Hugeicons explicit empty class retained through SVG SSR');
console.log(`Configurable icons SSR: genuine Square fallback and ${count} actual glyphs PASS; default Hugeicons empty class preserved`);
