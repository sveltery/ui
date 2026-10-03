import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
function check(file) {
 const bytes = readFileSync(file.local); assert.equal(bytes.length, file.bytes); assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
 assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), file.gitBlob);
}
test('immutable complete Separator wrapper/gallery and actual React1.6 sources retain byte and Gitblob integrity', () => {
 const styled = JSON.parse(readFileSync('tests/reference/separator-sources.json', 'utf8')); assert.equal(styled.commit, 'd75a96ab781f3d659be1ad287347d5887ce9f2fc'); assert.equal(styled.dedicatedRuntimeTests, 0); assert.equal(styled.files.length, 2); styled.files.forEach(check);
 const base = JSON.parse(readFileSync('tests/reference/base-separator-1.6/sources.json', 'utf8')); assert.equal(base.commit, 'b34551d644f2e58ebf8fc1050d949f6654ceca6c'); assert.equal(base.files.length, 10); [...base.files, base.licenseFile].forEach(check);
 assert.equal(base.ordinaryDeclarations, 2); assert.equal(base.ordinaryExpandedCases, 3); assert.equal(base.conformanceDeclarations, 15);
 assert.equal(Object.values(base.helperSourceDeclarations).flat().length, 15);
 assert(readFileSync('tests/reference/LICENSE', 'utf8').includes('Copyright (c) 2023 shadcn'));
 assert(readFileSync(base.licenseFile.local, 'utf8').includes('Copyright (c) 2019 Material-UI SAS'));
});
test('all 15 executable helper bodies/expectations are unchanged after infrastructure imports', () => {
 for (const name of ['propForwarding', 'refForwarding', 'renderProp', 'className']) {
  const original = readFileSync(`tests/reference/base-separator-1.6/upstream/packages/react/test/conformanceTests/${name}.tsx.txt`, 'utf8');
  const port = readFileSync(`tests/reference/base-separator-1.6/ported/${name}.tsx`, 'utf8');
  const start = name === 'refForwarding' ? 'async function verifyRef' : 'export function'; assert.equal(port.slice(port.indexOf(start)), original.slice(original.indexOf(start)));
 }
 const original = readFileSync('tests/reference/base-separator-1.6/upstream/packages/react/src/separator/Separator.test.tsx.txt', 'utf8');
 const port = readFileSync('tests/dom/base-separator-1.6-conformance.test.ts', 'utf8');
 for (const expected of ["expect(screen.getByRole('separator')).toBeVisible();", "expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', orientation);"]) { assert(original.includes(expected)); assert(port.includes(expected)); }
});
test('all four genuine selected gallery function bodies remain byte-exact in the React comparator', () => {
 const original = readFileSync('tests/reference/separator-example.tsx', 'utf8'); const gallery = readFileSync('tests/reference/SeparatorGallery.tsx', 'utf8'); assert(gallery.includes(original.slice(original.indexOf('function SeparatorHorizontal()'))));
 const local = readFileSync('apps/docs/registry/bases/base/ui/separator/Separator.svelte', 'utf8');
 assert(local.includes('shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch'));
 assert(!local.includes('data-orientation=')); assert(!local.includes('data-horizontal=')); assert(!local.includes('data-vertical='));
});
