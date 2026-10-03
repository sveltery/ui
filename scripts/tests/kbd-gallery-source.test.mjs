// Authored original-source composition guards, not copied ordinary shadcn tests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const names = ['KbdBasic', 'KbdModifierKeys', 'KbdGroupExample', 'KbdArrowKeys', 'KbdWithIcons', 'KbdWithIconsAndText', 'KbdWithSamp'];
const original = readFileSync('tests/reference/kbd-example.tsx', 'utf8');
const selected = readFileSync('tests/reference/kbd-selected-examples.tsx', 'utf8');
const native = readFileSync('apps/docs/examples/base/KbdExample.svelte', 'utf8');
const normalize = source => source.replace(/\s+/gu, ' ').trim();
function body(name) {
  const start = original.indexOf(`function ${name}()`);
  const end = original.indexOf('\nfunction ', start + 1);
  assert(start >= 0);
  return original.slice(start, end < 0 ? undefined : end).trimEnd();
}
test('seven selected reference functions retain complete original bodies and real IconPlaceholder imports', () => {
  for (const name of names) assert(selected.includes(body(name)), `${name}: complete immutable original body missing`);
  assert(selected.includes("from './icon'"));
  const gallery = readFileSync('tests/reference/KbdGallery.tsx', 'utf8');
  assert(gallery.includes('<ExampleWrapper>'));
  assert.deepEqual([...gallery.matchAll(/<(Kbd\w+) \/>/gu)].map(match => match[1]), names);
  assert(!gallery.slice(gallery.indexOf('<ExampleWrapper>'), gallery.indexOf('</ExampleWrapper>')).includes('data-testid'));
});
test('seven native named snippets preserve original bodies, all five names per glyph and genuine helper invocation', () => {
  for (const name of names) {
    const match = native.match(new RegExp(`\\{#snippet ${name}\\(\\)\\}([\\s\\S]*?)\\{/snippet\\}`, 'u'));
    assert(match, `${name}: named original function translation missing`);
    const jsx = body(name).match(/return \(\n([\s\S]*?)\n  \)/u)[1].replaceAll('className=', 'class=');
    assert.equal(normalize(match[1]), normalize(jsx), name);
  }
  assert(native.includes("import { Example, ExampleWrapper } from '@sveltery/ui/example'"));
  assert(native.includes("import { IconPlaceholder } from '@sveltery/ui/icons'"));
  assert.deepEqual([...native.matchAll(/\{@render (Kbd\w+)\(\)\}/gu)].map(match => match[1]), names);
  assert(native.includes('<ExampleWrapper>'));
  assert(!native.includes('data-gallery')); assert(!native.includes('data-testid')); assert(!native.includes('{#each'));
});
test('real Kbd gallery has an independent complete-original-CSS route and both fresh icon import remaps', () => {
  const reference = readFileSync('tests/reference/themes/reference-app/main.tsx', 'utf8');
  assert(reference.includes("window.location.pathname === '/kbd'"));
  assert(reference.includes('<KbdGallery library='));
  const install = readFileSync('scripts/check-installation.mjs', 'utf8');
  for (const fixture of ['kbdFixture', 'kbdExample']) assert(install.includes(`${fixture} = ${fixture}.replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons')`), `${fixture}: source-copy icon remap missing`);
  assert(readFileSync('scripts/installation-playwright.config.ts', 'utf8').includes("'**/kbd.spec.ts'"));
});
