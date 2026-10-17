---
title: Badge
description: Displays a badge or a component that looks like a badge.
---

<ComponentPreview name="base/BadgeDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add badge
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Copy the component

Copy the following files into `src/lib/components/ui/badge`.

<ComponentSource name="badge" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Badge } from '#lib/components/ui/badge';
</script>
```

```svelte
<Badge variant="default | outline | secondary | destructive">Badge</Badge>
```

## Variants

Use the `variant` prop to change the variant of the badge.

<ComponentPreview name="base/BadgeVariantsExample" />

## With Icon

You can render an icon inside the badge. Use `data-icon="inline-start"` to render the icon on the left and `data-icon="inline-end"` to render the icon on the right.

<ComponentPreview name="base/BadgeIconExample" />

## With Spinner

You can render a spinner inside the badge. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` prop to the spinner.

<ComponentPreview name="base/BadgeSpinnerExample" />

## Link

Use the `render` snippet to render a link as a badge. Spread `props` onto the element and render `children` inside it.

<ComponentPreview name="base/BadgeLinkExample" />

```svelte
<Badge>
  {#snippet render(props, state, children)}
    <a href="#link" {...props}>{@render children?.()}</a>
  {/snippet}
  Open Link <ArrowUpRightIcon data-icon="inline-end" />
</Badge>
```

## Custom Colors

You can customize the colors of a badge by adding custom classes such as `bg-green-50 dark:bg-green-800` to the `Badge` component.

<ComponentPreview name="base/BadgeColorsExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the badges in a [DirectionProvider](/docs/components/direction) and set `dir` on their container. Use the language selector to switch the language.

<ComponentPreview name="base/BadgeRtlExample" direction="rtl" />

## API Reference

### Badge

The `Badge` component displays a badge or a component that looks like a badge.

| Prop      | Type                                                                          | Default     |
| --------- | ----------------------------------------------------------------------------- | ----------- |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` |
| `class`   | `string`                                                                      | -           |
| `render`  | `Snippet`                                                                     | -           |
