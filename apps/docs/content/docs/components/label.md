---
title: Label
description: Renders an accessible label associated with controls.
---

<ComponentPreview name="base/LabelExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/label`.

<ComponentSource name="label" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Label } from '$lib/components/ui/label';
</script>
```

```svelte
<Label for="email">Your email address</Label>
```
