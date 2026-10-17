---
title: Context Menu
description: Displays a menu of actions triggered by a right click.
---

<ComponentPreview name="base/ContextMenuDemoExample" align="start" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add context-menu
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
  import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '#lib/components/ui/context-menu';
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

## Basic

A simple context menu with a few actions.

<ComponentPreview name="base/ContextMenuBasicExample" align="start" />

## Submenu

Use `ContextMenuSub` to nest secondary actions. Wrap a `ContextMenuSubTrigger` and a `ContextMenuSubContent` in `ContextMenuSub`. The submenu opens on hover, on Enter and on the arrow key toward its side, and the opposite arrow key closes it.

<ComponentPreview name="base/ContextMenuSubmenuExample" align="start" />

## Shortcuts

Add `ContextMenuShortcut` to show keyboard hints.

<ComponentPreview name="base/ContextMenuShortcutsExample" align="start" />

## Groups

Group related actions and separate them with dividers.

<ComponentPreview name="base/ContextMenuGroupsExample" align="start" />

## Icons

Combine icons with labels for quick scanning.

<ComponentPreview name="base/ContextMenuIconsExample" align="start" />

## Checkboxes

Use `ContextMenuCheckboxItem` for toggles. Bind `checked` to read or change the state. Picking an item does not close the menu.

<ComponentPreview name="base/ContextMenuCheckboxesExample" align="start" />

## Radio

Use `ContextMenuRadioItem` for exclusive choices. Bind `value` on `ContextMenuRadioGroup` to read or change the selection. Picking an item does not close the menu.

<ComponentPreview name="base/ContextMenuRadioExample" align="start" />

## Destructive

Use `variant="destructive"` to style the menu item as destructive.

<ComponentPreview name="base/ContextMenuDestructiveExample" align="start" />

## Sides

Control submenu placement with side and align props. `side` defaults to `right`. Use `inline-start` or `inline-end` to follow the text direction, which flips them in right-to-left layouts.

<ComponentPreview name="base/ContextMenuSidesExample" align="start" />

## RTL

Wrap the context menu in a [DirectionProvider](/docs/components/direction) and set `dir` on `ContextMenuContent` and `ContextMenuSubContent`. Use the language selector to switch the language.

<ComponentPreview name="base/ContextMenuRtlExample" direction="rtl" align="start" />

Use `side="inline-end"` to place the menu on the logical right side of the trigger.

```svelte
<ContextMenu>
  <ContextMenuTrigger>Right click here</ContextMenuTrigger>
  <ContextMenuContent side="inline-end">
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuItem>Team</ContextMenuItem>
    <ContextMenuItem>Subscription</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## API Reference

See the [Base UI Context Menu](https://base-ui.com/react/components/context-menu#api-reference) documentation.

`ContextMenuContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props. `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel` and `ContextMenuSubTrigger` take `inset`, and `ContextMenuItem` also takes `variant` (`default` or `destructive`).
