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
