---
title: Aspect Ratio
description: Displays content within a desired ratio.
---

<ComponentPreview name="base/AspectRatioDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add aspect-ratio
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/aspect-ratio`.

<ComponentSource name="aspect-ratio" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { AspectRatio } from '#lib/components/ui/aspect-ratio';
</script>
```

```svelte
<AspectRatio ratio={16 / 9}>
  <img src="..." alt="Image" class="rounded-md object-cover" />
</AspectRatio>
```

## Square

A square aspect ratio component using the `ratio={1 / 1}` prop. This is useful for displaying images in a square format.

<ComponentPreview name="base/AspectRatioSquareExample" />

## Portrait

A portrait aspect ratio component using the `ratio={9 / 16}` prop. This is useful for displaying images in a portrait format.

<ComponentPreview name="base/AspectRatioPortraitExample" />

## RTL

Wrap the figure in a [DirectionProvider](/docs/components/direction) and set `dir` on it. Use the language selector to switch the language.

<ComponentPreview name="base/AspectRatioRtlExample" direction="rtl" />

## API Reference

### AspectRatio

The `AspectRatio` component displays content within a desired ratio.

| Prop    | Type     | Default | Required |
| ------- | -------- | ------- | -------- |
| `ratio` | `number` | -       | Yes      |
| `class` | `string` | -       | No       |
