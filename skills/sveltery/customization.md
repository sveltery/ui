# Customization & Theming

Components read semantic CSS variable tokens. Change a token and every component that uses it changes.

The full guides are [Theming](https://ui.sveltery.dev/docs/theming.md) and [Dark Mode](https://ui.sveltery.dev/docs/dark-mode.md). They win over this page.

## Contents

- How it works
- Color tokens
- Dark mode
- Changing the theme
- Adding custom colors
- Border radius
- Customizing components
- Checking for updates

---

## How It Works

1. `init` writes the tokens to `:root` (light) and `.dark` (dark) in the CSS file at `config.resolvedPaths.tailwindCss`.
2. An `@theme inline` block maps them to Tailwind utilities, so `bg-primary` reads `var(--primary)`.
3. Components use those utilities. Sveltery UI needs Tailwind CSS 4. There is no `tailwind.config.js`.

---

## Color Tokens

Each surface token has a `-foreground` token for text and icons on it.

| Token | Purpose |
| --- | --- |
| `--background` / `--foreground` | The page and its text |
| `--card` / `--card-foreground` | Cards |
| `--popover` / `--popover-foreground` | Popovers, menus and dialogs |
| `--primary` / `--primary-foreground` | Primary buttons and strong accents |
| `--secondary` / `--secondary-foreground` | Secondary buttons |
| `--muted` / `--muted-foreground` | Subtle backgrounds and secondary text |
| `--accent` / `--accent-foreground` | Hover and active states |
| `--destructive` | Destructive actions and errors |
| `--border`, `--input`, `--ring` | Borders, form controls and focus rings |
| `--chart-1` to `--chart-5` | Charts |
| `--sidebar-*` | Sidebars |
| `--radius` | The base corner radius |

Colors use OKLCH: `--primary: oklch(0.205 0 0)` is lightness (0–1), chroma (0 is gray) and hue (0–360).

---

## Dark Mode

Components switch to their dark tokens when an ancestor has the `dark` class. Set it on `<html>`. There is no `next-themes` or `mode-watcher` step in the docs: a small inline script in `src/app.html` applies the saved mode before the first paint, and a toggle flips the class.

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';

  function toggle() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
</script>

<Button variant="ghost" size="icon" onclick={toggle} aria-label="Toggle theme">◐</Button>
```

Fetch [dark-mode.md](https://ui.sveltery.dev/docs/dark-mode.md) for the `app.html` script.

---

## Changing the Theme

```bash
# Apply a preset code from the Create page, re-adding components.
npx @sveltery/ui@latest apply b4xFeBLg4O

# Change only the theme and fonts. Components stay as they are.
npx @sveltery/ui@latest apply b4xFeBLg4O --only theme,font

# Swap the base color in the CSS file.
npx @sveltery/ui@latest migrate base-color --to stone
```

Or edit the tokens in the CSS file directly.

---

## Adding Custom Colors

Edit the CSS file at `config.resolvedPaths.tailwindCss`. Never create a new CSS file for tokens.

```css
/* 1. Define the token for light and dark. */
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

/* 2. Register it with Tailwind. */
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

```svelte
<!-- 3. Use it. -->
<div class="bg-warning text-warning-foreground">Warning</div>
```

To recolor part of a page, put another theme's tokens on a class and add it to an element:

```css
.theme-blue {
  --primary: oklch(0.488 0.243 264.376);
  --primary-foreground: oklch(0.97 0.014 254.604);
}
```

---

## Border Radius

`--radius` sets the base radius. `rounded-sm` to `rounded-4xl` derive from it.

---

## Customizing Components

See also [rules/styling.md](./rules/styling.md).

Prefer these, in order:

### 1. Built-in variants

```svelte
<Button variant="outline" size="sm">Click</Button>
```

### 2. Tailwind classes through `class`

```svelte
<Card class="mx-auto max-w-md">...</Card>
```

### 3. A new variant

Components keep their variants in a `variants.ts` file next to the `.svelte` files, built with `cva`. Add the variant there:

```ts
// src/lib/components/ui/button/variants.ts
warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
```

### 4. Wrapper components

Compose the parts into a component of your own. Take children and callbacks as props, and forward the rest:

```svelte
<!-- src/lib/components/ConfirmDialog.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '#lib/components/ui/alert-dialog';
  import { Button } from '#lib/components/ui/button';

  let { title, description, onconfirm, children }: { title: string; description: string; onconfirm: () => void; children: Snippet } = $props();
</script>

<AlertDialog>
  <AlertDialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    {@render children()}
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{title}</AlertDialogTitle>
      <AlertDialogDescription>{description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onclick={onconfirm}>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Checking for Updates

```bash
npx @sveltery/ui@latest diff                       # every installed item
npx @sveltery/ui@latest diff button                # one item
npx @sveltery/ui@latest add button --diff Button.svelte
```

See [Updating Components in SKILL.md](./SKILL.md#updating-components) for the merge workflow.
