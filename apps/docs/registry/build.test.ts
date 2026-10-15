// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildRegistry } from './build';
import { readRegistryInput } from './read';
import type { RegistryItem, RegistryManifest, StyleIndexEntry } from './types';
import { baseColors, styleNames } from './types';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const output = buildRegistry(readRegistryInput(repoRoot, 'https://sveltery.test/'));
const item = (path: string) => output.get(path) as RegistryItem;
// Releases bump these, so the expected ranges follow the manifests rather than hard-coding them.
const ui = JSON.parse(readFileSync(`${repoRoot}packages/ui/package.json`, 'utf8'));
const BASE = `@sveltery/base@^${ui.peerDependencies['@sveltery/base'].replace(/^\^/, '')}`;
const HELPER_RANGE = `^${JSON.parse(readFileSync(`${repoRoot}packages/day-picker/package.json`, 'utf8')).version}`;
const content = (path: string, target: string) => item(path).files.find((file) => file.target === target)!.content;

const NOVA_BUTTON_VARIANTS = `// Adapted from shadcn-ui/ui d75a96ab; MIT: packages/ui/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const buttonVariants = cva("focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80', outline: 'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground', ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
      destructive: 'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30', link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2', xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3", sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5", lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
      icon: 'size-8', 'icon-xs': "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3", 'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg', 'icon-lg': 'size-9',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
export type ButtonVariants = VariantProps<typeof buttonVariants>;
`;

describe('buildRegistry', () => {
  it('inlines the nova style into the button variants', () => {
    expect(content('styles/nova/button.json', 'button/variants.ts')).toBe(NOVA_BUTTON_VARIANTS);
  });

  it('inlines each style separately', () => {
    expect(content('styles/nova/button.json', 'button/variants.ts')).toContain(' rounded-lg border border-transparent ');
    expect(content('styles/vega/button.json', 'button/variants.ts')).toContain(' rounded-md border border-transparent ');
  });

  it('leaves a file without cn-* tokens byte for byte as it is', () => {
    const source = readFileSync(`${repoRoot}packages/ui/src/lib/button/Button.svelte`, 'utf8');
    expect(content('styles/nova/button.json', 'button/Button.svelte')).toBe(source);
  });

  it('keeps the markers the CLI resolves and rewrites the rest of the class string', () => {
    const menu = content('styles/nova/dropdown-menu.json', 'dropdown-menu/DropdownMenuContent.svelte');
    expect(menu).toContain('cn-menu-translucent');
    expect(menu).toContain('cn-menu-target');
  });

  it('adds the has-[] utilities of a qualified rule to the vega card content', () => {
    expect(content('styles/vega/card.json', 'card/CardContent.svelte')).toContain(
      "cn('px-(--card-spacing) has-[>_[data-slot=questionnaire-choices]]:flex has-[>_[data-slot=questionnaire-choices]]:flex-col has-[>_[data-slot=questionnaire-choices]]:gap-3', classProp)",
    );
    expect(content('styles/nova/card.json', 'card/CardContent.svelte')).not.toContain('questionnaire-choices');
  });

  it('leaves no unmapped cn-* token in any file of any style', () => {
    const markers = new Set(['cn-menu-target', 'cn-menu-translucent', 'cn-rtl-flip', 'cn-font-heading']);
    const stray: string[] = [];
    let files = 0;
    for (const [path, value] of output) {
      if (!path.startsWith('styles/') || path.endsWith('/index.json')) continue;
      for (const file of (value as RegistryItem).files) {
        files++;
        for (const [token] of file.content.matchAll(/(?<![\w-])cn-[a-z0-9-]+(?![\w-])/g)) if (!markers.has(token)) stray.push(`${path} ${file.target} ${token}`);
      }
    }
    expect(stray).toEqual([]);
    expect(files).toBeGreaterThan(8 * 300);
  });
});

