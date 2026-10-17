---
title: Navigation Menu
description: A collection of links for navigating websites.
---

<ComponentPreview name="base/NavigationMenuDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add navigation-menu
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
  import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '#lib/components/ui/navigation-menu';
</script>
```

```svelte
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

Hovering or clicking a trigger opens its content in a shared popup below the menu. Moving to another trigger swaps the content, and Escape or a press outside closes it. The arrow keys move focus between triggers and links.

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

## Composition

Use the following composition to build a `NavigationMenu`:

```text
NavigationMenu
├── NavigationMenuList
│   ├── NavigationMenuItem
│   │   ├── NavigationMenuTrigger
│   │   └── NavigationMenuContent
│   │       ├── NavigationMenuLink
│   │       └── NavigationMenuLink
│   └── NavigationMenuItem
│       ├── NavigationMenuLink
│       └── NavigationMenuIndicator
```

## Link Component

Use `navigationMenuTriggerStyle` to style a top-level link like a trigger. To use another element, such as a router link component, pass a `render` snippet. Spread `props` onto that element and render `children` inside it.

```svelte
<script lang="ts">
  import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '#lib/components/ui/navigation-menu';
</script>

<NavigationMenuItem>
  <NavigationMenuLink class={navigationMenuTriggerStyle()}>
    {#snippet render(props, state, children)}
      <a {...props} href="/docs">{@render children?.()}</a>
    {/snippet}
    Documentation
  </NavigationMenuLink>
</NavigationMenuItem>
```

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the menu in a [DirectionProvider](/docs/components/direction) and set `dir` on `NavigationMenu` and `NavigationMenuContent`. Pass `align="end"` to `NavigationMenu` so the popup lines up with the menu in right-to-left text. Use the language selector to switch the language.

<ComponentPreview name="base/NavigationMenuRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu#api-reference) documentation for more information.

`NavigationMenu` is styled on top of the Sveltery Base `NavigationMenu` primitive. It renders the Base portal, positioner, popup and viewport through `NavigationMenuPositioner`, and takes the positioner's `align` prop. `NavigationMenuIndicator` renders the Base `Icon` part with an arrow inside, and goes inside a `NavigationMenuItem`.
