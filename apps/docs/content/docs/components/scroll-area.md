---
title: Scroll Area
description: Augments native scroll functionality for custom, cross-browser styling.
---

<ComponentPreview name="base/ScrollAreaDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add scroll-area
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/scroll-area`.

<ComponentSource name="scroll-area" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { ScrollArea, ScrollBar } from '#lib/components/ui/scroll-area';
</script>
```

```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Your scrollable content here.
</ScrollArea>
```

## Composition

Use the following composition to build a `ScrollArea`:

```text
ScrollArea
└── ScrollBar
```

`ScrollArea` renders the viewport, a vertical `ScrollBar` and the corner. Add a `ScrollBar` with `orientation="horizontal"` inside it for horizontal scrolling.

## Horizontal

Use `ScrollBar` with `orientation="horizontal"` for horizontal scrolling.

<ComponentPreview name="base/ScrollAreaHorizontalDemoExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the scroll area in a [DirectionProvider](/docs/components/direction) and set `dir` on `ScrollArea`. Use the language selector to switch the language.

<ComponentPreview name="base/ScrollAreaRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area#api-reference) documentation.

`ScrollArea` is styled on top of the Sveltery Base `ScrollArea` primitive, which owns the scroll position, thumb sizing and overflow detection.
