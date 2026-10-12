---
title: Aspect Ratio
description: Displays content within a desired ratio.
---

<ComponentPreview name="base/AspectRatioExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/aspect-ratio`.

<ComponentSource name="aspect-ratio" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { AspectRatio } from '$lib/components/ui/aspect-ratio';
</script>
```

```svelte
<AspectRatio ratio={16 / 9}>
  <img src="..." alt="A mountain lake" class="rounded-md object-cover" />
</AspectRatio>
```
