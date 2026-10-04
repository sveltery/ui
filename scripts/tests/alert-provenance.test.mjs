import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable Alert wrapper, complete examples and scoped Nova retain byte-exact provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/alert-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc'); assert.equal(pin.files.length, 3);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert.equal(pin.files[2].range, '19-42 (Alert section only)');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/alert-nova.css', 'utf8').trimEnd()));
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});
test('three selected Alert functions are byte-exact and compose genuine helpers; Actions stays deferred', () => {
  const source = readFileSync('tests/reference/alert-example.tsx', 'utf8');
  const gallery = readFileSync('tests/reference/AlertGallery.tsx', 'utf8');
  const identities = [
    [1, 653, '06232817198d3f9553279ec9fda846b7b35eeacaf1d72db3fb3af81292b370b1'],
    [2, 3589, 'e2731215c20a22c0c560b8823903eaf6d72cd2cd658114f56542ee4f4da364b8'],
    [3, 1412, '6e92ff01891e856e57973f00fcdb1b14d5a9cbb38f1daae6e8e2e5b33b71753e'],
  ];
  for (const [number, bytes, sha256] of identities) {
    const selected = source.slice(source.indexOf(`function AlertExample${number}()`), source.indexOf(`function AlertExample${number + 1}()`)).trimEnd();
    assert.equal(Buffer.byteLength(selected), bytes);
    assert.equal(createHash('sha256').update(selected).digest('hex'), sha256);
    assert(gallery.includes(selected), `original AlertExample${number} body is required`);
  }
  assert.match(gallery, /import \{ Example, ExampleWrapper \} from '\.\/example-scaffold';/);
  assert(!gallery.includes('function Example('), 'a handmade reference helper cannot establish original composition');
  assert.match(gallery, /import \{ IconPlaceholder \} from '\.\/icon';/);
  assert.match(gallery, /<ExampleWrapper className="lg:grid-cols-1" data-alert-gallery data-hydrated=\{hydrated\}><AlertExample1 \/><AlertExample2 \/><AlertExample3 \/><\/ExampleWrapper>/);
  const local = readFileSync('apps/docs/examples/base/AlertExample.svelte', 'utf8');
  assert.match(local, /import \{ Example, ExampleWrapper \} from '@sveltery\/ui\/example';/);
  assert.match(local, /<ExampleWrapper class="lg:grid-cols-1" data-alert-gallery="true" data-hydrated=\{hydrated\}>/);
  assert.match(local, /<Example title="Basic">/);
  assert.match(local, /import \{ IconPlaceholder \} from '@sveltery\/ui\/icons';/);
  assert.match(local, /\{@render AlertExample1\(\)\}\s*\{@render AlertExample2\(\)\}\s*\{@render AlertExample3\(\)\}/);
  for (const [title, roots, titles, descriptions, icons] of [['Basic', 3, 2, 2, 0], ['With Icons', 6, 4, 4, 6], ['Destructive', 2, 2, 2, 2]]) {
    const body = local.slice(local.indexOf(`<Example title="${title}">`), local.indexOf('</Example>', local.indexOf(`<Example title="${title}">`)));
    assert.equal((body.match(/<Alert(?:\s[^>]*|)>/g) ?? []).length, roots, title);
    assert.equal((body.match(/<AlertTitle>/g) ?? []).length, titles, title);
    assert.equal((body.match(/<AlertDescription>/g) ?? []).length, descriptions, title);
    assert.equal((body.match(/<IconPlaceholder\b/g) ?? []).length, icons, title);
    assert(body.includes('mx-auto flex w-full max-w-lg flex-col gap-4'), title);
  }
  for (const [library, name] of Object.entries({ lucide: 'CircleAlertIcon', tabler: 'IconExclamationCircle', hugeicons: 'AlertCircleIcon', phosphor: 'WarningCircleIcon', remixicon: 'RiErrorWarningLine' })) assert.equal((local.match(new RegExp(`${library}="${name}"`, 'g')) ?? []).length, 8, library);
  assert.equal((local.match(/<a href="#">/g) ?? []).length, 4);
  assert.equal((local.match(/<Alert variant="destructive">/g) ?? []).length, 2);
  assert.match(local, /<ul class="list-inside list-disc">/);
  assert(!/<svg\b/.test(local), 'gallery icons must compose the canonical configurable helper');
  assert(!/<(?:section|h2)\b/.test(local), 'original scaffold hosts are native divs, not section/h2 substitutes');
  for (const deferred of ['AlertExample4', 'Badge', 'With Actions']) { assert(!gallery.includes(deferred)); assert(!local.includes(deferred)); }
  assert(source.includes('import { Badge }')); assert(source.includes('import { IconPlaceholder }'));
});
test('genuine Alert gallery reaches complete original CSS and actual source-copy icon delivery', () => {
  const originalApp = readFileSync('tests/reference/themes/reference-app/main.tsx', 'utf8');
  assert(originalApp.includes("import { AlertGallery } from '../../AlertGallery';"));
  assert(originalApp.includes("const alertDiagnostic = window.location.pathname === '/alert';"));
  assert(originalApp.includes("alertDiagnostic ? <AlertGallery library={library ?? 'lucide'} />"));
  const css = readFileSync('tests/reference/themes/reference-app/reference.css', 'utf8');
  assert(css.includes('../upstream/globals.reference.css'));
  for (const style of ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea']) assert(css.includes(`../upstream/style-${style}.css`));
  const installer = readFileSync('scripts/check-installation.mjs', 'utf8');
  const delivery = installer.slice(installer.indexOf("for (const [route, source] of [['alert'"), installer.indexOf("src/routes/alert-types.ts"));
  assert(delivery.includes(".replaceAll('@sveltery/ui/icons', '$lib/components/ui/icons')"));
  assert(delivery.includes("apps/docs/src/routes/alert/+page.svelte"));
  assert(delivery.includes("join(dirname(routePath), 'AlertExample.svelte')"));
  const consumerBrowser = readFileSync('scripts/installation-playwright.config.ts', 'utf8');
  assert(consumerBrowser.includes("'**/kbd.spec.ts', '**/alert.spec.ts'"), 'experimental consumer phases must also execute the genuine Alert gallery');
});
