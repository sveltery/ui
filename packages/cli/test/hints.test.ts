// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vitest';

const src = new URL('../src/', import.meta.url).pathname;

test('every npx command the CLI prints runs a package that is on npm', () => {
  const printed = readdirSync(src, { recursive: true, encoding: 'utf8' })
    .filter((path) => path.endsWith('.ts'))
    .flatMap((path) => [...readFileSync(join(src, path), 'utf8').matchAll(/`npx ([^`\s\\]+)/g)].map((match) => match[1]));
  expect(new Set(printed)).toEqual(new Set(['@sveltery/ui@latest', 'sv']));
});
