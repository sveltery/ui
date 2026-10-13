---
title: Drawer
description: A panel that slides in from an edge of the screen and can be swiped away.
---

<ComponentPreview name="base/DrawerExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/drawer`.

<ComponentSource name="drawer" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '$lib/components/ui/drawer';
  let open = $state(false);
</script>
```

```svelte
<Drawer bind:open>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

The drawer opens from the bottom edge. Escape, a press outside, the Close button or a swipe toward the edge closes it.

## Position

`swipeDirection` on `Drawer` sets the edge the drawer is attached to and the direction a swipe dismisses it in: `up`, `right`, `down` (default) or `left`. A drawer on the left or right edge is 75% of the viewport wide, and 24rem from the `sm` breakpoint. Pass a class such as `data-[swipe-direction=right]:w-xs` to `DrawerContent` to change the size.

## Swipe handle

`showSwipeHandle` on `Drawer` adds a grab handle on the edge the drawer is swiped from.

## Snap points

`snapPoints` lets the drawer rest at several heights. Numbers from 0 to 1 are fractions of the viewport height, larger numbers are pixels, and strings take `px` or `rem` units. Use `bind:snapPoint` to read or set the active snap point.

```svelte
<Drawer snapPoints={['31rem', 1]} showSwipeHandle>…</Drawer>
```

## Nested drawers

Put a `Drawer` inside a `DrawerContent` to stack drawers. The parent drawer scales back and stays mounted behind the nested one.

## Non-modal

`modal={false}` leaves the page usable while the drawer is open and removes the overlay. Add `disablePointerDismissal` to keep the drawer open when the user presses outside it.

## Trigger

`DrawerTrigger` and `DrawerClose` render a `<button>`. Pass `class` to style them, for example with `buttonVariants`. To use another element, pass a `render` snippet and spread its props onto that element.

## API reference

`Drawer` is styled on top of the Sveltery Base `Drawer` primitive, which owns its swipe gestures, snap points, focus handling and accessibility. See the [Base UI Drawer documentation](https://base-ui.com/react/components/drawer) for the behavior it ports.
