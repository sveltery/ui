// Executable API assertions against the actual pinned shadcn wrapper; MIT notices retained.
import { expect, it } from 'vitest';
import { buttonVariants as reference } from '../reference/button';
import { buttonVariants, variants, sizes } from '../../apps/docs/registry/bases/base/ui/button/index.js';
for (const variant of ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const) {
  for (const size of ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const) {
    it(`pinned shadcn Button classes: ${variant}/${size}`, () => {
      expect(buttonVariants({ variant, size })).toBe(reference({ variant, size }));
    });
  }
}
it('pinned defaults and nullable variants; Svelte class replaces className', () => {
  expect(variants).toEqual(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link']);
  expect(sizes).toEqual(['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg']);
  expect(buttonVariants()).toBe(reference());
  expect(buttonVariants({ variant: null, size: null })).toBe(reference({ variant: null, size: null }));
  expect(buttonVariants({ class: 'px-6' })).toBe(reference({ className: 'px-6' }));
});
