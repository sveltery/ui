---
title: Skeleton
description: Use to show a placeholder while content is loading.
---

<ComponentPreview name="base/SkeletonExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add skeleton
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/skeleton`.

<ComponentSource name="skeleton" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Skeleton } from '#lib/components/ui/skeleton';
</script>
```

```svelte
<Skeleton class="h-5 w-24 rounded-full" />
```
