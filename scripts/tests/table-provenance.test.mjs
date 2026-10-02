import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('immutable shadcn Table wrapper, complete examples and Nova rules retain provenance', () => {
  const pin = JSON.parse(readFileSync('tests/reference/table-sources.json', 'utf8'));
  assert.equal(pin.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc');
  assert.equal(pin.files.length, 3);
  for (const file of pin.files) {
    assert.equal(createHash('sha256').update(readFileSync(file.local)).digest('hex'), file.sha256);
  }
  const source = readFileSync('tests/reference/table-nova.css', 'utf8');
  assert(readFileSync('apps/docs/registry/styles/style-nova.css', 'utf8').includes(source.trimEnd()));
  assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
});

test('bounded React gallery retains exact Basic, Footer, Simple and With Badges functions and invoice data', () => {
  const source = readFileSync('tests/reference/table-example.tsx', 'utf8');
  const gallery = readFileSync('tests/reference/TableGallery.tsx', 'utf8');
  const invoices = source.slice(source.indexOf('const invoices = ['), source.indexOf('export default function TableExample'));
  const functions = source.slice(source.indexOf('function TableBasic()'), source.indexOf('function TableWithActions()'));
  assert(gallery.includes(invoices));
  assert(gallery.includes(functions));
  for (const deferred of ['TableWithActions', 'TableWithSelect', 'TableWithInput']) {
    assert(!gallery.includes(deferred));
  }
});

test('With Badges is six literal spans without a missing Badge dependency', () => {
  const source = readFileSync('tests/reference/table-example.tsx', 'utf8');
  const body = source.slice(source.indexOf('function TableWithBadges()'), source.indexOf('function TableWithActions()'));
  assert.equal((body.match(/<span className=/g) ?? []).length, 6);
  assert(!body.includes('<Badge'));
});
