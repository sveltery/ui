// @vitest-environment node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('tailwind.css is a byte copy of the ui package sheet', () => {
  const shipped = readFileSync(new URL('../tailwind.css', import.meta.url), 'utf8');
  const source = readFileSync(new URL('../../ui/src/lib/styles/shadcn.css', import.meta.url), 'utf8');
  expect(shipped).toBe(source);
});
