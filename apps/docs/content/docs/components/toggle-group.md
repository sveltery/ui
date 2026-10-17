---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
---

<ComponentPreview name="base/ToggleGroupDemoExample" />

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
  import { ToggleGroup, ToggleGroupItem } from '#lib/components/ui/toggle-group';
</script>
```

```svelte
<ToggleGroup>
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>
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

## Without JavaScript

`ToggleGroup` needs JavaScript. To get the same look in a form that works without it, hide native checkboxes or radios inside labels that carry the Toggle's classes. See the toggle style on [Native Checkbox](/docs/components/native-checkbox#toggle-style) and its [remote form example](/docs/components/native-select#remote-forms).

## Composition

Use the following composition to build a `ToggleGroup`:

```text
ToggleGroup
├── ToggleGroupItem
└── ToggleGroupItem
```

## Outline

Use `variant="outline"` for an outline style.

<ComponentPreview name="base/ToggleGroupOutlineExample" />

## Size

Use the `size` prop to change the size of the toggle group.

<ComponentPreview name="base/ToggleGroupSizesExample" />

## Spacing

Use `spacing` to add spacing between toggle group items.

<ComponentPreview name="base/ToggleGroupSpacingExample" />

## Vertical

Use `orientation="vertical"` for vertical toggle groups.

<ComponentPreview name="base/ToggleGroupVerticalExample" />

## Disabled

<ComponentPreview name="base/ToggleGroupDisabledExample" />

## Custom

A custom toggle group example.

<ComponentPreview name="base/ToggleGroupFontWeightSelectorExample" />

## RTL

Wrap the toggle group in a [DirectionProvider](/docs/components/direction) and set `dir` on `ToggleGroup`. Use the buttons to switch the language.

<ComponentPreview name="base/ToggleGroupRtlExample" align="start" />

## API Reference

See the [Base UI Toggle Group](https://base-ui.com/react/components/toggle-group#api-reference) documentation.

`ToggleGroup` and `ToggleGroupItem` are styled on top of the Sveltery Base `ToggleGroup` and `Toggle` primitives, which own the pressed state, roving focus and accessibility. `variant` and `size` on the group apply to every item. Without them, each item uses its own. `spacing` is the gap between items in spacing units, and with `spacing={0}` outline items join into one bar. Arrow keys follow `orientation`.

## Changelog

### 2026-05-17 Default Spacing

Changed the default `spacing` from `0` to `2` so toggle groups render with space between items by default. Use `spacing={0}` for connected items.
