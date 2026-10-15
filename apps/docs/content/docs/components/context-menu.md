---
title: Context Menu
description: Displays a menu of actions triggered by a right click.
---

<ComponentPreview name="base/ContextMenuExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add context-menu
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/context-menu`.

<ComponentSource name="context-menu" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '$lib/components/ui/context-menu';
</script>
```

```svelte
<ContextMenu>
  <ContextMenuTrigger>Right click here</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuItem>Team</ContextMenuItem>
    <ContextMenuItem>Subscription</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

The menu opens at the pointer on a right click, or on a long press on touch screens. The arrow keys move the highlight, Enter or a click activates an item and closes the menu, and Escape or a press outside closes it. Bind `open` on `ContextMenu` to read or change the state from outside.

## Composition

Use the following composition to build a `ContextMenu`.

```text
ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   ├── ContextMenuItem
    │   └── ContextMenuItem
    ├── ContextMenuSeparator
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   ├── ContextMenuCheckboxItem
    │   └── ContextMenuCheckboxItem
    ├── ContextMenuSeparator
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   └── ContextMenuRadioGroup
    │       ├── ContextMenuRadioItem
    │       └── ContextMenuRadioItem
    └── ContextMenuSub
        ├── ContextMenuSubTrigger
        └── ContextMenuSubContent
            └── ContextMenuGroup
                ├── ContextMenuItem
                └── ContextMenuItem
```

## Checkboxes and radio groups

Bind `checked` on `ContextMenuCheckboxItem` and `value` on `ContextMenuRadioGroup`. Neither closes the menu when picked.

```svelte
<script lang="ts">
  let showBookmarksBar = $state(true);
  let theme = $state('light');
</script>

<ContextMenuContent>
  <ContextMenuCheckboxItem bind:checked={showBookmarksBar}>Show Bookmarks Bar</ContextMenuCheckboxItem>
  <ContextMenuSeparator />
  <ContextMenuRadioGroup bind:value={theme}>
    <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
    <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
  </ContextMenuRadioGroup>
</ContextMenuContent>
```

## Submenus

Wrap a `ContextMenuSubTrigger` and a `ContextMenuSubContent` in `ContextMenuSub`. The submenu opens on hover, on Enter and on the arrow key toward its side, and the opposite arrow key closes it.

```svelte
<ContextMenuSub>
  <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
  <ContextMenuSubContent>
    <ContextMenuItem>Save Page...</ContextMenuItem>
    <ContextMenuItem>Developer Tools</ContextMenuItem>
  </ContextMenuSubContent>
</ContextMenuSub>
```

## Destructive items

Set `variant="destructive"` on `ContextMenuItem` to style an item as destructive.

## Sides

Pass `side` to `ContextMenuContent` to choose where the menu sits against the pointer. It defaults to `right`. Use `inline-start` or `inline-end` to follow the text direction, which flips them in right-to-left layouts.

```svelte
<ContextMenu>
  <ContextMenuTrigger>Right click here</ContextMenuTrigger>
  <ContextMenuContent side="inline-end">
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## Trigger

`ContextMenuTrigger` renders a `<div>` that covers the area to listen on. Pass `class` to size and style it. To use another element, pass a `render` snippet and spread its props onto that element.

## API reference

`ContextMenu` is styled on top of the Sveltery Base `ContextMenu` primitive, which owns pointer anchoring, long press, keyboard navigation, typeahead, focus handling and dismissal. `ContextMenuContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props. `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel` and `ContextMenuSubTrigger` take `inset`, and `ContextMenuItem` also takes `variant` (`default` or `destructive`). See the [Base UI Context Menu documentation](https://base-ui.com/react/components/context-menu) for the behavior it ports.
