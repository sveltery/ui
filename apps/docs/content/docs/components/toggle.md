---
title: Toggle
description: A two-state button that can be either on or off.
---

<ComponentPreview name="base/ToggleExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add toggle
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
  import { Toggle } from '$lib/components/ui/toggle';
</script>
```

```svelte
<Toggle aria-label="Toggle italic">Italic</Toggle>
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

```svelte
<Toggle variant="outline" aria-label="Toggle italic">Italic</Toggle>
```

## Sizes

`size` is `sm`, `default` or `lg`.

```svelte
<Toggle size="sm" aria-label="Toggle small">Small</Toggle>
<Toggle size="lg" aria-label="Toggle large">Large</Toggle>
```

## Disabled

```svelte
<Toggle disabled aria-label="Toggle disabled">Disabled</Toggle>
```

## API reference

`Toggle` is styled on top of the Sveltery Base `Toggle` primitive, which owns its pressed state, keyboard behavior and accessibility. `toggleVariants` returns the class string for `variant` and `size`. See the [Base UI Toggle documentation](https://base-ui.com/react/components/toggle) for the behavior it ports.
