import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import test from 'node:test';

// Compile the actual production entry, independently of a paired React fixture.
const require = createRequire(import.meta.resolve('@tailwindcss/vite'));
const { compile } = await import(require.resolve('@tailwindcss/node'));
const candidates = ['data-horizontal:h-px', 'data-horizontal:w-full', 'data-vertical:w-px', 'data-vertical:self-stretch'];
// verify.sh runs provenance checks before packaging; resolve only the three
// actual packaged CSS assets to their canonical source-copy counterparts.
const sourceAssets = {
  '@sveltery/ui/themes.css': 'apps/docs/registry/styles/themes.css',
  '@sveltery/ui/nova.css': 'apps/docs/registry/styles/style-nova.css',
  '@sveltery/ui/styles.css': 'apps/docs/registry/styles/styles.css',
};
const build = async source => (await compile(source, {
  base: process.cwd(), onDependency() {},
  customCssResolver(name) { return sourceAssets[name] ? resolve(sourceAssets[name]) : undefined; },
})).build(candidates);
const expectOrientationMapping = css => {
  assert(css.includes('&:where([data-orientation="horizontal"])'), 'Genuine horizontal custom variant must target the actual Base orientation attribute');
  assert(css.includes('&:where([data-orientation="vertical"])'), 'Genuine vertical custom variant must target the actual Base orientation attribute');
  assert(!css.includes('&[data-horizontal]'), 'A missing support stylesheet must not fall back to Tailwind attribute-presence selectors');
  assert(!css.includes('&[data-vertical]'), 'Vertical must use the original custom variant as well');
};

test('the complete original shadcn support CSS maps unchanged Separator utilities to Base attributes', async () => {
  const original = readFileSync('tests/reference/themes/upstream/shadcn-tailwind.css', 'utf8');
  expectOrientationMapping(await build(`@import "tailwindcss";\n${original}`));
});

test('the actual production CSS entry supplies that same original orientation mapping', async () => {
  expectOrientationMapping(await build('@import "./apps/docs/src/lib/theme.css";'));
});

test('compiled scoped resets preserve the original universal specificity and genuine preflight order', async () => {
  const { default: postcss } = await import(createRequire(import.meta.resolve('vite')).resolve('postcss'));
  const { parse } = postcss;
  const original = parse(await build('@import "./tests/reference/themes/reference-app/reference.css";'));
  const production = parse(await build('@import "./apps/docs/src/lib/theme.css";'));
  // Compare actual compiled nodes, including conditional fallback declarations.
  const shape = node => {
    if (node.type === 'comment') return null;
    if (node.type === 'decl') return { type: node.type, prop: node.prop, value: node.value, important: Boolean(node.important) };
    return {
      type: node.type,
      ...(node.type === 'atrule' ? { name: node.name, params: node.params } : { selector: node.selector }),
      nodes: (node.nodes ?? []).map(shape).filter(Boolean),
    };
  };
  const baseRules = root => {
    const result = [];
    let order = 0;
    root.walkAtRules('apply', () => assert.fail('Only real completed Tailwind compilation is evidence'));
    root.walkRules(rule => {
      const index = order++;
      let layer = rule.parent;
      while (layer && !(layer.type === 'atrule' && layer.name === 'layer')) layer = layer.parent;
      if (layer?.params === 'base') result.push({ rule, index });
    });
    return result;
  };
  const originalRules = baseRules(original);
  const productionRules = baseRules(production);
  const resets = originalRules.filter(({ rule }) => rule.selector === '*' && rule.nodes.some(node => node.type === 'decl' && node.prop === 'outline-color'));
  assert.equal(resets.length, 1, 'The complete immutable reference must compile its genuine universal reset');
  const originalReset = resets[0].rule.nodes.map(shape).filter(Boolean);
  assert(originalReset.some(node => node.type === 'decl' && node.prop === 'border-color'), 'Universal border reset must be present');
  assert(originalReset.some(node => node.type === 'decl' && node.prop === 'outline-color' && node.value.includes('var(--ring)')), 'Universal original ring reset must be present');
  const preflight = parse(readFileSync(createRequire(import.meta.url).resolve('tailwindcss/preflight.css'), 'utf8'));
  const genuineFocus = [];
  preflight.walkRules(':-moz-focusring', rule => genuineFocus.push(rule.nodes.map(shape).filter(Boolean)));
  assert.deepEqual(genuineFocus, [[{ type: 'decl', prop: 'outline', value: 'auto', important: false }]], 'Retain the actual package preflight shorthand');
  const referenceFocus = originalRules.filter(({ rule }) => rule.selector === ':-moz-focusring');
  const productionFocus = productionRules.filter(({ rule }) => rule.selector === ':-moz-focusring');
  assert.equal(referenceFocus.length, 1);
  assert.equal(productionFocus.length, 1);
  assert.deepEqual(referenceFocus[0].rule.nodes.map(shape).filter(Boolean), genuineFocus[0]);
  assert.deepEqual(productionFocus[0].rule.nodes.map(shape).filter(Boolean), genuineFocus[0]);
  assert(referenceFocus[0].index < resets[0].index, 'Original preflight precedes its later universal reset');
  const names = [...readFileSync('tests/reference/themes/upstream/styles.tsx.source', 'utf8').matchAll(/^ {4}name: "([^"]+)",$/gmu)].map(match => match[1]);
  assert.equal(names.length, 8);
  for (const name of names) {
    const selector = `:where(.style-${name}) *`; // The carrier and universal both have specificity zero.
    const scoped = productionRules.filter(({ rule }) => rule.selector === selector);
    assert.equal(scoped.length, 1, `${name}: require the actual compiled scoped reset`);
    assert.deepEqual(scoped[0].rule.nodes.map(shape).filter(Boolean), originalReset, `${name}: all original reset declarations remain exact`);
    assert(productionFocus[0].index < scoped[0].index, `${name}: genuine preflight remains before the reset`);
    assert(!productionRules.some(({ rule }) => rule.selector === `.style-${name} *`), `${name}: do not raise original universal specificity`);
  }
});
