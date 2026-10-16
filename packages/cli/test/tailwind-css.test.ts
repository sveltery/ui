// @vitest-environment node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('tailwind.css is a byte copy of the registry sheet', () => {
  const shipped = readFileSync(new URL('../tailwind.css', import.meta.url), 'utf8');
  const source = readFileSync(new URL('../../../apps/docs/registry/styles/shadcn.css', import.meta.url), 'utf8');
  expect(shipped).toBe(source);
});
