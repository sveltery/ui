// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { inlineStyle } from './inline';
import { analyzeSource } from './source';
import type { StyleSheet } from './styles';

const sheet: StyleSheet = {
  utilities: new Map([
    ['cn-a', 'p-2 text-sm'],
    ['cn-b', "bg-red-500 [&_svg:not([class*='size-'])]:size-4"],
  ]),
};
const inline = (path: string, text: string) => inlineStyle(analyzeSource(path, text), sheet, 'nova');

describe('inlineStyle', () => {
  it('replaces tokens in single, double and template strings of a .ts file and keeps every other byte', () => {
    const source = `import { cva } from 'class-variance-authority';\nexport const v = cva('cn-a flex p-4', {  variants: { size: { sm: "cn-b", md: \`cn-a text-lg\` } } });\n`;
    expect(inline('x/variants.ts', source)).toBe(
      `import { cva } from 'class-variance-authority';\nexport const v = cva('text-sm flex p-4', {  variants: { size: { sm: "bg-red-500 [&_svg:not([class*='size-'])]:size-4", md: \`p-2 text-lg\` } } });\n`,
    );
  });

  it('writes a string with the other quote when a utility holds its quote, and escapes when both appear', () => {
    expect(inline('x/v.ts', `export const v = 'cn-b';`)).toBe(`export const v = "bg-red-500 [&_svg:not([class*='size-'])]:size-4";`);
    expect(inline('x/v.ts', `export const v = 'cn-a [&_[title="x"]]:flex [&_[title=\\'y\\']]:flex';`)).toBe(
      `export const v = 'p-2 text-sm [&_[title="x"]]:flex [&_[title=\\'y\\']]:flex';`,
    );
  });

  it('keeps markers in place after the style utilities and drops other cn-* tokens', () => {
    expect(inline('x/v.ts', `export const v = 'foo cn-rtl-flip cn-nope cn-a bar cn-font-heading';`)).toBe(
      `export const v = 'p-2 text-sm foo cn-rtl-flip bar cn-font-heading';`,
    );
  });

  it('lets the component own utilities win over the style utilities', () => {
    expect(inline('x/v.ts', `export const v = 'cn-a p-6 text-lg';`)).toBe(`export const v = 'p-6 text-lg';`);
  });

  it('leaves a string without a cn-* token alone, whitespace included', () => {
    const source = `export const v = 'a   p-2  p-4';\nexport const w = \`b \${v}\`;`;
    expect(inline('x/v.ts', source)).toBe(source);
  });

  it('rewrites class attributes and expressions in a .svelte file but not text that looks like a string', () => {
    const source = [
      '<script lang="ts">',
      "  import { cn } from 'cn';",
      '  let { class: className } = $props();',
      '</script>',
      "<p>don't use it, it's 'text'</p>",
      `<div class="cn-b mt-2" data-x="y">x</div>`,
      "<span class={cn('cn-a', className)}>y</span>",
      '',
    ].join('\n');
    expect(inline('x/X.svelte', source)).toBe(
      [
        '<script lang="ts">',
        "  import { cn } from 'cn';",
        '  let { class: className } = $props();',
        '</script>',
        "<p>don't use it, it's 'text'</p>",
        `<div class="bg-red-500 [&_svg:not([class*='size-'])]:size-4 mt-2" data-x="y">x</div>`,
        "<span class={cn('p-2 text-sm', className)}>y</span>",
        '',
      ].join('\n'),
    );
  });

  it('throws, naming the file, when a cn-* token is left where it cannot be replaced', () => {
    expect(() => inline('x/v.ts', `export const v = '[&_.cn-a]:flex';`)).toThrow('nova/x/v.ts: cn-* token left outside a class string: cn-a');
    expect(() => inline('x/v.ts', 'const n = 1; export const v = `cn-a ${n}`;')).toThrow('cn-a');
    expect(() => inline('x/X.svelte', '<p data-x="cn-a">x</p>')).toThrow('nova/x/X.svelte: cn-* token left outside a class string: cn-a');
  });
});
