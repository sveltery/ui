---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
---

<ComponentPreview name="base/ToggleGroupExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add toggle-group
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/toggle-group`.

<ComponentSource name="toggle-group" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
</script>
```

```svelte
<ToggleGroup multiple>
  <ToggleGroupItem value="bold" aria-label="Toggle bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">Italic</ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">Underline</ToggleGroupItem>
</ToggleGroup>
```

## Value

`value` is the array of pressed item values. Bind it to read and write the selection. Without `multiple`, pressing an item releases the others.

```svelte
<script lang="ts">
  let weight = $state(['normal']);
</script>

<ToggleGroup bind:value={weight} variant="outline">
  <ToggleGroupItem value="light">Light</ToggleGroupItem>
  <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
</ToggleGroup>
```

## Variant and size

`variant` and `size` on the group apply to every item. Without them, each item uses its own.

```svelte
<ToggleGroup variant="outline" size="sm" value={['all']}>
  <ToggleGroupItem value="all">All</ToggleGroupItem>
  <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
</ToggleGroup>
```

## Spacing

`spacing` is the gap between items in spacing units. The default is `2`. With `spacing={0}`, outline items join into one bar.

```svelte
<ToggleGroup variant="outline" spacing={0}>
  <ToggleGroupItem value="top">Top</ToggleGroupItem>
  <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
</ToggleGroup>
```

## Vertical

Arrow keys follow the orientation.

```svelte
<ToggleGroup orientation="vertical" multiple spacing={1}>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>
```

## API reference

`ToggleGroup` and `ToggleGroupItem` are styled on top of the Sveltery Base `ToggleGroup` and `Toggle` primitives, which own the pressed state, roving focus and accessibility. See the [Base UI Toggle Group documentation](https://base-ui.com/react/components/toggle-group) for the behavior they port.
