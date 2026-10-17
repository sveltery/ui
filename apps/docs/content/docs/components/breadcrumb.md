---
title: Breadcrumb
description: Displays the path to the current resource using a hierarchy of links.
---

<ComponentPreview name="base/BreadcrumbDemoExample" class="[&_[data-slot=preview]]:p-2" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add breadcrumb
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Copy the component

Copy the following files into `src/lib/components/ui/breadcrumb`.

<ComponentSource name="breadcrumb" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '#lib/components/ui/breadcrumb';
</script>
```

```svelte
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Composition

Use the following composition to build a `Breadcrumb`:

```text
Breadcrumb
└── BreadcrumbList
    ├── BreadcrumbItem
    │   └── BreadcrumbLink
    ├── BreadcrumbSeparator
    ├── BreadcrumbItem
    │   └── BreadcrumbLink
    ├── BreadcrumbSeparator
    └── BreadcrumbItem
        └── BreadcrumbPage
```

## Basic

A basic breadcrumb with a home link and a components link.

<ComponentPreview name="base/BreadcrumbBasicExample" />

## Custom separator

Use a custom component as `children` for `<BreadcrumbSeparator />` to create a custom separator.

<ComponentPreview name="base/BreadcrumbSeparatorExample" />

## Dropdown

You can compose `<BreadcrumbItem />` with a `<DropdownMenu />` to create a dropdown in the breadcrumb.

<ComponentPreview name="base/BreadcrumbDropdownExample" />

## Collapsed

We provide a `<BreadcrumbEllipsis />` component to show a collapsed state when the breadcrumb is too long.

<ComponentPreview name="base/BreadcrumbEllipsisExample" class="[&_[data-slot=preview]]:p-2" />

## Link component

To use a custom link component from your routing library, you can use the `render` snippet on `<BreadcrumbLink />`. Spread `props` onto your link and render `children` inside it.

<ComponentPreview name="base/BreadcrumbLinkExample" />

```svelte
<BreadcrumbLink>
  {#snippet render(props, state, children)}
    <a href="/components" {...props}>{@render children?.()}</a>
  {/snippet}
  Components
</BreadcrumbLink>
```

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the breadcrumb in a [DirectionProvider](/docs/components/direction) and set `dir` on `Breadcrumb` and `DropdownMenuContent`. Use the language selector to switch the language.

<ComponentPreview name="base/BreadcrumbRtlExample" direction="rtl" class="[&_[data-slot=preview]]:p-2" />

## API Reference

### Breadcrumb

The `Breadcrumb` component is the root navigation element that wraps all breadcrumb components.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### BreadcrumbList

The `BreadcrumbList` component displays the ordered list of breadcrumb items.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### BreadcrumbItem

The `BreadcrumbItem` component wraps individual breadcrumb items.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### BreadcrumbLink

The `BreadcrumbLink` component displays a clickable link in the breadcrumb.

| Prop     | Type      | Default |
| -------- | --------- | ------- |
| `class`  | `string`  | -       |
| `render` | `Snippet` | -       |

### BreadcrumbPage

The `BreadcrumbPage` component displays the current page in the breadcrumb (non-clickable).

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

### BreadcrumbSeparator

The `BreadcrumbSeparator` component displays a separator between breadcrumb items. You can pass custom children to override the default separator icon.

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `children` | `Snippet` | -       |
| `class`    | `string`  | -       |

### BreadcrumbEllipsis

The `BreadcrumbEllipsis` component displays an ellipsis indicator for collapsed breadcrumb items.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |
