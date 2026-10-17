// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { baseColorMigration } from '../src/migrations/base-color.js';
import { transformCn } from '../src/migrations/cn.js';
import { iconIndex, migrateIconsInSource, type IconNames } from '../src/migrations/icons.js';
import type { RegistryItem } from '../src/registry.js';

const icons: IconNames[] = [
  { lucide: 'ChevronRightIcon', tabler: 'IconChevronRight', hugeicons: 'ArrowRight01Icon', phosphor: 'CaretRightIcon', remixicon: 'RiArrowRightSLine' },
  { lucide: 'XIcon', tabler: 'IconX', hugeicons: 'Cancel01Icon', phosphor: 'XIcon', remixicon: 'RiCloseLine' },
];

describe('iconIndex', () => {
  test('reads the library names of every placeholder, and nothing else', () => {
    const placeholder = (names: IconNames, extra = '') => `<IconPlaceholder\n  lucide="${names.lucide}" tabler="${names.tabler}"${extra} hugeicons="${names.hugeicons}" phosphor="${names.phosphor}" remixicon="${names.remixicon}" />`;
    const file = (content: string) => ({ type: 'registry:ui' as const, target: 'a.svelte', content });
    const items = [
      { name: 'a', type: 'registry:ui', $schema: '', files: [file(`${placeholder(icons[0]!, ' class="size-4"')}\n<IconPlaceholder lucide="BirdIcon" />`)] },
      { name: 'b', type: 'registry:ui', $schema: '', files: [file(placeholder(icons[0]!)), file(placeholder(icons[1]!))] },
    ] as RegistryItem[];
    expect(iconIndex(items)).toEqual([icons[0], { lucide: 'BirdIcon' }, icons[0], icons[1]]);
  });
});

describe('migrateIconsInSource', () => {
  const lucide = `<script lang="ts">
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import XIcon from '@lucide/svelte/icons/x';
  import { cn } from '$lib/utils';
</script>

<ChevronRightIcon class="size-4" />
<Button icon={XIcon}><XIcon>x</XIcon></Button>
`;

  test('lucide to tabler: imports, tags, closing tags and attribute references', () => {
    expect(migrateIconsInSource('a.svelte', lucide, 'lucide', 'tabler', icons)).toEqual({
      content: `<script lang="ts">
  import { IconChevronRight } from '@tabler/icons-svelte';
  import { IconX } from '@tabler/icons-svelte';
  import { cn } from '$lib/utils';
</script>

<IconChevronRight class="size-4" />
<Button icon={IconX}><IconX>x</IconX></Button>
`,
      skipped: [],
    });
  });

  test('lucide to hugeicons wraps self-closing icons and skips the ones it cannot wrap', () => {
    expect(migrateIconsInSource('a.svelte', lucide, 'lucide', 'hugeicons', icons)).toEqual({
      content: `<script lang="ts">
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
  import XIcon from '@lucide/svelte/icons/x';
  import { cn } from '$lib/utils';
</script>

<HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} class="size-4" />
<Button icon={XIcon}><XIcon>x</XIcon></Button>
`,
      skipped: [{ icon: 'XIcon', reason: 'cannot be wrapped in <HugeiconsIcon />' }],
    });
  });

  test('hugeicons to phosphor unwraps the icons, drops the default strokeWidth and the unused wrapper import', () => {
    const hugeicons = `<script lang="ts">
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import { ArrowRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
</script>

<HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} class="size-4" />
<HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
`;
    expect(migrateIconsInSource('a.svelte', hugeicons, 'hugeicons', 'phosphor', icons).content).toBe(`<script lang="ts">
  import CaretRightIcon from 'phosphor-svelte/lib/CaretRight';
  import XIcon from 'phosphor-svelte/lib/X';
</script>

<CaretRightIcon class="size-4" />
<XIcon strokeWidth={1.5} />
`);
  });

  test('keeps and reports an icon with no equivalent, keeps type imports, and leaves the rest of a shared import', () => {
    const tabler = `<script lang="ts">
  import { IconBird, IconX, type Icon } from '@tabler/icons-svelte';
</script>

<IconBird /><IconX />
`;
    expect(migrateIconsInSource('a.svelte', tabler, 'tabler', 'remixicon', icons)).toEqual({
      content: `<script lang="ts">
  import RiCloseLine from 'remixicon-svelte/icons/close-line';
  import { IconBird, type Icon } from '@tabler/icons-svelte';
</script>

<IconBird /><RiCloseLine />
`,
      skipped: [{ icon: 'IconBird', reason: 'no remixicon equivalent found' }],
    });
  });

  test('reports an icon used outside markup, as in a TypeScript module, and changes nothing', () => {
    const module = "import XIcon from '@lucide/svelte/icons/x';\n\nexport const items = [{ icon: XIcon }];\n";
    expect(migrateIconsInSource('nav.ts', module, 'lucide', 'tabler', icons)).toEqual({ content: module, skipped: [{ icon: 'XIcon', reason: 'unsupported usage (e.g. referenced outside markup)' }] });
  });

  test('maps lucide icons imported by name from @lucide/svelte, with or without the Icon suffix', () => {
    const input = "<script lang=\"ts\">\n  import { ChevronRight, XIcon as Close } from '@lucide/svelte';\n</script>\n\n<ChevronRight /><Close />\n";
    expect(migrateIconsInSource('a.svelte', input, 'lucide', 'phosphor', icons).content).toBe(
      "<script lang=\"ts\">\n  import CaretRightIcon from 'phosphor-svelte/lib/CaretRight';\n  import XIcon from 'phosphor-svelte/lib/X';\n</script>\n\n<CaretRightIcon /><XIcon />\n",
    );
  });

  test('maps an icon the registry pairs differently to its most common pairing', () => {
    const selector = { ...icons[0]!, tabler: 'IconSelector' };
    const input = "<script lang=\"ts\">\n  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';\n</script>\n\n<ChevronRightIcon />\n";
    expect(migrateIconsInSource('a.svelte', input, 'lucide', 'tabler', [selector, icons[0]!, icons[0]!]).content).toContain('<IconChevronRight />');
    expect(migrateIconsInSource('a.svelte', input, 'lucide', 'tabler', [selector, selector, icons[0]!]).content).toContain('<IconSelector />');
  });

  test('a second run finds nothing to change', () => {
    const once = migrateIconsInSource('a.svelte', lucide, 'lucide', 'tabler', icons).content;
    expect(migrateIconsInSource('a.svelte', once, 'lucide', 'tabler', icons)).toEqual({ content: once, skipped: [] });
  });
});

