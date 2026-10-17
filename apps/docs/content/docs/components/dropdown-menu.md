---
title: Dropdown Menu
description: Displays a menu to the user, such as a set of actions or functions, triggered by a button.
---

<ComponentPreview name="base/DropdownMenuDemoExample" align="start" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add dropdown-menu
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/dropdown-menu`.

<ComponentSource name="dropdown-menu" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '#lib/components/ui/dropdown-menu';
</script>
```

```svelte
<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}
      <Button variant="outline" {...props}>{@render content?.()}</Button>
    {/snippet}
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>Team</DropdownMenuItem>
      <DropdownMenuItem>Subscription</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

The arrow keys move the highlight, Enter or a click activates an item and closes the menu, and Escape closes it and returns focus to the trigger. Bind `open` on `DropdownMenu` to read or change the state from outside.

## Composition

Use the following composition to build a `DropdownMenu`.

```text
DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   ├── DropdownMenuItem
    │   └── DropdownMenuItem
    ├── DropdownMenuSeparator
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   ├── DropdownMenuCheckboxItem
    │   └── DropdownMenuCheckboxItem
    ├── DropdownMenuSeparator
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuRadioGroup
    │       ├── DropdownMenuRadioItem
    │       └── DropdownMenuRadioItem
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger
        └── DropdownMenuSubContent
            └── DropdownMenuGroup
                ├── DropdownMenuLabel
                ├── DropdownMenuItem
                └── DropdownMenuItem
```

## Basic

A basic dropdown menu with labels and separators.

<ComponentPreview name="base/DropdownMenuBasicExample" align="start" />

## Submenu

Use `DropdownMenuSub` to nest secondary actions. Wrap a `DropdownMenuSubTrigger` and a `DropdownMenuSubContent` in `DropdownMenuSub`. The submenu opens on hover, on Enter and on the arrow key toward its side, and the opposite arrow key closes it.

<ComponentPreview name="base/DropdownMenuSubmenuExample" align="start" />

## Shortcuts

Add `DropdownMenuShortcut` to show keyboard hints.

<ComponentPreview name="base/DropdownMenuShortcutsExample" align="start" />

## Icons

Combine icons with labels for quick scanning.

<ComponentPreview name="base/DropdownMenuIconsExample" align="start" />

## Checkboxes

Use `DropdownMenuCheckboxItem` for toggles. Bind `checked` to read or change the state. Picking an item does not close the menu.

<ComponentPreview name="base/DropdownMenuCheckboxesExample" align="start" />

## Checkboxes Icons

Add icons to checkbox items.

<ComponentPreview name="base/DropdownMenuCheckboxesIconsExample" align="start" />

## Radio Group

Use `DropdownMenuRadioGroup` for exclusive choices. Bind `value` to read or change the selection. Picking an item does not close the menu.

<ComponentPreview name="base/DropdownMenuRadioGroupExample" align="start" />

## Radio Icons

Show radio options with icons.

<ComponentPreview name="base/DropdownMenuRadioIconsExample" align="start" />

## Destructive

Use `variant="destructive"` for irreversible actions.

<ComponentPreview name="base/DropdownMenuDestructiveExample" align="start" />

## Avatar

An account switcher dropdown triggered by an avatar.

<ComponentPreview name="base/DropdownMenuAvatarExample" align="start" />

## Complex

A richer example combining groups, icons, and submenus.

<ComponentPreview name="base/DropdownMenuComplexExample" align="start" />

## RTL

Wrap the dropdown menu in a [DirectionProvider](/docs/components/direction) and set `dir` on `DropdownMenuContent` and `DropdownMenuSubContent`. Use the language selector to switch the language.

<ComponentPreview name="base/DropdownMenuRtlExample" direction="rtl" align="start" />

## API Reference

See the [Base UI documentation](https://base-ui.com/react/components/menu) for the full API reference.

`DropdownMenuContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props. `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel` and `DropdownMenuSubTrigger` take `inset`, and `DropdownMenuItem` also takes `variant` (`default` or `destructive`).
