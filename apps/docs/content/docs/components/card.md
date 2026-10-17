---
title: Card
description: Displays a card with header, content, and footer.
---

<ComponentPreview name="base/CardDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add card
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/card`.

<ComponentSource name="card" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#lib/components/ui/card';
</script>
```

```svelte
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Composition

Use the following composition to build a `Card`:

```text
Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter
```

## Size

Use the `size="sm"` prop to set the size of the card to small. The small size variant uses smaller spacing.

<ComponentPreview name="base/CardSmallExample" />

## Spacing

In addition to the `size` prop, you can use the `--card-spacing` CSS variable to control the spacing between sections and the inset of card parts.

<ComponentPreview name="base/CardSpacingExample" />

Use negative margins with `-mx-(--card-spacing)` to make content go edge to edge while keeping it aligned with the card inset. When the edge-to-edge content sits above a footer, use `-mb-(--card-spacing)` on `CardContent` to remove the section gap.

<ComponentPreview name="base/CardEdgeToEdgeExample" />

## Image

Add an image before the card header to create a card with an image.

<ComponentPreview name="base/CardImageExample" />

## RTL

Wrap the card in a [DirectionProvider](/docs/components/direction) and set `dir` on `Card`. Use the buttons to switch the language.

<ComponentPreview name="base/CardRtlExample" />

## API Reference

### Card

The `Card` component is the root container for card content.

| Prop    | Type                | Default     |
| ------- | ------------------- | ----------- |
| `size`  | `"default" \| "sm"` | `"default"` |
| `class` | `string`            | -           |

### CardHeader

The `CardHeader` component is used for a title, description, and optional action.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### CardTitle

The `CardTitle` component is used for the card title.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### CardDescription

The `CardDescription` component is used for helper text under the title.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### CardAction

The `CardAction` component places content in the top-right of the header (for example, a button or a badge).

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### CardContent

The `CardContent` component is used for the main card body.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### CardFooter

The `CardFooter` component is used for actions and secondary content at the bottom of the card.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

## Changelog

### Spacing Variable

If you're upgrading from a previous version of the `Card` component, you'll need to apply the following updates to use the `--card-spacing` variable. The card's classes live in your style's stylesheet, as the `.cn-card` rules:

<Steps>

### Update the Card root spacing classes.

Replace the hard-coded gap and vertical padding with `--card-spacing`, and set the default and small size values on the root:

```diff
  .cn-card {
    @apply ring-foreground/10 bg-card text-card-foreground overflow-hidden rounded-xl text-sm ring-1 ...;
-   @apply gap-4 py-4 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 ...;
+   @apply gap-(--card-spacing) py-(--card-spacing) [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 ...;
  }
```

### Update CardHeader spacing classes.

Replace the horizontal padding and border spacing with the shared variable:

```diff
  .cn-card-header {
-   @apply px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 ...;
+   @apply px-(--card-spacing) [.border-b]:pb-(--card-spacing) ...;
  }
```

### Update CardContent and CardFooter spacing classes.

Use `--card-spacing` for the content inset and footer padding:

```diff
  .cn-card-content {
-   @apply px-4 group-data-[size=sm]/card:px-3;
+   @apply px-(--card-spacing);
  }
```

```diff
  .cn-card-footer {
-   @apply p-4 group-data-[size=sm]/card:p-3 ...;
+   @apply p-(--card-spacing) ...;
  }
```

</Steps>

After applying these changes, you can customize card spacing by setting `--card-spacing` on the `Card` with an arbitrary property class:

```svelte
<Card class="[--card-spacing:--spacing(6)]">...</Card>
```
