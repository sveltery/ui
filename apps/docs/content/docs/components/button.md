---
title: Button
description: Displays a button or a component that looks like a button.
---

<ComponentPreview name="base/ButtonExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add button
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button`.

<ComponentSource name="button" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>
```

```svelte
<Button variant="outline">Button</Button>
```

## API reference

`Button` is styled on top of the Sveltery Base `Button` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Button documentation](https://base-ui.com/react/components/button) for the behavior it ports.
