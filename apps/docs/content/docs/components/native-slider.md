---
title: Native Slider
description: A styled native HTML range input that looks like the Slider and works without JavaScript.
---

<ComponentPreview name="base/NativeSliderExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add native-slider
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Copy the component

Copy the following files into `src/lib/components/ui/native-slider`.

<ComponentSource name="native-slider" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NativeSlider } from '#lib/components/ui/native-slider';
</script>
```

```svelte
<NativeSlider name="volume" aria-label="Volume" defaultValue={50} max={100} step={1} />
```

`NativeSlider` is a real `<input type="range">`, and every prop goes on it, including `min`, `max` and `step`. Give it its starting value with `defaultValue`, or the current value with `value`. To show the value, pair it with an `<output>` and update it from `oninput`.

The input carries the Slider's `data-slot="slider"`. Its track and thumb are drawn from the style's Slider rules with the browser's range pseudo-elements.

## When to use it

Use `NativeSlider` when the form must work before the page hydrates or with JavaScript off. The browser handles dragging, the arrow keys, <kbd>Page Up</kbd>, <kbd>Page Down</kbd>, <kbd>Home</kbd> and <kbd>End</kbd>, and the value submits with its form.

A native range input has one thumb and no vertical layout that works the same in every browser. Firefox fills the track left of the thumb with the style's range color; other browsers draw the track in one color, since filling it there would take JavaScript. [Slider](/docs/components/slider) runs on the Sveltery Base `Slider` and has ranges, several thumbs, vertical sliders and the filled track in every browser.

## Remote forms

Spread a number [remote form](/docs/forms/remote-forms) field onto the slider with `as('range')`. See the example on [Native Checkbox](/docs/components/native-checkbox#remote-forms).

```svelte
<Field>
  <FieldLabel for="volume">Emails per week</FieldLabel>
  <NativeSlider id="volume" {...f.fields.volume.as('range')} min={0} max={10} />
</Field>
```
