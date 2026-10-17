---
title: Popover
description: Displays rich content in a portal, triggered by a button.
---

<ComponentPreview name="base/PopoverDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add popover
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/popover`.

<ComponentSource name="popover" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '#lib/components/ui/popover';
</script>
```

```svelte
<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Title</PopoverTitle>
      <PopoverDescription>Description text here.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
```

Use a snippet on `render` to render the trigger as your own element, such as a `Button`.

```svelte
<PopoverTrigger>
  {#snippet render(props, _state, content)}
    <Button variant="outline" {...props}>{@render content?.()}</Button>
  {/snippet}
  Open Popover
</PopoverTrigger>
```

Bind `open` to read or change the state from outside.

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<Popover bind:open>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent side="right" align="start">Content</PopoverContent>
</Popover>
```

## Composition

Use the following composition to build a `Popover`:

```text
Popover
├── PopoverTrigger
└── PopoverContent
```

## Basic

A simple popover with a header, title, and description.

<ComponentPreview name="base/PopoverBasicExample" />

## Align

Use the `align` prop on `PopoverContent` to control the horizontal alignment.

<ComponentPreview name="base/PopoverAlignmentsExample" />

## With Form

A popover with form fields inside.

<ComponentPreview name="base/PopoverFormExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the popover in a [DirectionProvider](/docs/components/direction) and set `dir` on `PopoverContent`. Use the language selector to switch the language.

<ComponentPreview name="base/PopoverRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Popover](https://base-ui.com/react/components/popover#api-reference) documentation.

`Popover` is styled on top of the Sveltery Base `Popover` primitive. `PopoverContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props.
