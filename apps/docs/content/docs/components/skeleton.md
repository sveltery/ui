---
title: Skeleton
description: Use to show a placeholder while content is loading.
---

<ComponentPreview name="base/SkeletonDemoExample" />

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
<Skeleton class="h-[20px] w-[100px] rounded-full" />
```

## Avatar

<ComponentPreview name="base/SkeletonAvatarExample" />

## Card

<ComponentPreview name="base/SkeletonCardExample" />

## Text

<ComponentPreview name="base/SkeletonTextExample" />

## Form

<ComponentPreview name="base/SkeletonFormExample" />

## Table

<ComponentPreview name="base/SkeletonTableExample" />

## RTL

Wrap the skeletons in a [DirectionProvider](/docs/components/direction) and set `dir` on the container. Use the language selector to switch the language.

<ComponentPreview name="base/SkeletonRtlExample" direction="rtl" align="start" />
