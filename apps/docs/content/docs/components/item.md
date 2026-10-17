---
title: Item
description: A versatile component for displaying content with media, title, description, and actions.
---

<ComponentPreview name="base/ItemDemoExample" />

The `Item` component is a straightforward flex container that can house nearly any type of content. Use it to display a title, description, and actions. Group it with the `ItemGroup` component to create a list of items.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add item
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/item`.

<ComponentSource name="item" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '#lib/components/ui/item';
</script>
```

```svelte
<Item>
  <ItemMedia variant="icon">
    <Icon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Title</ItemTitle>
    <ItemDescription>Description</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button>Action</Button>
  </ItemActions>
</Item>
```

## Composition

Use the following composition to build an `Item`:

```text
ItemGroup
└── Item
    ├── ItemHeader
    ├── ItemMedia
    ├── ItemContent
    │   ├── ItemTitle
    │   └── ItemDescription
    ├── ItemActions
    └── ItemFooter
```

## Item vs Field

Use `Field` if you need to display a form input such as a checkbox, input, radio, or select.

If you only need to display content such as a title, description, and actions, use `Item`.

## Variant

Use the `variant` prop to change the visual style of the item.

<ComponentPreview name="base/ItemVariantExample" />

## Size

Use the `size` prop to change the size of the item. Available sizes are `default`, `sm`, and `xs`.

<ComponentPreview name="base/ItemSizeExample" />

## Icon

Use `ItemMedia` with `variant="icon"` to display an icon.

<ComponentPreview name="base/ItemIconExample" />

## Avatar

You can use `ItemMedia` to display an avatar.

<ComponentPreview name="base/ItemAvatarExample" />

## Image

Use `ItemMedia` with `variant="image"` to display an image.

<ComponentPreview name="base/ItemImageExample" />

## Group

Use `ItemGroup` to group related items together.

<ComponentPreview name="base/ItemGroupExample" />

## Header

Use `ItemHeader` to add a header above the item content.

<ComponentPreview name="base/ItemHeaderExample" />

## Link

Use the `render` snippet to render the item as a link. Spread `props` onto the anchor and render `children` inside it. The hover and focus states will be applied to the anchor element.

<ComponentPreview name="base/ItemLinkExample" />

```svelte
<Item>
  {#snippet render(props, state, children)}
    <a href="/dashboard" {...props}>{@render children?.()}</a>
  {/snippet}
  <ItemMedia variant="icon">
    <HomeIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Dashboard</ItemTitle>
    <ItemDescription>Overview of your account and activity.</ItemDescription>
  </ItemContent>
</Item>
```

## Dropdown

<ComponentPreview name="base/ItemDropdownExample" align="start" />

## RTL

Wrap the items in a [DirectionProvider](/docs/components/direction) and set `dir` on them. Use the buttons to switch the language.

<ComponentPreview name="base/ItemRtlExample" align="start" />

## API Reference

### Item

The main component for displaying content with media, title, description, and actions.

| Prop      | Type                                    | Default     |
| --------- | --------------------------------------- | ----------- |
| `variant` | `"default"` \| `"outline"` \| `"muted"` | `"default"` |
| `size`    | `"default"` \| `"sm"` \| `"xs"`         | `"default"` |
| `render`  | `Snippet<[props, state, children]>`     |             |
| `class`   | `string`                                |             |

### ItemGroup

A container that groups related items together with consistent styling.

```svelte
<ItemGroup>
  <Item />
  <Item />
</ItemGroup>
```

### ItemSeparator

A separator between items in a group.

```svelte
<ItemGroup>
  <Item />
  <ItemSeparator />
  <Item />
</ItemGroup>
```

### ItemMedia

Use `ItemMedia` to display media content such as icons, images, or avatars.

| Prop      | Type                                 | Default     |
| --------- | ------------------------------------ | ----------- |
| `variant` | `"default"` \| `"icon"` \| `"image"` | `"default"` |

```svelte
<ItemMedia variant="icon">
  <Icon />
</ItemMedia>
```

```svelte
<ItemMedia variant="image">
  <img src="..." alt="..." />
</ItemMedia>
```

### ItemContent

Wraps the title and description of the item.

```svelte
<ItemContent>
  <ItemTitle>Title</ItemTitle>
  <ItemDescription>Description</ItemDescription>
</ItemContent>
```

### ItemTitle

Displays the title of the item.

```svelte
<ItemTitle>Item Title</ItemTitle>
```

### ItemDescription

Displays the description of the item.

```svelte
<ItemDescription>Item description</ItemDescription>
```

### ItemActions

Container for action buttons or other interactive elements.

```svelte
<ItemActions>
  <Button>Action</Button>
</ItemActions>
```

### ItemHeader

Displays a header above the item content.

```svelte
<Item>
  <ItemHeader>Header</ItemHeader>
  <ItemContent>...</ItemContent>
</Item>
```

### ItemFooter

Displays a footer below the item content.

```svelte
<Item>
  <ItemContent>...</ItemContent>
  <ItemFooter>Footer</ItemFooter>
</Item>
```
