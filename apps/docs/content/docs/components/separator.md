---
title: Separator
description: Visually or semantically separates content.
---

<ComponentPreview name="base/SeparatorDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add separator
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/separator`.

<ComponentSource name="separator" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Separator } from '#lib/components/ui/separator';
</script>
```

```svelte
<Separator />
```

## Vertical

Use `orientation="vertical"` for a vertical separator.

<ComponentPreview name="base/SeparatorVerticalExample" />

## Menu

Vertical separators between menu items with descriptions.

<ComponentPreview name="base/SeparatorMenuExample" />

## List

Horizontal separators between list items.

<ComponentPreview name="base/SeparatorListExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Set `dir` on the container, as the `Separator` follows the layout direction. Use the language selector to switch the language.

<ComponentPreview name="base/SeparatorRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Separator](https://base-ui.com/react/components/separator#api-reference) documentation.

`Separator` is styled on top of the Sveltery Base `Separator` primitive.
