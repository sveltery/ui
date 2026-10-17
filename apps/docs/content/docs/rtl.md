---
title: RTL
description: Right-to-left support for Sveltery UI components.
order: 5
---

Sveltery UI components support right-to-left (RTL) layouts. Text alignment, positioning and directional styles adapt for languages such as Arabic, Hebrew and Persian. Sveltery Base reads the direction for keyboard navigation and popup placement.

<ComponentPreview name="base/DirectionExample" hideCode />

When you add components, the CLI turns physical positioning classes into logical ones, so your components work in both LTR and RTL layouts.

## Get started

<Steps>

### Turn on RTL in components.json

Run `init` with the `--rtl` flag. You can skip this step if `components.json` already has `"rtl": true`.

```bash
npx @sveltery/ui@latest init --rtl
```

This writes `rtl: true` to `components.json`. Presets take it too, as `init --preset nova --rtl` or `rtl=true` on an `/init` URL.

```json title="components.json"
{
  "$schema": "https://ui.sveltery.dev/schema.json",
  "style": "nova",
  "rtl": true
}
```

### Set the direction on the document

Add `dir="rtl"` and your language to the `html` tag in `src/app.html`. Change `lang="ar"` to your target language.

```html title="src/app.html"
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="text-scale" content="scale" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

### Add DirectionProvider

Add the direction component to your project.

```bash
npx @sveltery/ui@latest add direction
```

Wrap your app in `DirectionProvider` with `direction="rtl"` in your root layout. Base components read it to reverse arrow keys and to place popups.

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
  import './layout.css';
  import { DirectionProvider } from '#lib/components/ui/direction';

  let { children } = $props();
</script>

<DirectionProvider direction="rtl">
  {@render children()}
</DirectionProvider>
```

`DirectionProvider` renders no element, so the `dir` attribute stays yours to set. See [Direction](/docs/components/direction) to switch the direction at runtime.

### Add a font

Use a font that supports your target language. [Noto](https://fonts.google.com/noto) is a good choice and pairs well with Inter and Geist.

Install the font from [Fontsource](https://fontsource.org/fonts/noto-sans-arabic):

```bash
npm install @fontsource-variable/noto-sans-arabic
```

Import it in your CSS file and set it as the sans font:

```css title="src/routes/layout.css"
@import "tailwindcss";
@import "tw-animate-css";
@import "@sveltery/ui/tailwind.css";
@import "@fontsource-variable/noto-sans-arabic";

@theme inline {
  --font-sans: "Noto Sans Arabic Variable", sans-serif;
}
```

For Hebrew, use `@fontsource-variable/noto-sans-hebrew`.

### Add components

You are ready to add components. The CLI handles RTL support for you.

```bash
npx @sveltery/ui@latest add item
```

</Steps>

## How it works

When you add components with `rtl: true` in `components.json`, the CLI changes their classes and props:

- Physical positioning classes such as `left-*` and `right-*` become logical ones such as `start-*` and `end-*`.
- Directional props, such as a submenu's `side="right"`, take logical values such as `side="inline-end"`.
- Text alignment and spacing classes change the same way, for example `text-left` to `text-start` and `ml-*` to `ms-*`.
- Arrow and chevron icons that the registry marks get `rtl:rotate-180`, so they flip.

The CLI uses the same mappings as the shadcn CLI. The examples on the component pages that show an RTL layout render through the same transform.

## Animations

The CLI also changes directional animation classes. For example, `slide-in-from-right` becomes `slide-in-from-end`, so dropdowns, popovers and tooltips animate in the direction of the text.

**Popups outside the document direction**

Popovers, tooltips and menus render in a portal at the end of `<body>`. With `dir` on `<html>`, they inherit it. If you set `dir` on an inner element instead, pass `dir` to the popup content as well:

```svelte
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent dir="rtl">
    <div>Content</div>
  </PopoverContent>
</Popover>
```

## Migrating existing components

If you installed components before you turned on RTL, migrate them with the CLI.

<Steps>

### Run the migrate command

```bash
npx @sveltery/ui@latest migrate rtl [path]
```

`[path]` takes a file, a directory or a glob pattern. Without it, the command migrates every file in the `ui` directory. It also sets `rtl: true` in `components.json`, so later `add` runs transform too.

### Manual Migration (Optional)

The CLI does not migrate the following components. Check them by hand:

- [Calendar](/docs/components/calendar#rtl): pass `dir="rtl"` and a right-to-left locale.
- [Pagination](/docs/components/pagination): add `rtl:rotate-180` to the icons in `PaginationPrevious.svelte` and `PaginationNext.svelte` if they do not flip.
- [Sidebar](/docs/components/sidebar): check the side the sidebar opens from, and add `rtl:rotate-180` to the icon in `SidebarTrigger.svelte` if it does not flip.

### Migrate icons

Icons such as `ArrowRightIcon` or `ChevronLeftIcon` in your own code need the `rtl:rotate-180` class to flip:

```svelte
<ArrowRightIcon class="rtl:rotate-180" />
```

### Add the direction component

Add the direction component, then wrap your app in `DirectionProvider` as [Get started](#get-started) shows.

```bash
npx @sveltery/ui@latest add direction
```

</Steps>
