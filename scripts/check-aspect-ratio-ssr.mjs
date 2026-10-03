// Bounded source-derived SSR comparisons, not copied upstream tests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import { transpileModule, ModuleKind, ScriptTarget, JsxEmit } from 'typescript';
import { AspectRatio } from '../apps/docs/registry/bases/base/ui/aspect-ratio/index.js';
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
