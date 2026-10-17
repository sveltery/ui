---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
---

<ComponentPreview name="base/TooltipExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add tooltip
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/tooltip`.

<ComponentSource name="tooltip" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from '#lib/components/ui/tooltip';
</script>
```

```svelte
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
```

The tooltip opens when the pointer rests on the trigger or the trigger gets keyboard focus. Escape closes it. A tooltip only describes its trigger. Put anything a user must read or press in a [Popover](/docs/components/popover) instead.

## Provider

`TooltipProvider` shares delays across the tooltips inside it. Once one tooltip opens, the next opens at once while the pointer moves between triggers. It sets `delay` to `0` by default. Without a provider, a tooltip waits 600 ms, which you can change with `delay` on `TooltipTrigger`.

```svelte
<TooltipProvider>
  <Tooltip>…</Tooltip>
  <Tooltip>…</Tooltip>
</TooltipProvider>
```

## Trigger

`TooltipTrigger` renders a `<button>`. Pass `class` to style it, for example with `buttonVariants`. To use another element, pass a `render` snippet and spread its props onto that element. To show a tooltip on a disabled button, render the trigger as a `<span>` around the button, because a disabled button gets no pointer events.

## API reference

`Tooltip` is styled on top of the Sveltery Base `Tooltip` primitive, which owns its behavior, positioning and accessibility. See the [Base UI Tooltip documentation](https://base-ui.com/react/components/tooltip) for the behavior it ports.
