---
title: Button Group
description: A container that groups related buttons together with consistent styling.
---

<ComponentPreview name="base/ButtonGroupExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add button-group
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button-group`.

<ComponentSource name="button-group" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '$lib/components/ui/button-group';
</script>
```

```svelte
<ButtonGroup>
  <Button variant="outline">Archive</Button>
  <Button variant="outline">Report</Button>
</ButtonGroup>
```
