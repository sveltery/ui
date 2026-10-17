// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applyRtlMapping, transformDirection } from '../src/rtl.js';

// The applyRtlMapping cases are shadcn-ui/ui d2fba50 packages/registry/src/transformers/transform-rtl.test.ts; MIT.
describe('applyRtlMapping', () => {
  it('transforms margin classes', () => {
    expect(applyRtlMapping('ml-2')).toBe('ms-2');
    expect(applyRtlMapping('mr-4')).toBe('me-4');
    expect(applyRtlMapping('-ml-2')).toBe('-ms-2');
    expect(applyRtlMapping('-mr-4')).toBe('-me-4');
  });

  it('transforms padding classes', () => {
    expect(applyRtlMapping('pl-2')).toBe('ps-2');
    expect(applyRtlMapping('pr-4')).toBe('pe-4');
  });

  it('transforms positioning classes', () => {
    expect(applyRtlMapping('left-0')).toBe('start-0');
    expect(applyRtlMapping('right-0')).toBe('end-0');
    expect(applyRtlMapping('right-1')).toBe('end-1');
    expect(applyRtlMapping('-left-2')).toBe('-start-2');
    expect(applyRtlMapping('-right-2')).toBe('-end-2');
  });

  it('transforms inset classes', () => {
    expect(applyRtlMapping('inset-l-0')).toBe('inset-inline-start-0');
    expect(applyRtlMapping('inset-r-0')).toBe('inset-inline-end-0');
  });

  it('transforms border classes', () => {
    expect(applyRtlMapping('border-l')).toBe('border-s');
    expect(applyRtlMapping('border-r')).toBe('border-e');
    expect(applyRtlMapping('border-l-2')).toBe('border-s-2');
    expect(applyRtlMapping('border-r-2')).toBe('border-e-2');
  });

  it('transforms rounded corner classes', () => {
    expect(applyRtlMapping('rounded-l-md')).toBe('rounded-s-md');
    expect(applyRtlMapping('rounded-r-md')).toBe('rounded-e-md');
    expect(applyRtlMapping('rounded-tl-md')).toBe('rounded-ss-md');
    expect(applyRtlMapping('rounded-tr-md')).toBe('rounded-se-md');
    expect(applyRtlMapping('rounded-bl-md')).toBe('rounded-es-md');
    expect(applyRtlMapping('rounded-br-md')).toBe('rounded-ee-md');
  });

  it('transforms text alignment classes', () => {
    expect(applyRtlMapping('text-left')).toBe('text-start');
    expect(applyRtlMapping('text-right')).toBe('text-end');
  });

  it('transforms scroll margin/padding classes', () => {
    expect(applyRtlMapping('scroll-ml-2')).toBe('scroll-ms-2');
    expect(applyRtlMapping('scroll-mr-2')).toBe('scroll-me-2');
    expect(applyRtlMapping('scroll-pl-2')).toBe('scroll-ps-2');
    expect(applyRtlMapping('scroll-pr-2')).toBe('scroll-pe-2');
  });

  it('transforms float classes', () => {
    expect(applyRtlMapping('float-left')).toBe('float-start');
    expect(applyRtlMapping('float-right')).toBe('float-end');
  });

  it('transforms clear classes', () => {
    expect(applyRtlMapping('clear-left')).toBe('clear-start');
    expect(applyRtlMapping('clear-right')).toBe('clear-end');
  });

  it('transforms origin classes', () => {
    expect(applyRtlMapping('origin-left')).toBe('origin-start');
    expect(applyRtlMapping('origin-right')).toBe('origin-end');
    expect(applyRtlMapping('origin-top-left')).toBe('origin-top-start');
    expect(applyRtlMapping('origin-top-right')).toBe('origin-top-end');
    expect(applyRtlMapping('origin-bottom-left')).toBe('origin-bottom-start');
    expect(applyRtlMapping('origin-bottom-right')).toBe('origin-bottom-end');
  });

  it('preserves variant prefixes', () => {
    expect(applyRtlMapping('hover:ml-2')).toBe('hover:ms-2');
    expect(applyRtlMapping('focus:pl-4')).toBe('focus:ps-4');
    expect(applyRtlMapping('sm:md:ml-2')).toBe('sm:md:ms-2');
  });

  it('handles named group selectors with data attributes', () => {
    expect(
      applyRtlMapping(
        'sm:group-data-[size=default]/alert-dialog-content:text-left'
      )
    ).toBe('sm:group-data-[size=default]/alert-dialog-content:text-start')
  });

  it('preserves arbitrary values', () => {
    expect(applyRtlMapping('ml-[10px]')).toBe('ms-[10px]');
    expect(applyRtlMapping('left-[50%]')).toBe('start-[50%]');
  });

  it('preserves modifiers', () => {
    expect(applyRtlMapping('ml-2/50')).toBe('ms-2/50');
  });

  it('handles multiple classes', () => {
    expect(applyRtlMapping('ml-2 mr-4 pl-2 pr-4')).toBe('ms-2 me-4 ps-2 pe-4');
  });

  it('transforms slide animations inside logical side variants', () => {
    expect(
      applyRtlMapping('data-[side=inline-start]:slide-in-from-right-2')
    ).toBe('data-[side=inline-start]:slide-in-from-end-2')
    expect(
      applyRtlMapping('data-[side=inline-start]:slide-out-to-right-2')
    ).toBe('data-[side=inline-start]:slide-out-to-end-2')
    expect(applyRtlMapping('data-[side=inline-end]:slide-in-from-left-2')).toBe(
      'data-[side=inline-end]:slide-in-from-start-2'
    )
    expect(applyRtlMapping('data-[side=inline-end]:slide-out-to-left-2')).toBe(
      'data-[side=inline-end]:slide-out-to-start-2'
    )
  });

  it('does not transform slide animations inside physical side variants', () => {
    // Physical side variants should keep physical slide directions.
    expect(applyRtlMapping('data-[side=left]:slide-in-from-right-2')).toBe(
      'data-[side=left]:slide-in-from-right-2'
    )
    expect(applyRtlMapping('data-[side=right]:slide-in-from-left-2')).toBe(
      'data-[side=right]:slide-in-from-left-2'
    )
  });

  it('does not transform unrelated classes', () => {
    expect(applyRtlMapping('bg-red-500')).toBe('bg-red-500');
    expect(applyRtlMapping('flex')).toBe('flex');
    expect(applyRtlMapping('mx-auto')).toBe('mx-auto');
    expect(applyRtlMapping('px-4')).toBe('px-4');
  });

  it('does not transform classes that partially match RTL mappings', () => {
    // border-r should become border-e, but border-ring should stay as-is.
    expect(applyRtlMapping('border-ring')).toBe('border-ring');
    expect(applyRtlMapping('border-ring/50')).toBe('border-ring/50');
    // border-l should become border-s, but border-lime-500 should stay as-is.
    expect(applyRtlMapping('border-lime-500')).toBe('border-lime-500');
    // text-left should become text-start, but text-left-foo should stay as-is.
    expect(applyRtlMapping('text-left')).toBe('text-start');
    // text-right should become text-end, but text-right-foo should stay as-is if it existed.
    expect(applyRtlMapping('text-right')).toBe('text-end');
    // float-left should become float-start, but float-leftish (hypothetical) should stay.
    expect(applyRtlMapping('float-left')).toBe('float-start');
    // origin-left should become origin-start, but origin-leftover (hypothetical) should stay.
    expect(applyRtlMapping('origin-left')).toBe('origin-start');
    // origin-top-left should become origin-top-start.
    expect(applyRtlMapping('origin-top-left')).toBe('origin-top-start');
    // scroll-mr- should become scroll-me-, but scroll-m-4 should stay as-is.
    expect(applyRtlMapping('scroll-m-4')).toBe('scroll-m-4');
  });

  it('adds rtl: variant for translate-x classes', () => {
    expect(applyRtlMapping('-translate-x-1/2')).toBe(
      '-translate-x-1/2 rtl:translate-x-1/2'
    )
    expect(applyRtlMapping('translate-x-full')).toBe(
      'translate-x-full rtl:-translate-x-full'
    )
    expect(applyRtlMapping('-translate-x-px')).toBe(
      '-translate-x-px rtl:translate-x-px'
    )
  });

  it('handles translate-x with variant prefixes', () => {
    expect(applyRtlMapping('after:-translate-x-1/2')).toBe(
      'after:-translate-x-1/2 rtl:after:translate-x-1/2'
    )
    expect(applyRtlMapping('group-hover:translate-x-2')).toBe(
      'group-hover:translate-x-2 rtl:group-hover:-translate-x-2'
    )
  });

  it('does not add rtl: variant for translate-y classes', () => {
    expect(applyRtlMapping('-translate-y-1/2')).toBe('-translate-y-1/2');
    expect(applyRtlMapping('translate-y-full')).toBe('translate-y-full');
  });

  it('adds rtl:space-x-reverse for space-x classes', () => {
    expect(applyRtlMapping('space-x-4')).toBe('space-x-4 rtl:space-x-reverse');
    expect(applyRtlMapping('space-x-2')).toBe('space-x-2 rtl:space-x-reverse');
    expect(applyRtlMapping('space-x-0')).toBe('space-x-0 rtl:space-x-reverse');
  });

  it('adds rtl:divide-x-reverse for divide-x classes', () => {
    expect(applyRtlMapping('divide-x-2')).toBe(
      'divide-x-2 rtl:divide-x-reverse'
    )
    expect(applyRtlMapping('divide-x-0')).toBe(
      'divide-x-0 rtl:divide-x-reverse'
    )
  });

  it('handles space-x and divide-x with variant prefixes', () => {
    expect(applyRtlMapping('md:space-x-4')).toBe(
      'md:space-x-4 rtl:md:space-x-reverse'
    )
    expect(applyRtlMapping('hover:divide-x-2')).toBe(
      'hover:divide-x-2 rtl:hover:divide-x-reverse'
    )
  });

  it('does not add rtl: variant for space-y or divide-y classes', () => {
    expect(applyRtlMapping('space-y-4')).toBe('space-y-4');
    expect(applyRtlMapping('divide-y-2')).toBe('divide-y-2');
  });

  it('adds rtl: variant for cursor resize classes', () => {
    expect(applyRtlMapping('cursor-w-resize')).toBe(
      'cursor-w-resize rtl:cursor-e-resize'
    )
    expect(applyRtlMapping('cursor-e-resize')).toBe(
      'cursor-e-resize rtl:cursor-w-resize'
    )
  });

  it('handles cursor resize with variant prefixes', () => {
    expect(applyRtlMapping('hover:cursor-w-resize')).toBe(
      'hover:cursor-w-resize rtl:hover:cursor-e-resize'
    )
  });

  it('transforms cn-rtl-flip marker to rtl:rotate-180', () => {
    expect(applyRtlMapping('cn-rtl-flip size-4')).toBe('rtl:rotate-180 size-4');
    expect(applyRtlMapping('size-4 cn-rtl-flip')).toBe('size-4 rtl:rotate-180');
    expect(applyRtlMapping('cn-rtl-flip')).toBe('rtl:rotate-180');
  });

  it('transforms cn-rtl-flip with other RTL mappings', () => {
    expect(applyRtlMapping('cn-rtl-flip ml-2')).toBe('rtl:rotate-180 ms-2');
  });

  it('does not add logical side selectors without cn-logical-sides marker', () => {
    // Without marker, no logical selectors added.
    expect(applyRtlMapping('data-[side=left]:top-1')).toBe(
      'data-[side=left]:top-1'
    )
  });

  it('does not transform positioning classes inside physical side variants', () => {
    // Physical side variants (data-[side=left], data-[side=right]) should keep
    // physical positioning because the side is physical, not logical.
    // e.g., tooltip on physical left needs arrow on physical right.
    expect(applyRtlMapping('data-[side=left]:-right-1')).toBe(
      'data-[side=left]:-right-1'
    )
    expect(applyRtlMapping('data-[side=right]:-left-1')).toBe(
      'data-[side=right]:-left-1'
    )
    expect(applyRtlMapping('data-[side=left]:right-0')).toBe(
      'data-[side=left]:right-0'
    )
    expect(applyRtlMapping('data-[side=right]:left-0')).toBe(
      'data-[side=right]:left-0'
    )
  });

  it('still transforms non-positioning classes inside physical side variants', () => {
    // Other classes like margins, padding should still be transformed.
    expect(applyRtlMapping('data-[side=left]:ml-2')).toBe(
      'data-[side=left]:ms-2'
    )
    expect(applyRtlMapping('data-[side=right]:pl-4')).toBe(
      'data-[side=right]:ps-4'
    )
    expect(applyRtlMapping('data-[side=left]:text-left')).toBe(
      'data-[side=left]:text-start'
    )
  });

  it('skips classes with rtl: prefix', () => {
    expect(applyRtlMapping('rtl:ml-2')).toBe('rtl:ml-2');
    expect(applyRtlMapping('rtl:text-right')).toBe('rtl:text-right');
    expect(applyRtlMapping('rtl:space-x-reverse')).toBe('rtl:space-x-reverse');
  });

  it('skips classes with ltr: prefix', () => {
    expect(applyRtlMapping('ltr:ml-2')).toBe('ltr:ml-2');
    expect(applyRtlMapping('ltr:text-left')).toBe('ltr:text-left');
  });

  it('skips rtl:/ltr: classes but transforms others in same string', () => {
    expect(applyRtlMapping('ml-2 rtl:mr-2')).toBe('ms-2 rtl:mr-2');
    expect(applyRtlMapping('ltr:pl-4 pr-4')).toBe('ltr:pl-4 pe-4');
    expect(applyRtlMapping('text-left rtl:text-right ltr:text-left')).toBe(
      'text-start rtl:text-right ltr:text-left'
    )
  });

  it('skips manually specified ltr:/rtl: translate pairs', () => {
    expect(applyRtlMapping('ltr:-translate-x-1/2 rtl:-translate-x-1/2')).toBe(
      'ltr:-translate-x-1/2 rtl:-translate-x-1/2'
    )
  });

  it('preserves empty segments from leading, trailing and repeated spaces', () => {
    expect(applyRtlMapping(' ml-2  mr-2 ')).toBe(' ms-2  me-2 ');
    expect(applyRtlMapping('')).toBe('');
  });

  it('leaves a variant without a value unchanged', () => {
    expect(applyRtlMapping('hover: ml-2')).toBe('hover: ms-2');
  });

  it('only splits classes on spaces', () => {
    // Current behavior: a tab or newline does not separate classes, so only the first one is mapped.
    expect(applyRtlMapping('ml-2\tmr-2')).toBe('ms-2\tmr-2');
    expect(applyRtlMapping('text-left\nmr-2')).toBe('text-left\nmr-2');
  });

  it('preserves modifiers on slide animations inside logical side variants', () => {
    expect(
      applyRtlMapping('data-[side=inline-start]:slide-in-from-right-2/50')
    ).toBe('data-[side=inline-start]:slide-in-from-end-2/50')
  });

  it('preserves modifiers together with variant prefixes', () => {
    expect(applyRtlMapping('hover:border-l-red-500/50')).toBe(
      'hover:border-s-red-500/50'
    )
    expect(applyRtlMapping('data-[state=open]:bg-muted/50')).toBe(
      'data-[state=open]:bg-muted/50'
    )
  });

  it('is not idempotent for classes that add an rtl: variant', () => {
    const once = applyRtlMapping(
      'translate-x-2 space-x-2 divide-x-2 cursor-w-resize cn-rtl-flip ml-2'
    )
    expect(once).toBe(
      'translate-x-2 rtl:-translate-x-2 space-x-2 rtl:space-x-reverse divide-x-2 rtl:divide-x-reverse cursor-w-resize rtl:cursor-e-resize rtl:rotate-180 ms-2'
    )
    // Current behavior: a second pass appends the rtl: variants again.
    expect(applyRtlMapping(once)).toBe(
      'translate-x-2 rtl:-translate-x-2 rtl:-translate-x-2 space-x-2 rtl:space-x-reverse rtl:space-x-reverse divide-x-2 rtl:divide-x-reverse rtl:divide-x-reverse cursor-w-resize rtl:cursor-e-resize rtl:cursor-e-resize rtl:rotate-180 ms-2'
    )
  });
});

