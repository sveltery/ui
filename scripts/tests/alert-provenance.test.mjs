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
test('Basic function is byte-exact and composes the genuine Example helpers; missing compositions stay deferred', () => {
  const source = readFileSync('tests/reference/alert-example.tsx', 'utf8');
  const gallery = readFileSync('tests/reference/AlertGallery.tsx', 'utf8');
  const selected = source.slice(source.indexOf('function AlertExample1()'), source.indexOf('function AlertExample2()')).trimEnd();
  assert(gallery.includes(selected));
  assert.match(gallery, /import \{ Example, ExampleWrapper \} from '\.\/example-scaffold';/);
  assert(!gallery.includes('function Example('), 'a handmade reference helper cannot establish original composition');
  assert.match(gallery, /<ExampleWrapper className="lg:grid-cols-1" data-alert-gallery data-hydrated=\{hydrated\}><AlertExample1 \/><\/ExampleWrapper>/);
  const local = readFileSync('apps/docs/examples/base/AlertExample.svelte', 'utf8');
  assert.match(local, /import \{ Example, ExampleWrapper \} from '@sveltery\/ui\/example';/);
  assert.match(local, /<ExampleWrapper class="lg:grid-cols-1" data-alert-gallery="true" data-hydrated=\{hydrated\}>/);
  assert.match(local, /<Example title="Basic">/);
  assert(!/<(?:section|h2)\b/.test(local), 'original scaffold hosts are native divs, not section/h2 substitutes');
  for (const deferred of ['AlertExample2', 'AlertExample3', 'AlertExample4', 'IconPlaceholder', 'Badge']) assert(!gallery.includes(deferred));
  assert(source.includes('import { Badge }')); assert(source.includes('import { IconPlaceholder }'));
});
