---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
---

<ComponentPreview name="base/TooltipDemoExample" />

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

## Composition

Use the following composition to build a `Tooltip`:

```text
Tooltip
├── TooltipTrigger
└── TooltipContent
```

## Provider

`TooltipProvider` shares delays across the tooltips inside it. Once one tooltip opens, the next opens at once while the pointer moves between triggers. It sets `delay` to `0` by default. Without a provider, a tooltip waits 600 ms, which you can change with `delay` on `TooltipTrigger`.

```svelte
<TooltipProvider>
  <Tooltip>…</Tooltip>
  <Tooltip>…</Tooltip>
</TooltipProvider>
```

## Trigger

`TooltipTrigger` renders a `<button>`. Pass `class` to style it, for example with `buttonVariants`. To use another element or component, pass a `render` snippet and spread its props onto that element.

## Side

Use the `side` prop to change the position of the tooltip.

<ComponentPreview name="base/TooltipSidesExample" />

## With Keyboard Shortcut

<ComponentPreview name="base/TooltipKeyboardExample" />

## Disabled Button

Show a tooltip on a disabled button by wrapping it with a span. A disabled button gets no pointer events, so render the trigger as the `<span>` around the button.

<ComponentPreview name="base/TooltipDisabledExample" />

## RTL

Wrap the tooltips in a [DirectionProvider](/docs/components/direction) and set `dir` on `TooltipContent`. Use the buttons to switch the language.

<ComponentPreview name="base/TooltipRtlExample" />

## API Reference

See the [Base UI Tooltip](https://base-ui.com/react/components/tooltip#api-reference) documentation.

`Tooltip` is styled on top of the Sveltery Base `Tooltip` primitive, which owns its behavior, positioning and accessibility. `TooltipContent` renders the Base portal, positioner, popup and arrow, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props.
