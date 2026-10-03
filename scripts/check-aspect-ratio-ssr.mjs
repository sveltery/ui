// Bounded source-derived SSR comparisons, not copied upstream tests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { AspectRatio } from '../apps/docs/registry/bases/base/ui/aspect-ratio/index.js';
import AspectRatioExample from '../apps/docs/examples/base/AspectRatioExample.svelte';
function moduleURL(path, imports) {
  let source = readFileSync(path, 'utf8');
  for (const [name, url] of Object.entries(imports)) source = source.replaceAll(`"${name}"`, JSON.stringify(url)).replaceAll(`'${name}'`, JSON.stringify(url));
  const js = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext, jsx: JsxEmit.ReactJSX } }).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve('react/jsx-runtime')));
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const cn = import.meta.resolve('cn');
const { AspectRatio: Reference } = await import(moduleURL('tests/reference/aspect-ratio.tsx', { cn }));
const attributes = node => Object.fromEntries([...node.attributes].filter(attr => attr.name !== 'style').map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b)));
const cases = [
  ...[16 / 9, 21 / 9, 1, 9 / 16, 0, -1].map(ratio => ({ ratio })),
  { ratio: 2, className: 'static aspect-square', id: 'ratio', title: 'Photo & <draft>', 'data-slot': 'custom' },
  { ratio: 2, 'data-slot': undefined }, { ratio: 2, 'data-slot': null },
  { ratio: 2, style: { color: 'red' }, css: 'color: red;' },
  { ratio: 2, style: { '--ratio': 3 }, css: '--ratio: 3;' },
  { ratio: 2, style: { aspectRatio: '4 / 3' }, css: 'aspect-ratio: 4 / 3;' },
  { ratio: 2, style: undefined, css: undefined }, { ratio: 2, style: null, css: null }, { ratio: 2, style: {}, css: '' },
];
for (const { css, ...props } of cases) {
  const { className: classProp, ...rest } = props;
  const expected = new JSDOM(renderToStaticMarkup(createElement(Reference, props))).window.document.querySelector('div');
  const actual = new JSDOM(render(AspectRatio, { props: { ...rest, class: classProp, ...('style' in props ? { style: css } : {}) } }).body).window.document.querySelector('div');
  assert.deepEqual(attributes(actual), attributes(expected)); assert.equal(actual.style.cssText, expected.style.cssText);
  assert.equal(actual.hasAttribute('style'), expected.hasAttribute('style')); assert.equal(actual.hasAttribute('ratio'), false);
}
console.log(`Pinned React/Svelte AspectRatio SSR: ${cases.length} host/class/prop/style precedence cases PASS`);

// Independently execute the complete immutable gallery and helper. Only the
// already recorded Next Image -> native img fill model is substituted here.
const imageSource = `import { createElement } from ${JSON.stringify(import.meta.resolve('react'))}; export default function Image({ fill, style, ...props }) { return createElement('img', { ...props, style: { ...(fill ? { position: 'absolute', inset: 0 } : {}), ...style } }); }`;
const imageURL = `data:text/javascript;base64,${Buffer.from(imageSource).toString('base64')}`;
const exampleURL = moduleURL('tests/reference/example-scaffold.tsx', { cn });
const referenceGalleryURL = moduleURL('tests/reference/aspect-ratio-example.tsx', {
  'next/image': imageURL,
  '@/registry/bases/base/components/example': exampleURL,
  '@/registry/bases/base/ui/aspect-ratio': moduleURL('tests/reference/aspect-ratio.tsx', { cn }),
});
const { default: OriginalGallery } = await import(referenceGalleryURL);
const originalDOM = new JSDOM(renderToStaticMarkup(createElement(OriginalGallery))).window.document;
const nativeDOM = new JSDOM(render(AspectRatioExample).body).window.document;
const originalShell = originalDOM.querySelector('[data-slot="example-wrapper"]')?.parentElement;
const nativeShell = nativeDOM.querySelector('[data-slot="example-wrapper"]')?.parentElement;
assert(originalShell); assert(nativeShell, 'gallery must render genuine ExampleWrapper, not a section/grid substitute');
const tree = node => ({
  tag: node.tagName,
  attributes: attributes(node),
  style: node.style.cssText,
  text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent.trim()).filter(Boolean),
  children: [...node.children].map(tree),
});
assert.deepEqual(tree(nativeShell), tree(originalShell));
assert.equal(1 + originalShell.querySelectorAll('*').length, 22);
assert.equal(1 + nativeShell.querySelectorAll('*').length, 22);
assert.deepEqual([...nativeShell.querySelectorAll('[data-slot="example"]')].map(node => node.firstElementChild.textContent), ['16:9', '21:9', '1:1', '9:16']);
console.log('Complete immutable original AspectRatio gallery/Example SSR: all 22 native HTML hosts, literal attributes/classes/text/ratio/style/order PASS (native-img fill model; Next API remains incomplete)');
