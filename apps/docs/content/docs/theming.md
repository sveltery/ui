---
title: Theming
description: Change the look of every component with CSS variables.
order: 3
---

Components use semantic color tokens such as `background`, `foreground` and `primary`. Tailwind maps each token to a utility, so `bg-primary` reads `var(--primary)`. To change the look of your app, change the token values. You do not need to rewrite component classes.

```svelte
<div class="bg-background text-foreground">Hello</div>
```

## Tokens come in pairs

Each surface token has a `-foreground` token for the text and icons on that surface. For example, `primary` pairs with `primary-foreground`:

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

## The token list

| Token | Used for |
| --- | --- |
| `background`, `foreground` | The page and its text |
| `card`, `card-foreground` | Cards |
| `popover`, `popover-foreground` | Popovers, menus and dialogs |
| `primary`, `primary-foreground` | Primary buttons and strong accents |
| `secondary`, `secondary-foreground` | Secondary buttons |
| `muted`, `muted-foreground` | Subtle backgrounds and secondary text |
| `accent`, `accent-foreground` | Hover and active states |
| `destructive` | Destructive actions and errors |
| `border`, `input`, `ring` | Borders, form controls and focus rings |
| `chart-1` to `chart-5` | Charts |
| `sidebar` and its pairs | Sidebars |
| `radius` | The base corner radius. `rounded-sm` to `rounded-4xl` derive from it |

## Default theme

`npx @sveltery/ui@latest init` adds these tokens to your global stylesheet. To set them by hand, copy them in. The `.dark` block overrides them for [dark mode](/docs/dark-mode).

To pick a theme, fonts and radius visually, use the [Create page](/create). It gives you a preset code to pass to `init`, as in `npx @sveltery/ui@latest init --preset <code>`.

```css title="src/app.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}
```

## Base colors

`init` writes one set of tokens: the base color you pick with `--base-color`, such as `neutral` or `zinc`. A preset from the [Create page](/create) also merges in its accent theme, such as `blue`. The registry serves every base color and accent theme at `https://ui.sveltery.dev/r/themes/<name>.json`, with its light and dark tokens under `cssVars`.

To recolor part of a page, put another theme's tokens on a class and add the class to an element. Everything inside it uses those tokens.

```css title="src/app.css"
.theme-blue {
  --primary: oklch(0.488 0.243 264.376);
  --primary-foreground: oklch(0.97 0.014 254.604);
}
.dark .theme-blue {
  --primary: oklch(0.424 0.199 265.638);
}
```

```svelte
<div class="theme-blue">
  <Button>Blue</Button>
</div>
```

## Styling open triggers

Upstream shadcn/ui class strings use `data-open:` on trigger elements, such as a sidebar menu button that opens a dropdown menu. Base UI sets `data-open` on popups, panels and accordion items, not on most triggers, so those classes never apply here. This is a deliberate fix of an upstream mismatch. Use the attribute the trigger really sets.

| Trigger | Attribute | Example class |
| --- | --- | --- |
| Menu, popover, dialog, tooltip, navigation menu | `data-popup-open` | `data-popup-open:bg-accent` |
| Collapsible and accordion triggers | `data-panel-open` | `data-panel-open:rotate-90` |
| Any trigger with `aria-expanded` | `aria-expanded` | `aria-expanded:bg-muted` |

Popups and panels, such as `DropdownMenuContent`, `CollapsibleContent` and the collapsible root, do set `data-open` and `data-closed`. A `group-data-open/collapsible:rotate-90` class on a chevron works when `group/collapsible` sits on the collapsible root.