describe('items', () => {
  it('lists the npm dependencies of a component with caret ranges and its registry dependencies', () => {
    const button = item('styles/nova/button.json');
    expect(button.dependencies).toEqual([BASE, 'class-variance-authority@^0.7.1', 'cn@^0.2.2']);
    expect(button).not.toHaveProperty('registryDependencies');
    expect(item('styles/nova/alert-dialog.json').registryDependencies).toEqual(['button']);
    expect(item('styles/nova/sidebar.json').registryDependencies).toEqual(['button', 'input', 'separator', 'shared', 'sheet', 'skeleton', 'tooltip']);
  });

  it('gives a helper package its workspace version and an optional peer its peer range', () => {
    expect(item('styles/nova/calendar.json').dependencies).toEqual([`@sveltery/day-picker@${HELPER_RANGE}`, 'cn@^0.2.2', 'date-fns@^4.4.0']);
    expect(item('styles/nova/chart.json').dependencies).toEqual(['cn@^0.2.2', 'layerchart@^2.7.0']);
  });

  it('lists shared as a dependency of an item that imports ../shared/ and ships it as a lib item', () => {
    expect(item('styles/nova/badge.json').registryDependencies).toEqual(['shared']);
    const shared = item('styles/nova/shared.json');
    expect([shared.type, shared.files.map((file) => file.target)]).toEqual(['registry:lib', ['shared/render.ts']]);
    expect(shared.files[0]!.content).toBe(readFileSync(`${repoRoot}packages/ui/src/lib/shared/render.ts`, 'utf8'));
  });

  it('writes the item header', () => {
    const { files, ...header } = item('styles/nova/alert-dialog.json');
    expect(header).toEqual({
      $schema: 'https://sveltery.test/schema/registry-item.json',
      name: 'alert-dialog',
      type: 'registry:ui',
      title: 'Alert Dialog',
      dependencies: [BASE, 'cn@^0.2.2'],
      registryDependencies: ['button'],
    });
    expect(files.map((file) => [file.type, file.target]).slice(0, 2)).toEqual([['registry:ui', 'alert-dialog/AlertDialogAction.svelte'], ['registry:ui', 'alert-dialog/AlertDialogCancel.svelte']]);
  });
});

describe('index files', () => {
  it('writes the manifest without shared', () => {
    const manifest = output.get('index.json') as RegistryManifest;
    expect({ ...manifest, items: manifest.items.slice(0, 4) }).toEqual({
      $schema: 'https://sveltery.test/schema/registry.json',
      name: 'sveltery',
      registryVersion: 1,
      styles: ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'],
      baseColors: ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'],
      iconLibraries: ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'],
      items: [
        { name: 'accordion', type: 'registry:ui' },
        { name: 'alert', type: 'registry:ui' },
        { name: 'alert-dialog', type: 'registry:ui' },
        { name: 'aspect-ratio', type: 'registry:ui' },
      ],
    });
    expect(manifest.items.map((entry) => entry.name)).not.toContain('shared');
    expect(manifest.items.map((entry) => entry.name)).toContain('button');
  });

  it('writes a style index that points at each item file, shared included', () => {
    const index = output.get('styles/luma/index.json') as StyleIndexEntry[];
    expect(index.find((entry) => entry.name === 'alert-dialog')).toEqual({ name: 'alert-dialog', type: 'registry:ui', registryDependencies: ['button'], relativeUrl: 'alert-dialog.json' });
    expect(index.find((entry) => entry.name === 'shared')).toEqual({ name: 'shared', type: 'registry:lib', registryDependencies: [], relativeUrl: 'shared.json' });
  });

  it('serves every item of every style and one theme per base color', () => {
    const manifest = output.get('index.json') as RegistryManifest;
    for (const style of styleNames) {
      for (const { name } of manifest.items) expect(output.has(`styles/${style}/${name}.json`)).toBe(true);
      expect(output.has(`styles/${style}/shared.json`)).toBe(true);
    }
    expect([...output.keys()].filter((path) => path.startsWith('themes/'))).toEqual(baseColors.map((color) => `themes/${color}.json`));
  });
});

describe('themes', () => {
  it('serves the neutral theme with the radius scale and the light and dark variables', () => {
    const neutral = item('themes/neutral.json');
    expect({ ...neutral, cssVars: undefined }).toEqual({
      $schema: 'https://sveltery.test/schema/registry-item.json',
      name: 'neutral',
      type: 'registry:theme',
      title: 'Neutral',
      files: [],
      cssVars: undefined,
    });
    expect(neutral.cssVars?.light?.['background']).toBe('oklch(1 0 0)');
    expect(neutral.cssVars?.dark?.['background']).toBe('oklch(0.145 0 0)');
    expect(neutral.cssVars?.theme?.['radius-sm']).toBe('calc(var(--radius) * 0.6)');
    expect(neutral.cssVars?.theme?.['color-background']).toBe('var(--background)');
  });
});