describe('transformCn', () => {
  const helper = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

  test('replaces an exported helper with a re-export, in the file\'s quote style', () => {
    expect(transformCn('utils.ts', helper)).toEqual({ content: 'export { cn } from "cn";\n', migrated: ['clsx', 'tailwind-merge'], remaining: [], unsupported: [] });
  });

  test('replaces separately exported and aliased helpers, and keeps other exports', () => {
    const input = "import { clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nconst cx = (...inputs) => twMerge(clsx(...inputs));\nconst other = 1;\n\nexport { cx, other };\n";
    expect(transformCn('utils.ts', input).content).toBe("export { cn as cx } from 'cn';\nconst other = 1;\n\nexport { other };\n");
  });

  test('keeps a helper the file uses itself and aliases the package import', () => {
    const input = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonClassName = cn("px-2", "px-4")

export { buttonClassName, cn }
`;
    expect(transformCn('utils.ts', input).content).toBe(`import { cn as cnMerge, type ClassValue } from "cn";

function cn(...inputs: ClassValue[]) {
  return cnMerge(...inputs)
}

const buttonClassName = cn("px-2", "px-4")

export { buttonClassName, cn }
`);
  });

  test('flattens clsx calls among other twMerge arguments, with aliased and default imports', () => {
    const input = 'import cx from "clsx"\nimport { twMerge as merge } from "tailwind-merge"\n\nconst className = merge("px-1", cx(active && "px-2"), "px-4")\n';
    expect(transformCn('a.ts', input).content).toBe('import { cn } from "cn";\n\nconst className = cn("px-1", active && "px-2", "px-4")\n');
  });

  test('moves separate clsx and twMerge calls to cn\'s exports of the same names', () => {
    const input = 'import { clsx } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nconst a = clsx("flex", on && "block")\nconst b = twMerge("px-2 px-4")\n';
    expect(transformCn('a.ts', input).content).toBe('import { clsx, twMerge } from "cn";\n\nconst a = clsx("flex", on && "block")\nconst b = twMerge("px-2 px-4")\n');
  });

  test('splits root and config imports, renaming the config exports', () => {
    const input = 'import { twMerge, extendTailwindMerge, createTailwindMerge, getDefaultConfig, type ConfigExtension } from "tailwind-merge"\n\nexport { twMerge, extendTailwindMerge, createTailwindMerge, getDefaultConfig }\nexport type { ConfigExtension }\n';
    expect(transformCn('a.ts', input).content).toBe(
      'import { twMerge } from "cn";\nimport { extendTailwindMerge, createTwMerge as createTailwindMerge, defaultConfig as getDefaultConfig, type ConfigExtension } from "cn/config";\n\nexport { twMerge, extendTailwindMerge, createTailwindMerge, getDefaultConfig }\nexport type { ConfigExtension }\n',
    );
  });

  test('moves clsx/lite to cn/lite and its types to cn', () => {
    const input = 'import clsx, { type ClassValue } from "clsx/lite"\n\nexport const classes = (...inputs: ClassValue[]) => clsx(inputs)\n';
    expect(transformCn('a.ts', input).content).toBe('import { clsx } from "cn/lite";\nimport { type ClassValue } from "cn";\n\nexport const classes = (...inputs: ClassValue[]) => clsx(inputs)\n');
  });

  test('swaps cnfast specifiers', () => {
    const input = 'import { cn } from "cnfast"\nexport * from "cnfast"\nexport const load = () => import("cnfast")\n';
    expect(transformCn('a.ts', input)).toEqual({ content: 'import { cn } from "cn"\nexport * from "cn"\nexport const load = () => import("cn")\n', migrated: ['cnfast'], remaining: [], unsupported: [] });
  });

  test('leaves callable validators, variadic createTailwindMerge and experimental imports for manual review', () => {
    const input = 'import { validators, createTailwindMerge, twMerge, type ExperimentalParseClassNameParam } from "tailwind-merge"\n\nexport const valid = validators.isNumber("2")\nexport const merge = createTailwindMerge(() => a, () => b)\nexport { twMerge }\nexport type { ExperimentalParseClassNameParam }\n';
    const result = transformCn('a.ts', input);
    expect(result.content.split('\n').slice(0, 2)).toEqual(['import { twMerge } from "cn";', 'import { validators, createTailwindMerge, type ExperimentalParseClassNameParam } from "tailwind-merge";']);
    expect(result.remaining).toEqual(['tailwind-merge']);
    expect(result.unsupported).toEqual([
      { packageName: 'tailwind-merge', symbol: 'validators', reason: 'callable validators are not supported by cn' },
      { packageName: 'tailwind-merge', symbol: 'createTailwindMerge', reason: 'variadic createTailwindMerge calls are not supported by cn' },
      { packageName: 'tailwind-merge', symbol: 'ExperimentalParseClassNameParam', reason: 'experimentalParseClassName is not supported by cn' },
    ]);
  });

  test('reports dynamic imports, CommonJS requires and export-from declarations without changing them', () => {
    const input = 'export { twMerge } from "tailwind-merge"\nexport * from "clsx"\nexport const load = () => import("tailwind-merge")\nexport const lib = require("clsx")\n';
    expect(transformCn('a.ts', input)).toEqual({
      content: input,
      migrated: [],
      remaining: ['clsx', 'tailwind-merge'],
      unsupported: [
        { packageName: 'tailwind-merge', symbol: 'twMerge', reason: 'export-from declarations require manual migration' },
        { packageName: 'clsx', reason: 'export-from declarations require manual migration' },
        { packageName: 'tailwind-merge', reason: 'dynamic imports require manual migration' },
        { packageName: 'clsx', reason: 'CommonJS requires require manual migration' },
      ],
    });
  });

  test('keeps a Svelte import that only the markup uses', () => {
    const input = '<script lang="ts">\n  import { clsx } from "clsx";\n  import { twMerge } from "tailwind-merge";\n  let { active } = $props();\n</script>\n\n<div class={twMerge(clsx("flex", active && "block"))}></div>\n<p class={clsx("a")}></p>\n';
    expect(transformCn('a.svelte', input).content).toBe(
      '<script lang="ts">\n  import { cn, clsx } from "cn";\n  let { active } = $props();\n</script>\n\n<div class={cn("flex", active && "block")}></div>\n<p class={clsx("a")}></p>\n',
    );
  });

  test('ignores calls a parameter shadows, functions that only share the names, and its own output', () => {
    const shadowing = 'import { clsx } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nconst merged = twMerge(clsx("px-2"))\n\nexport function join(clsx) {\n  return clsx("flex")\n}\n';
    expect(transformCn('a.ts', shadowing).content).toBe('import { cn } from "cn";\n\nconst merged = cn("px-2")\n\nexport function join(clsx) {\n  return clsx("flex")\n}\n');
    const local = 'function clsx(value) {\n  return value\n}\n\nexport const cn = (value) => twMerge(clsx(value))\n';
    expect(transformCn('a.ts', local).content).toBe(local);
    const once = transformCn('utils.ts', helper).content;
    expect(transformCn('utils.ts', once)).toEqual({ content: once, migrated: [], remaining: [], unsupported: [] });
  });
});

describe('baseColorMigration', () => {
  const neutral = { light: { background: 'oklch(1 0 0)', primary: 'oklch(0.205 0 0)', muted: 'oklch(0.97 0 0)' }, dark: { primary: 'oklch(0.922 0 0)' } };
  const stone = { light: { background: 'oklch(1 0 0)', primary: 'oklch(0.216 0.006 56.043)', muted: 'oklch(0.97 0.001 106.424)' }, dark: { primary: 'oklch(0.923 0.003 48.717)' } };

  test('changes the tokens that still hold the source value, and reports customized and missing ones', () => {
    const css = ':root {\n  --background: oklch(1 0 0);\n  --primary:   oklch(0.205 0 0);\n}\n.dark {\n  --primary: oklch(0.6 0.2 30);\n}\n';
    expect(baseColorMigration(css, neutral, stone)).toEqual({
      vars: { light: { primary: 'oklch(0.216 0.006 56.043)' }, dark: {} },
      skipped: [
        { token: '--muted', reason: 'not found in your CSS' },
        { token: '--primary', reason: 'does not match the source base color' },
      ],
    });
  });
});
