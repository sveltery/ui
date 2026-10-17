---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
---

<ComponentPreview name="base/TooltipDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

<Steps>

### Run the following command

```bash
npx @sveltery/ui@latest add tooltip
```

### Add the `TooltipProvider` to the root of your app

```svelte showLineNumbers title="src/routes/+layout.svelte" {3,8-10}
<script lang="ts">
  import './layout.css';
  import { TooltipProvider } from '#lib/components/ui/tooltip';

  let { children } = $props();
</script>

<TooltipProvider>
  {@render children()}
</TooltipProvider>
```

</Steps>

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/tooltip`.

<ComponentSource name="tooltip" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

### Add the `TooltipProvider` to the root of your app

```svelte showLineNumbers title="src/routes/+layout.svelte" {3,8-10}
<script lang="ts">
  import './layout.css';
  import { TooltipProvider } from '#lib/components/ui/tooltip';

  let { children } = $props();
</script>

<TooltipProvider>
  {@render children()}
</TooltipProvider>
```

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

## Side

Use the `side` prop to change the position of the tooltip.

<ComponentPreview name="base/TooltipSidesExample" />

## With Keyboard Shortcut

<ComponentPreview name="base/TooltipKeyboardExample" />

## Disabled Button

Show a tooltip on a disabled button by wrapping it with a span. A disabled button gets no pointer events, so render the trigger as the `<span>` around the button.

<ComponentPreview name="base/TooltipDisabledExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the tooltips in a [DirectionProvider](/docs/components/direction) and set `dir` on `TooltipContent`. Use the language selector to switch the language.

<ComponentPreview name="base/TooltipRtlExample" direction="rtl" />

## API Reference

See the [Base UI Tooltip](https://base-ui.com/react/components/tooltip#api-reference) documentation.

`Tooltip` is styled on top of the Sveltery Base `Tooltip` primitive, which owns its behavior, positioning and accessibility. `TooltipContent` renders the Base portal, positioner, popup and arrow, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props.