const rtl = (source: string, path = 'Foo.svelte') => transformDirection(path, source);
const ui = (path: string) => readFileSync(new URL(`../../../apps/docs/registry/bases/base/ui/${path}`, import.meta.url), 'utf8');

describe('transformDirection', () => {
  it('maps a static class attribute on elements and components', () => {
    expect(rtl(`<div class="ml-2 mr-4 text-left">foo</div>\n<Icon class="cn-rtl-flip size-4" />`)).toBe(`<div class="ms-2 me-4 text-start">foo</div>\n<Icon class="rtl:rotate-180 size-4" />`);
  });

  it('maps the strings of the first cn() call in a class expression, keeping their quotes', () => {
    expect(rtl(`<span class={cn('pl-2', "pr-2", isActive ? 'left-0' : "right-0", isOpen && 'mr-1', classProp)}></span>`)).toBe(
      `<span class={cn('ps-2', "pe-2", isActive ? 'start-0' : "end-0", isOpen && 'me-1', classProp)}></span>`,
    );
  });

  it('skips bare strings, ternaries outside cn(), nested cn() and template literals', () => {
    const source = `<div class={'ml-2'}></div>\n<div class={isOpen ? 'ml-2' : 'mr-2'}></div>\n<div class={cn(cn('ml-2'), 'mr-2')}></div>\n<div class={cn(\`pl-2\`, 'pr-2')}></div>`;
    expect(rtl(source)).toBe(`<div class={'ml-2'}></div>\n<div class={isOpen ? 'ml-2' : 'mr-2'}></div>\n<div class={cn(cn('ml-2'), 'me-2')}></div>\n<div class={cn(\`pl-2\`, 'pe-2')}></div>`);
  });

  it('maps the cn() call in a quoted class expression', () => {
    expect(rtl(`<div class="{cn('ml-2', x)}"></div>`)).toBe(`<div class="{cn('ms-2', x)}"></div>`);
  });

  it('quotes an unquoted static class that gains a class', () => {
    expect(rtl(`<div class=translate-x-2></div>\n<div class=ml-2></div>`)).toBe(`<div class="translate-x-2 rtl:-translate-x-2"></div>\n<div class=ms-2></div>`);
  });

  it('maps the class of merged props, as upstream maps mergeProps({ className })', () => {
    const source = `<script lang="ts">\n  const hostProps = $derived({ 'data-slot': 'x', ...props, class: cn('top-1 right-1', isOpen && 'pl-2', classProp) });\n  const other = $derived({ ...props, class: 'ml-2' });\n  const plain = { size: 'sm', class: 'ml-2' };\n</script>`;
    expect(rtl(source)).toBe(
      `<script lang="ts">\n  const hostProps = $derived({ 'data-slot': 'x', ...props, class: cn('top-1 end-1', isOpen && 'ps-2', classProp) });\n  const other = $derived({ ...props, class: 'ms-2' });\n  const plain = { size: 'sm', class: 'ml-2' };\n</script>`,
    );
  });

  it('leaves a class attribute that mixes text and expressions', () => {
    const source = `<div class="ml-2 {extra}"></div>`;
    expect(rtl(source)).toBe(source);
  });

  it('maps cva base and variant strings but not compoundVariants or template literals', () => {
    const source = `const itemVariants = cva('translate-x-2', {\n  variants: {\n    size: { sm: 'pl-2', lg: \`pr-2\` },\n  },\n  compoundVariants: [{ size: 'sm', class: 'ml-2' }],\n  defaultVariants: { size: 'sm' },\n});\n`;
    expect(rtl(source, 'variants.ts')).toBe(
      `const itemVariants = cva('translate-x-2 rtl:-translate-x-2', {\n  variants: {\n    size: { sm: 'ps-2', lg: \`pr-2\` },\n  },\n  compoundVariants: [{ size: 'sm', class: 'ml-2' }],\n  defaultVariants: { size: 'sm' },\n});\n`,
    );
  });

  it('maps each string once, however deeply a cva variant nests', () => {
    expect(rtl(`cva('flex', { variants: { orientation: { horizontal: { start: 'translate-x-2 ml-2' } } } });`, 'v.ts')).toBe(
      `cva('flex', { variants: { orientation: { horizontal: { start: 'translate-x-2 rtl:-translate-x-2 ms-2' } } } });`,
    );
  });

  it('maps classNames properties, skipping logical arguments and a variant key', () => {
    const source = `<DayPicker classNames={{ root: cn('w-fit', d.root), nav: cn('absolute right-1 top-0', isRtl ? 'pl-2' : 'pr-2', isRtl && 'ml-2', d.nav), day: someHelper('pl-2'), button_previous: 'left-1', nested: { day: 'pr-1' }, variant: 'ml-2', ...classNames }} />`;
    expect(rtl(source)).toBe(
      `<DayPicker classNames={{ root: cn('w-fit', d.root), nav: cn('absolute end-1 top-0', isRtl ? 'ps-2' : 'pe-2', isRtl && 'ml-2', d.nav), day: someHelper('ps-2'), button_previous: 'start-1', nested: { day: 'pe-1' }, variant: 'ml-2', ...classNames }} />`,
    );
  });

  it('escapes the quote a mapped string is written with', () => {
    expect(rtl(`<div class={cn('ml-1 after:content-[\\'x\\']')}></div>`)).toBe(`<div class={cn('ms-1 after:content-[\\'x\\']')}></div>`);
  });

  it('escapes line breaks in a mapped string', () => {
    expect(rtl(`<div class={cn('ml-2\\n pl-2')}></div>`)).toBe(`<div class={cn('ms-2\\n ps-2')}></div>`);
  });

  it('leaves unchanged strings byte for byte', () => {
    const source = `<div class={cn('a\\x41', "it's")}></div>\n<p class="flex &amp; gap-2"></p>`;
    expect(rtl(source)).toBe(source);
  });

  it('maps the side prop of the listed menus only', () => {
    const source = `<ContextMenuContent side="right" />\n<DropdownMenuSubContent side="left">x</DropdownMenuSubContent>\n<ContextMenuSubContent side={side} />\n<ContextMenuContent side="top" />\n<SomeOtherComponent side="right" />`;
    expect(rtl(source)).toBe(
      `<ContextMenuContent side="inline-end" />\n<DropdownMenuSubContent side="inline-start">x</DropdownMenuSubContent>\n<ContextMenuSubContent side={side} />\n<ContextMenuContent side="top" />\n<SomeOtherComponent side="right" />`,
    );
  });

  it('maps the side default of a listed component file, not of other files or nested function declarations', () => {
    const script = `<script lang="ts">\n  let { side = 'right', align = 'start', ...props } = $props();\n  function Inner({ side = 'right' }) {}\n  const f = ({ side = 'left' }) => side;\n</script>\n`;
    expect(rtl(script, 'context-menu/ContextMenuContent.svelte')).toBe(
      `<script lang="ts">\n  let { side = 'inline-end', align = 'start', ...props } = $props();\n  function Inner({ side = 'right' }) {}\n  const f = ({ side = 'inline-start' }) => side;\n</script>\n`,
    );
    expect(rtl(script, 'sheet/SheetContent.svelte')).toBe(script);
  });

  it('maps a side default inside a listed function declaration in a module', () => {
    expect(rtl(`export function DropdownMenuSubContent({ side = 'right', ...props }) {}\nexport function Sidebar({ side = 'right' }) {}`, 'menus.ts')).toBe(
      `export function DropdownMenuSubContent({ side = 'inline-end', ...props }) {}\nexport function Sidebar({ side = 'right' }) {}`,
    );
  });

  it('preserves CRLF line endings', () => {
    expect(rtl(`<script lang="ts">\r\n  let { side = 'right' } = $props();\r\n</script>\r\n<div class={cn(\r\n  'ml-2',\r\n  'pr-4'\r\n)}></div>\r\n`, 'ContextMenuSubContent.svelte')).toBe(
      `<script lang="ts">\r\n  let { side = 'inline-end' } = $props();\r\n</script>\r\n<div class={cn(\r\n  'ms-2',\r\n  'pe-4'\r\n)}></div>\r\n`,
    );
  });

  it('returns files it cannot hold classes unchanged', () => {
    expect(rtl('.a { margin-left: 1px }', 'x.css')).toBe('.a { margin-left: 1px }');
  });

  it('turns the registry Button Group into logical corners and borders', () => {
    const out = rtl(ui('button-group/variants.ts'), 'button-group/variants.ts');
    expect(out).toContain("'cn-button-group-orientation-horizontal *:data-slot:rounded-e-none [&>[data-slot]~[data-slot]]:rounded-s-none [&>[data-slot]~[data-slot]]:border-s-0'");
    expect(out).toContain("'cn-button-group-orientation-vertical flex-col *:data-slot:rounded-b-none [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0'");
  });

  it('maps the registry Bubble content class', () => {
    expect(rtl(ui('bubble/BubbleContent.svelte'), 'bubble/BubbleContent.svelte')).toContain('[button]:text-start');
  });

  it('reads the component name from a Windows path', () => {
    expect(rtl(ui('context-menu/ContextMenuContent.svelte'), 'context-menu\\ContextMenuContent.svelte')).toContain("side = 'inline-end',");
  });

  it('opens the registry menus toward the inline end', () => {
    expect(rtl(ui('context-menu/ContextMenuContent.svelte'), 'context-menu/ContextMenuContent.svelte')).toContain("side = 'inline-end',");
    expect(rtl(ui('context-menu/ContextMenuSubContent.svelte'), 'context-menu/ContextMenuSubContent.svelte')).toContain('side="inline-end"');
    expect(rtl(ui('dropdown-menu/DropdownMenuSubContent.svelte'), 'dropdown-menu/DropdownMenuSubContent.svelte')).toContain("side = 'inline-end'");
    expect(rtl(ui('dropdown-menu/DropdownMenuContent.svelte'), 'dropdown-menu/DropdownMenuContent.svelte')).toContain("side = 'bottom'");
  });
});
