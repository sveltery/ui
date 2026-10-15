---
title: Navigation Menu
description: A collection of links for navigating websites.
---

<ComponentPreview name="base/NavigationMenuExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add navigation-menu
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/navigation-menu`.

<ComponentSource name="navigation-menu" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '$lib/components/ui/navigation-menu';
</script>
```

```svelte
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/docs">Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

Hovering or clicking a trigger opens its content in a shared popup below the menu. Moving to another trigger swaps the content, and Escape or a press outside closes it. The arrow keys move focus between triggers and links.

## Link

`NavigationMenuLink` renders an `<a>`. Pass `active` to mark the current page, which sets `aria-current="page"` and `data-active`. Pass `closeOnClick` to close the menu when the link is clicked. To use another element, such as a router link component, pass a `render` snippet and spread its props onto that element.

Use `navigationMenuTriggerStyle` to style a top-level link like a trigger.

```svelte
<script lang="ts">
  import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu';
</script>

<NavigationMenuItem>
  <NavigationMenuLink href="/docs" class={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
</NavigationMenuItem>
```

## Value

Bind `value` to read or change the open item from outside. Give each `NavigationMenuItem` a `value`. A `null` value closes the menu.

```svelte
<script lang="ts">
  let value = $state<string | null>(null);
</script>

<NavigationMenu bind:value>
  <NavigationMenuList>
    <NavigationMenuItem value="docs">…</NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

Bind the menu with `bind:this` to call its `close` export, which closes the open item, or its `unmount` export, which unmounts a popup that `eventDetails.preventUnmountOnClose()` in `onValueChange` kept mounted.

## API reference

`NavigationMenu` is styled on top of the Sveltery Base `NavigationMenu` primitive, which owns its hover intent, keyboard navigation, focus handling and dismissal. `NavigationMenu` renders the Base portal, positioner, popup and viewport through `NavigationMenuPositioner`, and takes the positioner's `align` prop. `NavigationMenuIndicator` renders the Base `Icon` part with an arrow inside, and goes inside a `NavigationMenuItem`. See the [Base UI Navigation Menu documentation](https://base-ui.com/react/components/navigation-menu) for the behavior it ports.
