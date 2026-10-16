// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { DEFAULT_CSS, fontStyles, mergeTheme } from '../src/css.js';
import type { CssTree, RegistryItem } from '../src/registry.js';

const vars = {
  theme: { 'color-background': 'var(--background)', '--radius-lg': 'var(--radius)' },
  light: { background: 'oklch(1 0 0)', radius: '0.625rem' },
  dark: { background: 'oklch(0.145 0 0)' },
};

test('sets up a stylesheet that only imports Tailwind, in its quote style', () => {
  expect(mergeTheme("@import 'tailwindcss';\n", vars, [DEFAULT_CSS])).toBe(`@import 'tailwindcss';
@import 'tw-animate-css';
@import 'sveltery/tailwind.css';
@custom-variant dark (&:is(.dark *));
:root {
  --background: oklch(1 0 0);
  --radius: 0.625rem;
}
.dark {
  --background: oklch(0.145 0 0);
}
@theme inline {
  --color-background: var(--background);
  --radius-lg: var(--radius);
}
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`);
});

const partial = `@import "tailwindcss";
@plugin "@tailwindcss/forms";
@import "tw-animate-css";

:root {
\t--background: red;
\t--brand: blue;
}

@layer base {
\tbody {
\t\t@apply font-sans;
\t}
}
`;

test('updates values in place, adds what is missing and keeps everything else', () => {
  expect(mergeTheme(partial, vars, [DEFAULT_CSS])).toBe(`@import "tailwindcss";
@plugin "@tailwindcss/forms";
@import "tw-animate-css";
@import "sveltery/tailwind.css";
@custom-variant dark (&:is(.dark *));

:root {
\t--background: oklch(1 0 0);
\t--brand: blue;
\t--radius: 0.625rem;
}

@layer base {
\tbody {
\t\t@apply font-sans;
\t\t@apply bg-background text-foreground;
\t}
\t* {
\t\t@apply border-border outline-ring/50;
\t}
}
.dark {
\t--background: oklch(0.145 0 0);
}
@theme inline {
\t--color-background: var(--background);
\t--radius-lg: var(--radius);
}
`);
});

test('a second merge returns the same bytes', () => {
  for (const css of ["@import 'tailwindcss';\n", partial]) {
    const once = mergeTheme(css, vars, [DEFAULT_CSS]);
    expect(mergeTheme(once, vars, [DEFAULT_CSS])).toBe(once);
  }
});

describe('css trees', () => {
  const merge = (css: string, ...trees: CssTree[]) => mergeTheme(css, {}, trees);

  test('adds imports after the last import in the file\'s quote style, and skips the ones it has', () => {
    const tree: CssTree = { '@import "@fontsource-variable/inter"': {}, '@import "tw-animate-css"': {} };
    expect(merge("@import 'tailwindcss';\n@import 'tw-animate-css';\n@plugin 'x';\n", tree)).toBe(`@import 'tailwindcss';
@import 'tw-animate-css';
@import '@fontsource-variable/inter';
@custom-variant dark (&:is(.dark *));
@plugin 'x';
:root {
}
.dark {
}
@theme inline {
}
`);
  });

  test('merges nested rules, at-rules and declarations into what exists, once', () => {
    const tree: CssTree = { '@layer base': { html: { '@apply font-sans': {}, 'scroll-behavior': 'smooth' }, body: { '@apply text-foreground': {} } } };
    const css = "@import 'tailwindcss';\n@layer base {\n  html {\n    scroll-behavior: auto;\n  }\n}\n";
    const merged = merge(css, tree);
    expect(merged).toBe(`@import 'tailwindcss';
@custom-variant dark (&:is(.dark *));
@layer base {
  html {
    scroll-behavior: smooth;
    @apply font-sans;
  }
  body {
    @apply text-foreground;
  }
}
:root {
}
.dark {
}
@theme inline {
}
`);
    expect(merge(merged, tree)).toBe(merged);
  });

  test('rejects an array value', () => {
    expect(() => merge("@import 'tailwindcss';\n", { '@font-face': ['x'] })).toThrow('Cannot merge the css entry "@font-face": arrays are not supported.');
  });
});

describe('fontStyles', () => {
  const font = (name: string, variable: string, family: string, extra: object = {}): RegistryItem => ({
    $schema: 'https://example.test/schema/registry-item.json',
    name,
    type: 'registry:font',
    files: [],
    font: { family, provider: 'google', import: name, variable, ...extra },
  });

  test('imports fontsource, sets the theme variables and applies the body font to html', () => {
    expect(fontStyles([font('font-inter', '--font-sans', "'Inter Variable', sans-serif", { dependency: '@fontsource-variable/inter' })])).toEqual({
      theme: { '--font-sans': "'Inter Variable', sans-serif" },
      css: { '@import "@fontsource-variable/inter"': {}, '@layer base': { html: { '@apply font-sans': {} } } },
      dependencies: ['@fontsource-variable/inter'],
    });
  });

  test('a heading font gets no class, the package name falls back to the item name, and a selector wins over html', () => {
    expect(
      fontStyles([
        font('font-noto-sans', '--font-sans', 'Noto', { selector: 'body' }),
        font('font-lora', '--font-serif', 'Lora'),
        font('font-heading-playfair-display', '--font-heading', 'Playfair', { dependency: '@fontsource-variable/playfair-display' }),
      ]),
    ).toEqual({
      theme: { '--font-sans': 'Noto', '--font-serif': 'Lora', '--font-heading': 'Playfair' },
      css: {
        '@import "@fontsource-variable/noto-sans"': {},
        '@import "@fontsource-variable/lora"': {},
        '@import "@fontsource-variable/playfair-display"': {},
        '@layer base': { body: { '@apply font-sans': {} }, html: { '@apply font-serif': {} } },
      },
      dependencies: ['@fontsource-variable/noto-sans', '@fontsource-variable/lora', '@fontsource-variable/playfair-display'],
    });
  });

  test('joins the classes for one selector into one @apply', () => {
    expect(fontStyles([font('font-a', '--font-sans', 'A', { dependency: 'a' }), font('font-b', '--font-mono', 'B', { dependency: 'b' })]).css['@layer base']).toEqual({ html: { '@apply font-sans font-mono': {} } });
  });
});
