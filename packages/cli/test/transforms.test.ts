// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import type { PresetMenuColor } from '../src/preset/preset.js';
import type { IconLibraryName } from '../src/registry.js';
import { transformIcons, transformMarkers, type TransformContext } from '../src/transforms.js';

const read = (path: string) => ({ target: path, content: readFileSync(new URL(`../../../apps/docs/registry/bases/base/ui/${path}`, import.meta.url), 'utf8') });

/** The source with each literal `from` (which must occur exactly once) replaced by `to`. */
function swap(source: string, edits: [from: string, to: string][]): string {
  for (const [from, to] of edits) {
    expect(source.split(from).length - 1, `occurrences of ${from}`).toBe(1);
    source = source.replace(from, to);
  }
  return source;
}

const ctx = (iconLibrary: IconLibraryName, fontHeading = false, menuColor: PresetMenuColor = 'default'): TransformContext => ({ iconLibrary, menuColor, fontHeading });
const placeholderImport = "import { IconPlaceholder } from '../icons/index.js';";
const selectIcon = '<IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" class="cn-select-item-indicator-icon pointer-events-none" />';
const spinnerOpen = `<IconPlaceholder
  lucide="Loader2Icon"
  tabler="IconLoader"
  hugeicons="Loading03Icon"
  phosphor="SpinnerIcon"
  remixicon="RiLoaderLine"
  data-slot="spinner"`;

const cases: Record<IconLibraryName, { packages: string[]; select: [string, string]; spinner: [string, string] }> = {
  lucide: {
    packages: ['@lucide/svelte@^1.48.0'],
    select: ["import CheckIcon from '@lucide/svelte/icons/check';", '<CheckIcon class="cn-select-item-indicator-icon pointer-events-none" />'],
    spinner: ["import Loader2Icon from '@lucide/svelte/icons/loader-2';", '<Loader2Icon\n  data-slot="spinner"'],
  },
  tabler: {
    packages: ['@tabler/icons-svelte@^3.48.0'],
    select: ["import { IconCheck } from '@tabler/icons-svelte';", '<IconCheck class="cn-select-item-indicator-icon pointer-events-none" />'],
    spinner: ["import { IconLoader } from '@tabler/icons-svelte';", '<IconLoader\n  data-slot="spinner"'],
  },
  hugeicons: {
    packages: ['@hugeicons/svelte@^1.1.5', '@hugeicons/core-free-icons@^4.3.5'],
    select: [
      "import { HugeiconsIcon } from '@hugeicons/svelte';\n  import { Tick02Icon } from '@hugeicons/core-free-icons';",
      '<HugeiconsIcon icon={Tick02Icon} strokeWidth={2} class="cn-select-item-indicator-icon pointer-events-none" />',
    ],
    spinner: [
      "import { HugeiconsIcon } from '@hugeicons/svelte';\n  import { Loading03Icon } from '@hugeicons/core-free-icons';",
      '<HugeiconsIcon icon={Loading03Icon} strokeWidth={2}\n  data-slot="spinner"',
    ],
  },
  phosphor: {
    packages: ['phosphor-svelte@^3.1.0'],
    select: ["import CheckIcon from 'phosphor-svelte/lib/Check';", '<CheckIcon class="cn-select-item-indicator-icon pointer-events-none" />'],
    spinner: ["import SpinnerIcon from 'phosphor-svelte/lib/Spinner';", '<SpinnerIcon\n  data-slot="spinner"'],
  },
  remixicon: {
    packages: ['remixicon-svelte@^0.0.5'],
    select: ["import RiCheckLine from 'remixicon-svelte/icons/check-line';", '<RiCheckLine class="cn-select-item-indicator-icon pointer-events-none" />'],
    spinner: ["import RiLoaderLine from 'remixicon-svelte/icons/loader-line';", '<RiLoaderLine\n  data-slot="spinner"'],
  },
};

