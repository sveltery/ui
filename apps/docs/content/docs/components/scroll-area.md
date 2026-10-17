---
title: Scroll Area
description: Augments native scroll functionality for custom, cross-browser styling.
---

<ComponentPreview name="base/ScrollAreaExample" />

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
  import { ScrollArea, ScrollBar } from '$lib/components/ui/scroll-area';
</script>
```

```svelte
<ScrollArea class="h-72 w-48 rounded-md border">
  <div class="p-4">Long content</div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

## API reference

`ScrollArea` is styled on top of the Sveltery Base `ScrollArea` primitive, which owns the scroll position, thumb sizing and overflow detection. `ScrollArea` renders the viewport, a vertical `ScrollBar` and the corner. Add a `ScrollBar` with `orientation="horizontal"` inside it for horizontal scrolling. See the [Base UI Scroll Area documentation](https://base-ui.com/react/components/scroll-area) for the behavior it ports.
