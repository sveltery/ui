---
title: Toggle
description: A two-state button that can be either on or off.
---

<ComponentPreview name="base/ToggleDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add toggle
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/toggle`.

<ComponentSource name="toggle" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Toggle } from '#lib/components/ui/toggle';
</script>
```

```svelte
<Toggle>Toggle</Toggle>
```

## Pressed state

`pressed` holds the state. Pass it to start the toggle on, or bind it to read and write it.

```svelte
<script lang="ts">
  let bold = $state(false);
</script>

<Toggle aria-label="Toggle bold" bind:pressed={bold}>Bold</Toggle>
```

## Outline

Use `variant="outline"` for an outline style.

<ComponentPreview name="base/ToggleOutlineExample" />

## With Text

<ComponentPreview name="base/ToggleTextExample" />

## Size

Use the `size` prop to change the size of the toggle.

<ComponentPreview name="base/ToggleSizesExample" />

## Disabled

<ComponentPreview name="base/ToggleDisabledExample" />

## RTL

Wrap the toggle in a [DirectionProvider](/docs/components/direction) and set `dir` on `Toggle`. Use the buttons to switch the language.

<ComponentPreview name="base/ToggleRtlExample" align="start" />

## API Reference

See the [Base UI Toggle](https://base-ui.com/react/components/toggle#api-reference) documentation.

`Toggle` is styled on top of the Sveltery Base `Toggle` primitive, which owns its pressed state, keyboard behavior and accessibility. `size` is `sm`, `default` or `lg`. `toggleVariants` returns the class string for `variant` and `size`.
