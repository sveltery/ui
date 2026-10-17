---
title: Slider
description: An input where the user selects a value from within a given range.
---

<ComponentPreview name="base/SliderDemoExample" />

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
  import { Slider } from '#lib/components/ui/slider';
</script>
```

```svelte
<Slider defaultValue={[33]} max={100} step={1} />
```

## Value

Bind `value` to read and write the position. `defaultValue` is the position an unbound slider starts from. A number renders one thumb, and an array renders one thumb per item.

```svelte
<script lang="ts">
  let range = $state([25, 75]);
</script>

<Slider bind:value={range} min={0} max={100} step={5} />
```

## Forms

Each thumb holds a range input, so the slider submits one entry per thumb under `name`.

```svelte
<form method="POST">
  <Slider name="price" defaultValue={[20, 80]} />
  <button type="submit">Filter</button>
</form>
```

## Without JavaScript

`Slider` needs JavaScript for the keyboard and for a remote form's `as()` spread. For a form that must work before the page hydrates, use [Native Slider](/docs/components/native-slider), a styled native input that looks the same.

## Range

Use an array with two values for a range slider.

<ComponentPreview name="base/SliderRangeExample" />

## Multiple Thumbs

Use an array with multiple values for multiple thumbs.

<ComponentPreview name="base/SliderMultipleExample" />

## Vertical

Use `orientation="vertical"` for a vertical slider.

<ComponentPreview name="base/SliderVerticalExample" />

## Controlled

<ComponentPreview name="base/SliderControlledExample" />

## Disabled

Use the `disabled` prop to disable the slider.

<ComponentPreview name="base/SliderDisabledExample" />

## RTL

Wrap the slider in a [DirectionProvider](/docs/components/direction) and set `dir` on `Slider`. Use the buttons to switch the language.

<ComponentPreview name="base/SliderRtlExample" align="start" />

## API Reference

See the [Base UI Slider](https://base-ui.com/react/components/slider#api-reference) documentation.
