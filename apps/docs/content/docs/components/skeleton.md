---
title: Skeleton
description: Use to show a placeholder while content is loading.
---

<ComponentPreview name="base/SkeletonExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/skeleton`.

<ComponentSource name="skeleton" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton';
</script>
```

```svelte
<Skeleton class="h-5 w-24 rounded-full" />
```
