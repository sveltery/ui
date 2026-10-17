---
title: Item
description: A versatile component for displaying content with media, title, description, and actions.
---

<ComponentPreview name="base/ItemExample" />

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
<Item variant="outline">
  <ItemContent>
    <ItemTitle>Basic Item</ItemTitle>
    <ItemDescription>A simple item with title and description.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button variant="outline" size="sm">Action</Button>
  </ItemActions>
</Item>
```

## Link

Pass a `render` snippet to render the item as a link. Spread `props` onto it and render `children` inside it.

```svelte
<Item>
  {#snippet render(props, state, children)}
    <a href="/settings" {...props}>{@render children?.()}</a>
  {/snippet}
  <ItemContent>
    <ItemTitle>Settings</ItemTitle>
  </ItemContent>
</Item>
```
