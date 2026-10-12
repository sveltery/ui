---
title: Button Group
description: A container that groups related buttons together with consistent styling.
---

<ComponentPreview name="base/ButtonGroupExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button-group`.

<ComponentSource name="button-group" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

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
