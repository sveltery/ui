---
title: RTL
description: Right-to-left support for Sveltery UI components.
order: 5
---

Sveltery UI components support right-to-left (RTL) layouts for languages such as Arabic, Hebrew and Persian. Sveltery Base reads the direction for keyboard navigation and popup placement, and most component classes use logical properties that follow the document's direction.

<ComponentPreview name="base/DirectionExample" hideCode />

## Get started

<Steps>

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

</Steps>

## What the CLI does not do yet

The shadcn CLI has an `rtl` option in `components.json`. With it, `add` turns physical classes such as `left-*` into logical ones such as `start-*`, and flips arrow and chevron icons with `rtl:rotate-180`. It also has `migrate rtl` for components you installed before.

This CLI has none of these. It copies each component as the registry has it and removes the icon flip markers. A few components still use physical classes or icons that point one way. Change these by hand after you add them:

- [Breadcrumb](/docs/components/breadcrumb): add `rtl:rotate-180` to the separator icon in `BreadcrumbSeparator.svelte`.
- [Pagination](/docs/components/pagination): add `rtl:rotate-180` to the icons in `PaginationPrevious.svelte` and `PaginationNext.svelte`.
- [Carousel](/docs/components/carousel): in `CarouselPrevious.svelte` and `CarouselNext.svelte`, change `-left-12` to `-start-12` and `-right-12` to `-end-12`, and add `rtl:rotate-180` to the icons.
- [Dropdown Menu](/docs/components/dropdown-menu) and [Context Menu](/docs/components/context-menu): in the sub-trigger, change the chevron's `ml-auto` to `ms-auto` and add `rtl:rotate-180` to it.
- [Sidebar](/docs/components/sidebar): add `rtl:rotate-180` to the icon in `SidebarTrigger.svelte`.
- [Calendar](/docs/components/calendar): the next and previous buttons already flip with `rtl:` classes.

Add `rtl:rotate-180` to arrow and chevron icons in your own code too:

```svelte
<ArrowRightIcon class="rtl:rotate-180" />
```

## Popups outside the document direction

Popovers, tooltips and menus render in a portal at the end of `<body>`. With `dir` on `<html>`, they inherit it. If you set `dir` on an inner element instead, pass `dir` to the popup content as well:

```svelte
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent dir="rtl">
    <div>Content</div>
  </PopoverContent>
</Popover>
```
