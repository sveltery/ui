// @vitest-environment node
import { expect, test } from 'vitest';
import { mergeTheme } from '../src/css.js';

const vars = {
  theme: { 'color-background': 'var(--background)', '--radius-lg': 'var(--radius)' },
  light: { background: 'oklch(1 0 0)', radius: '0.625rem' },
  dark: { background: 'oklch(0.145 0 0)' },
};

test('sets up a stylesheet that only imports Tailwind, in its quote style', () => {
  expect(mergeTheme("@import 'tailwindcss';\n", vars)).toBe(`@import 'tailwindcss';
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
  expect(mergeTheme(partial, vars)).toBe(`@import "tailwindcss";
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
    const once = mergeTheme(css, vars);
    expect(mergeTheme(once, vars)).toBe(once);
  }
});
