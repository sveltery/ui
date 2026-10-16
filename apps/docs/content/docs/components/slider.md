---
title: Slider
description: An input where the user selects a value from within a given range.
---

<ComponentPreview name="base/SliderExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add slider
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/slider`.

<ComponentSource name="slider" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Slider } from '$lib/components/ui/slider';
</script>
```

```svelte
<Slider defaultValue={50} max={100} step={1} />
```

## Value

Bind `value` to read and write the position. `defaultValue` is the position an unbound slider starts from. A number renders one thumb, and an array renders one thumb per item.

```svelte
<script lang="ts">
  let range = $state([25, 75]);
</script>

<Slider bind:value={range} min={0} max={100} step={5} />
```

## Vertical

Give a vertical slider a height.

```svelte
<Slider defaultValue={[50]} orientation="vertical" class="h-40" />
```

## Forms

Each thumb holds a range input, so the slider submits one entry per thumb under `name`.

```svelte
<form method="POST">
  <Slider name="price" defaultValue={[20, 80]} />
  <button type="submit">Filter</button>
</form>
```

## API reference

`Slider` is styled on top of the Sveltery Base `Slider` primitive, which owns its value, pointer and keyboard behavior and accessibility. See the [Base UI Slider documentation](https://base-ui.com/react/components/slider) for the behavior it ports.
