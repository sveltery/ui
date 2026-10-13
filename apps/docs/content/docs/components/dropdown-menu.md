---
title: Dropdown Menu
description: Displays a menu to the user, such as a set of actions or functions, triggered by a button.
---

<ComponentPreview name="base/DropdownMenuExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/dropdown-menu`.

<ComponentSource name="dropdown-menu" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
</script>
```

```svelte
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

The arrow keys move the highlight, Enter or a click activates an item and closes the menu, and Escape closes it and returns focus to the trigger. Bind `open` on `DropdownMenu` to read or change the state from outside.

## Checkboxes and radio groups

Bind `checked` on `DropdownMenuCheckboxItem` and `value` on `DropdownMenuRadioGroup`. Neither closes the menu when picked.

```svelte
<script lang="ts">
  let showStatusBar = $state(true);
  let position = $state('bottom');
</script>

<DropdownMenuContent>
  <DropdownMenuCheckboxItem bind:checked={showStatusBar}>Status Bar</DropdownMenuCheckboxItem>
  <DropdownMenuSeparator />
  <DropdownMenuRadioGroup bind:value={position}>
    <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
</DropdownMenuContent>
```

## Submenus

Wrap a `DropdownMenuSubTrigger` and a `DropdownMenuSubContent` in `DropdownMenuSub`. The submenu opens on hover, on Enter and on the arrow key toward its side, and the opposite arrow key closes it.

```svelte
<DropdownMenuSub>
  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
  <DropdownMenuPortal>
    <DropdownMenuSubContent>
      <DropdownMenuItem>Email</DropdownMenuItem>
      <DropdownMenuItem>Message</DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</DropdownMenuSub>
```

## Trigger

`DropdownMenuTrigger` renders a `<button>`. Pass `class` to style it, for example with `buttonVariants`. To use another element, pass a `render` snippet and spread its props onto that element.

## API reference

`DropdownMenu` is styled on top of the Sveltery Base `Menu` primitive, which owns its keyboard navigation, typeahead, focus handling and dismissal. `DropdownMenuContent` renders the Base portal, positioner and popup, and takes the positioner's `side`, `align`, `sideOffset` and `alignOffset` props. `DropdownMenuItem` takes `inset` and `variant` (`default` or `destructive`). See the [Base UI Menu documentation](https://base-ui.com/react/components/menu) for the behavior it ports.
