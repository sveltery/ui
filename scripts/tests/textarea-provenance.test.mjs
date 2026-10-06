import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
test('immutable shadcn Textarea wrapper, examples and Nova rule retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/textarea-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  const source = readFileSync('tests/reference/textarea-nova.css', 'utf8');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(source.trimEnd()));
});

// New authored source-first gallery supplements; immutable original assertions remain above.
test('two genuine Textarea declarations, complete support environment and old five-state probe remain authenticated', () => {
  const m = JSON.parse(readFileSync('tests/reference/textarea-gallery-sources.json', 'utf8'));
  assert.equal(m.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.deepEqual(m.selected, ['TextareaBasic', 'TextareaInvalid']);
  const raw = readFileSync('tests/reference/textarea-example.tsx', 'utf8');
  const selected = readFileSync('tests/reference/textarea-selected-examples.tsx', 'utf8');
  const declaration = (s, name) => s.slice(s.indexOf(`function ${name}()`)).split(/\nfunction |\nexport \{/u)[0].trimEnd();
  for (const r of m.selectedDeclarations) {
    const body = declaration(selected, r.name);
    assert.equal(body, declaration(raw, r.name));
    assert.equal(Buffer.byteLength(body), r.bytes);
    assert.equal(createHash('sha256').update(body).digest('hex'), r.sha256);
  }
  assert.deepEqual(Object.keys(m.omitted), ['TextareaWithLabel', 'TextareaWithDescription', 'TextareaDisabled']);
  for (const name of Object.keys(m.omitted)) assert(!selected.includes(`function ${name}(`));
  assert(!selected.includes('Field')); assert(selected.includes("import { Example } from './example-scaffold'"));
  const canonical = readFileSync('apps/docs/examples/base/TextareaExample.svelte', 'utf8');
  assert(canonical.includes("import { Example, ExampleWrapper } from '@sveltery/ui/example'"));
  assert(canonical.includes('<ExampleWrapper>{@render TextareaBasic()}{@render TextareaInvalid()}</ExampleWrapper>'));
  assert(!canonical.includes('data-testid')); assert(!canonical.includes('<section')); assert(!canonical.includes('Field'));
  for (const r of m.originalFiles) {
    const b = readFileSync(r.local); assert.equal(b.length, r.bytes);
    assert.equal(createHash('sha256').update(b).digest('hex'), r.sha256);
    assert.equal(createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'), r.gitBlob);
  }
  const probe = readFileSync(m.legacyProbe.path); assert.equal(probe.length, m.legacyProbe.bytes);
  assert.equal(createHash('sha256').update(probe).digest('hex'), m.legacyProbe.sha256);
  assert(readFileSync('apps/docs/src/routes/textarea/+page.svelte', 'utf8').includes("../../../examples/base/TextareaProbe.svelte"));
  const delivery = readFileSync('scripts/check-installation.mjs', 'utf8');
  assert(delivery.includes("'apps/docs/examples/base/TextareaExample.svelte'"));
  assert(delivery.includes("'src/routes/textarea-gallery'"));
  assert(delivery.includes("replaceAll('@sveltery/ui/example', '$lib/components/ui/example')"));
});
