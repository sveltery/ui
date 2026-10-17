---
title: Drawer
description: A panel that slides in from an edge of the screen and can be swiped away.
style: rhea
---

<ComponentPreview name="base/DrawerDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add drawer
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/drawer`.

<ComponentSource name="drawer" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

Add the following to your global styles. On iOS Safari, the drawer overlay is absolutely positioned and requires a positioned `body` to cover the viewport after the page is scrolled. See the [Base UI docs](https://base-ui.com/react/overview/quick-start#ios-26-safari) for details.

```css
body {
  position: relative;
}
```

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '#lib/components/ui/drawer';
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
    <div class="p-4"><!-- Content here --></div>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

The drawer opens from the bottom edge. Escape, a press outside, the Close button or a swipe toward the edge closes it.

## Composition

Use the following composition to build a `Drawer`:

```text
Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    └── DrawerFooter
```

`DrawerContent` composes the portal, overlay, viewport, and popup from Base UI. For lower-level control, `DrawerPortal`, `DrawerOverlay`, and `DrawerSwipeHandle` are also exported.

## Custom Sizes

A vertical drawer sizes itself to its content and is capped at `calc(100dvh - 6rem)` by default. A side drawer spans `75%` of the viewport width, or `24rem` on larger screens.

To customize the height of a vertical drawer, use the `h-*` and `max-h-*` utilities on `DrawerContent`.

```svelte
<DrawerContent class="h-[50vh]">
```

To customize the width of a side drawer, use the `w-*` and `max-w-*` utilities on `DrawerContent`.

```svelte
<DrawerContent class="w-96">
```

When the same component renders in multiple directions, scope an override to one axis using the `data-[swipe-axis=*]` variants.

```svelte
<DrawerContent class="data-[swipe-axis=y]:max-h-[50vh] data-[swipe-axis=x]:w-96">
```

To make a region of the drawer scrollable, make the scroll container a flex item. Avoid `h-full`, which does not resolve inside a content-sized drawer.

```svelte
<DrawerContent>
  <DrawerHeader>...</DrawerHeader>
  <div class="flex-1 overflow-y-auto p-4"><!-- Scrollable content --></div>
  <DrawerFooter>...</DrawerFooter>
</DrawerContent>
```

## Styling

The drawer exposes CSS variables for style-level customization. Set the sizing variables on `DrawerContent`. Set the overlay variable on `[data-slot=drawer-overlay]` in your CSS.

| Variable                       | Default                | Description                                                             |
| ------------------------------ | ---------------------- | ----------------------------------------------------------------------- |
| `--drawer-inset`               | `0px`                  | Floats the drawer from the viewport edges.                              |
| `--drawer-bleed-background`    | `var(--color-popover)` | Fills the gap behind the drawer on swipe overshoot.                     |
| `--drawer-overlay-min-opacity` | `0`                    | Minimum overlay opacity. Defaults to `0.5` when snap points are active. |

The drawer also sets data attributes you can target with variants such as `data-[swipe-direction=down]:` on `DrawerContent`, or `group-data-[swipe-axis=y]/drawer-popup:` on its descendants.

| Attribute                 | Values                        | Set when                              |
| ------------------------- | ----------------------------- | ------------------------------------- |
| `data-swipe-direction`    | `up`, `right`, `down`, `left` | Always.                               |
| `data-swipe-axis`         | `x`, `y`                      | Always.                               |
| `data-snap-points`        | Present                       | The drawer has snap points.           |
| `data-expanded`           | Present                       | The drawer is at the full snap point. |
| `data-swiping`            | Present                       | A swipe is in progress.               |
| `data-nested-drawer-open` | Present                       | A nested drawer is open on top.       |

## Position

Use the `swipeDirection` prop to set the side of the drawer.

Available options are `up`, `right`, `down`, and `left`.

<ComponentPreview name="base/DrawerSidesExample" />

## Swipe Handle

Use `showSwipeHandle` on `Drawer` to render a swipe handle.

<ComponentPreview name="base/DrawerSwipeHandleExample" />

## Nested

Open drawers from inside another drawer. Parent drawers stay mounted and stack behind the frontmost drawer.

<ComponentPreview name="base/DrawerNestedExample" />

## Non Modal

Set `modal={false}` to allow interaction with the rest of the page while the drawer is open. Combine with `disablePointerDismissal` to prevent the drawer from closing on outside presses. Use `modal="trap-focus"` to keep focus inside the drawer while leaving scroll and pointer interaction unrestricted.

<ComponentPreview name="base/DrawerNonModalExample" />

## Snap Points

Use `snapPoints` to snap a drawer to preset heights. Numbers between `0` and `1` represent fractions of the viewport. Numbers greater than `1` are treated as pixel values. String values support `px` and `rem` units. Snap points apply to vertical drawers.

Track the active snap point with `bind:snapPoint`. At the full snap point, the drawer gets a `data-expanded` attribute you can style with the `data-expanded:` variant.

<ComponentPreview name="base/DrawerSnapPointsExample" />

## Responsive

You can combine the `Dialog` and `Drawer` components to create a responsive dialog. This renders a `Dialog` component on desktop and a `Drawer` on mobile.

<ComponentPreview name="base/DrawerDialogExample" />

## Trigger

`DrawerTrigger` and `DrawerClose` render a `<button>`. Pass `class` to style them, for example with `buttonVariants`. To use another element, pass a `render` snippet and spread its props onto that element.

## API Reference

See the [Base UI Drawer](https://base-ui.com/react/components/drawer#api-reference) documentation.

`Drawer` is styled on top of the Sveltery Base `Drawer` primitive, which owns its swipe gestures, snap points, focus handling and accessibility. `showSwipeHandle` on `Drawer` is a Sveltery UI prop that renders the grab handle.