describe('transformIcons', () => {
  for (const [library, expected] of Object.entries(cases) as [IconLibraryName, (typeof cases)[IconLibraryName]][]) {
    test(`SelectItem with ${library}`, () => {
      const file = read('select/SelectItem.svelte');
      expect(transformIcons(file, ctx(library))).toEqual({
        content: swap(file.content, [
          [placeholderImport, expected.select[0]],
          [selectIcon, expected.select[1]],
        ]),
        dependencies: expected.packages,
      });
    });

    test(`Spinner with ${library} keeps every other attribute`, () => {
      const file = read('spinner/Spinner.svelte');
      expect(transformIcons(file, ctx(library))).toEqual({
        content: swap(file.content, [
          [placeholderImport, expected.spinner[0]],
          [spinnerOpen, expected.spinner[1]],
        ]),
        dependencies: expected.packages,
      });
    });
  }

  test('imports each icon once and renames a closing tag', () => {
    const content = `<script>\n  ${placeholderImport}\n</script>\n<IconPlaceholder lucide="XIcon" tabler="IconX" />\n<IconPlaceholder lucide="XIcon" tabler="IconX" {...rest}></IconPlaceholder>\n`;
    expect(transformIcons({ target: 'x/X.svelte', content }, ctx('tabler')).content).toBe(
      "<script>\n  import { IconX } from '@tabler/icons-svelte';\n</script>\n<IconX />\n<IconX {...rest}></IconX>\n",
    );
  });

  test('a placeholder without the configured library is an error', () => {
    const content = `<script>\n  ${placeholderImport}\n</script>\n<IconPlaceholder lucide="XIcon" />\n`;
    expect(() => transformIcons({ target: 'x/X.svelte', content }, ctx('phosphor'))).toThrow(
      'x/X.svelte: an <IconPlaceholder> has no static "phosphor" attribute, so it cannot become a phosphor icon.',
    );
  });

  test('leaves files without placeholders alone', () => {
    const file = read('dialog/DialogTitle.svelte');
    expect(transformIcons(file, ctx('lucide'))).toEqual({ content: file.content });
  });
});

describe('transformMarkers', () => {
  test('drops the menu markers from DropdownMenuContent', () => {
    const file = read('dropdown-menu/DropdownMenuContent.svelte');
    expect(transformMarkers(file, ctx('lucide')).content).toBe(
      swap(file.content, [["cn('cn-dropdown-menu-content cn-dropdown-menu-content-logical cn-menu-target cn-menu-translucent z-50 ", "cn('cn-dropdown-menu-content cn-dropdown-menu-content-logical z-50 "]]),
    );
  });

  test('turns cn-font-heading into font-heading when the CSS defines --font-heading', () => {
    const file = read('dialog/DialogTitle.svelte');
    expect(transformMarkers(file, ctx('lucide', true)).content).toBe(swap(file.content, [["cn('cn-dialog-title cn-font-heading'", "cn('cn-dialog-title font-heading'"]]));
  });

  test('drops cn-font-heading when the CSS has no --font-heading', () => {
    const file = read('dialog/DialogTitle.svelte');
    expect(transformMarkers(file, ctx('lucide', false)).content).toBe(swap(file.content, [["cn('cn-dialog-title cn-font-heading'", "cn('cn-dialog-title'"]]));
  });

  test('edits static class text, template parts and TypeScript modules, and nothing that is not an exact token', () => {
    const svelte = '<div class="cn-rtl-flip a {b} cn-menu-target"></div>\n<p title="cn-rtl-flip">{`x cn-rtl-flip ${y} z`}</p>\n<i class="cn-rtl-flipped"></i>\n';
    expect(transformMarkers({ target: 'x/X.svelte', content: svelte }, ctx('lucide')).content).toBe(
      '<div class="a {b}"></div>\n<p title="cn-rtl-flip">{`x ${y} z`}</p>\n<i class="cn-rtl-flipped"></i>\n',
    );
    const module = "export const x = cva('cn-rtl-flip size-4', { variants: { a: { b: 'cn-menu-translucent' } } });\n";
    expect(transformMarkers({ target: 'x/variants.ts', content: module }, ctx('lucide')).content).toBe("export const x = cva('size-4', { variants: { a: { b: '' } } });\n");
  });

  describe('menu colors', () => {
    const translucent =
      'animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!';
    const content = `<script lang="ts">\n  import { cn } from 'cn';\n</script>\n<div class={cn('cn-menu-target cn-menu-translucent z-50 bg-popover text-sm', classProp)}></div>\n`;
    const menu = (menuColor: PresetMenuColor) => transformMarkers({ target: 'menu/MenuContent.svelte', content }, ctx('lucide', false, menuColor)).content;
    const wrap = (classes: string) => `<script lang="ts">\n  import { cn } from 'cn';\n</script>\n<div class={cn('${classes}', classProp)}></div>\n`;

    test('default drops both markers', () => {
      expect(menu('default')).toBe(wrap('z-50 bg-popover text-sm'));
    });

    test('inverted makes the menu dark', () => {
      expect(menu('inverted')).toBe(wrap('dark z-50 bg-popover text-sm'));
    });

    test('default-translucent merges the translucent classes over the menu classes', () => {
      expect(menu('default-translucent')).toBe(wrap(`z-50 text-sm ${translucent}`));
    });

    test('inverted-translucent does both', () => {
      expect(menu('inverted-translucent')).toBe(wrap(`dark z-50 text-sm ${translucent}`));
    });
  });
});
