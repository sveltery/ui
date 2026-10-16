---
title: Popover
description: Displays rich content in a portal, triggered by a button.
---

<ComponentPreview name="base/PopoverExample" />

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
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$lib/components/ui/popover';
</script>
```

```svelte
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
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

## API reference

`Popover` is styled on top of the Sveltery Base `Popover` primitive, which owns its positioning, focus handling and dismissal. `PopoverContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props. See the [Base UI Popover documentation](https://base-ui.com/react/components/popover) for the behavior it ports.
