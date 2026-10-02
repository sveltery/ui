import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('Input exact shadcn bytes and Nova section retain immutable provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/input-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 3);
  for (const file of pin.files) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(readFileSync('tests/reference/input-nova.css', 'utf8').trimEnd()));
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});

test('Base React1.6 sources are distinct; all15 executable helper bodies remain unchanged', () => {
  const pin = JSON.parse(readFileSync('tests/reference/base-input-1.6/sources.json', 'utf8'));
  assert.equal(pin.commit, 'b34551d644f2e58ebf8fc1050d949f6654ceca6c');
  assert.equal(pin.ordinary_input_declarations, 0);
  assert.equal(pin.shared_conformance_declarations, 15);
  assert.equal(pin.helper_inventory.length, 15);
  for (const file of [...pin.files, pin.license]) assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  assert(readFileSync(pin.license.local, 'utf8').includes('Copyright (c) 2019 Material-UI SAS'));
  for (const name of ['propForwarding', 'renderProp', 'refForwarding', 'className']) {
    const upstream = readFileSync(`tests/reference/base-input-1.6/upstream/packages/react/test/conformanceTests/${name}.tsx.txt`, 'utf8');
    const port = readFileSync(`tests/reference/base-input-1.6/ported/${name}.tsx`, 'utf8');
    assert.equal(port.slice(port.indexOf('export function')), upstream.slice(upstream.indexOf('export function')));
    // Ref helpers have an assertion in verifyRef before the exported declaration too.
    if (name === 'refForwarding') assert.equal(port.slice(port.indexOf('async function verifyRef')), upstream.slice(upstream.indexOf('async function verifyRef')));
  }
  assert.equal(pin.contextual_field_control_declarations, 4);
  assert.match(pin.field_control_status, /^unported:/);
});
