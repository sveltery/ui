---
title: Resizable
description: Accessible resizable panel groups and layouts with keyboard support.
---

<ComponentPreview name="base/ResizableExample" />

## About

Resizable is built on `@sveltery/resizable`, a Svelte package that takes its design from [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by Brian Vaughn. The layout algorithm is a port of that library under the MIT License. The package has no runtime dependencies, and you bind to its state with `bind:layout` and `bind:this` instead of calling an imperative API.

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/resizable
```

### Copy the component

Copy the following files into `src/lib/components/ui/resizable`.

<ComponentSource name="resizable" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$lib/components/ui/resizable';
</script>
```

```svelte
<ResizablePanelGroup orientation="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
  <ResizablePanel defaultSize="50%">One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize="50%">Two</ResizablePanel>
</ResizablePanelGroup>
```

A group is as tall and wide as its parent, so give it a size, or a `min-h`, to see it.

## Composition

Use the following composition to build a `Resizable`:

```text
ResizablePanelGroup
├── ResizablePanel
├── ResizableHandle
└── ResizablePanel
```

A handle sits between two panels and resizes the panel before it against the panel after it. Panel groups nest.

## Sizes

A size is a number of pixels or a string with a unit. `"25%"` and `"25"` are percent of the group. `"200px"`, `"2rem"`, `"1em"`, `"50vh"` and `"50vw"` are converted to percent from the measured group, so they follow the window. `defaultSize`, `minSize`, `maxSize` and `collapsedSize` all take a size.

```svelte
<ResizablePanelGroup>
  <ResizablePanel defaultSize="30%" minSize="200px" maxSize="50%">Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>
```

A panel without a `defaultSize` takes an equal share of what the other panels leave. The sizes of a group add up to 100 percent, and the group scales them when they do not.

## Vertical

Use `orientation="vertical"` to stack the panels.

```svelte
<ResizablePanelGroup orientation="vertical" class="min-h-[200px] max-w-md rounded-lg border">
  <ResizablePanel defaultSize="25%">Header</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize="75%">Content</ResizablePanel>
</ResizablePanelGroup>
```

## Handle

Use the `withHandle` prop on `ResizableHandle` to show a visible grip.

```svelte
<ResizablePanelGroup orientation="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
  <ResizablePanel defaultSize="25%">Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="75%">Content</ResizablePanel>
</ResizablePanelGroup>
```

## Controlled

Bind `layout` to read the sizes and to set them. The layout maps each panel `id` to its percent of the group, so give the panels an `id` to name them. A layout you assign is validated against the panel limits, and `layout` then holds the result.

```svelte
<script lang="ts">
  let layout = $state<Record<string, number>>({ sidebar: 25, content: 75 });
</script>

<ResizablePanelGroup bind:layout>
  <ResizablePanel id="sidebar" defaultSize="25%">Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel id="content" defaultSize="75%">Content</ResizablePanel>
</ResizablePanelGroup>

<button onclick={() => (layout = { sidebar: 50, content: 50 })}>Half</button>
```

`onLayoutChange` runs for every step of a drag. `onLayoutChanged` runs once the change settles, which is when a drag ends, and it reports whether the user caused it.

```svelte
<ResizablePanelGroup
  onLayoutChanged={(layout, { isUserInteraction }) => {
    if (isUserInteraction) save(layout);
  }}
>
  …
</ResizablePanelGroup>
```

## Persistence

`savedLayout` keeps a layout in `localStorage` and restores it on the next visit. Spread its result on the group. Pass `storage` to use another store, such as `sessionStorage`. A missing or blocked storage leaves the group on its default sizes.

```svelte
<script lang="ts">
  import { savedLayout } from '@sveltery/resizable';

  const persisted = savedLayout({ id: 'editor' });
</script>

<ResizablePanelGroup {...persisted}>
  <ResizablePanel id="files" defaultSize="30%">Files</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel id="code" defaultSize="70%">Code</ResizablePanel>
</ResizablePanelGroup>
```

The server renders the panels at equal sizes, and the browser applies the saved or default sizes when the group mounts. Pass `defaultLayout` to render other sizes on the server.

## Collapsible panels

A collapsible panel snaps to `collapsedSize` when it is dragged below half way between `collapsedSize` and `minSize`, and snaps back to `minSize` when it is dragged above that. Set `collapsedThreshold` to choose that distance instead: with `collapsedSize="5%"`, `collapsedThreshold="5%"` and `minSize="25%"`, the panel collapses below 20% and expands above 10%. Press Enter on the handle to collapse the panel before it, and press Enter again to restore its last size. `data-collapsed` marks a collapsed panel for styling.

```svelte
<ResizablePanelGroup>
  <ResizablePanel defaultSize="30%" minSize="20%" collapsible>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>
```

Bind the panel with `bind:this` to collapse, expand or resize it from your own controls.

```svelte
<script lang="ts">
  let sidebar = $state<ResizablePanel>();
</script>

<button onclick={() => sidebar?.collapse()}>Collapse</button>
<button onclick={() => sidebar?.expand()}>Expand</button>
<button onclick={() => sidebar?.resize('40%')}>40%</button>

<ResizablePanelGroup>
  <ResizablePanel bind:this={sidebar} defaultSize="30%" minSize="20%" collapsible>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>
```

## Keyboard

A handle is a focusable window splitter. It follows the WAI-ARIA pattern and reports the size of the panel on its left, or above it, in `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.

| Key | Action |
| --- | --- |
| Arrow Left, Arrow Right | Move a vertical handle by 5 percent in a horizontal group |
| Arrow Up, Arrow Down | Move a horizontal handle by 5 percent in a vertical group |
| Home, End | Move the handle as far as the panels allow |
| Enter | Collapse or expand the panel on the left of or above the handle, when it is collapsible |
| F6, Shift+F6 | Move focus to the next or previous handle in the group |

Double-click a handle to reset the first panel beside it that has a `defaultSize` to that size. Set `disableDoubleClick` on the handle to turn this off.

## Pointer

A pointer grabs a handle from up to 5 pixels away, or 10 pixels on a touch screen, so a thin handle is easy to hit. While the pointer hovers or drags a handle, the page shows the resize cursor and the handle has `data-separator="hover"` or `data-separator="active"`. Where two groups cross, as in nested groups, one drag resizes both. Set `resizeTargetMinimumSize` on the group to change the grab area, and `disableCursor` to keep the page cursor.

## RTL

A horizontal group follows the text direction. In a right-to-left page the first panel sits on the right. Panels are resized in the order they sit on screen, so a drag and the arrow keys move the handle the same way as in a left-to-right page. Set `dir` on the group or one of its ancestors.

```svelte
<div dir="rtl">
  <ResizablePanelGroup orientation="horizontal">
    <ResizablePanel defaultSize="50%">One</ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize="50%">Two</ResizablePanel>
  </ResizablePanelGroup>
</div>
```

## API reference

### ResizablePanelGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The direction the panels sit in |
| `layout` | `Record<string, number>` | | Bindable. Percent of the group for each panel `id` |
| `defaultLayout` | `Record<string, number>` | | The layout to start from. Panels it does not name use their `defaultSize` |
| `onLayoutChange` | `(layout) => void` | | Runs for every change, including each step of a drag |
| `onLayoutChanged` | `(layout, { isUserInteraction }) => void` | | Runs once a change settles |
| `disabled` | `boolean` | `false` | Turns off resizing for every handle |
| `disableCursor` | `boolean` | `false` | Keeps the page cursor while a pointer hovers or drags a handle |
| `resizeTargetMinimumSize` | `{ coarse: number, fine: number }` | `{ coarse: 20, fine: 10 }` | The smallest grab area of a handle in pixels, for touch and for mouse pointers |
| `id` | `string` | generated | Set on the group as `id` and `data-testid` |
| `class` | `string` | | Added to the group |

### ResizablePanel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | generated | Names the panel in the layout |
| `defaultSize` | `number \| string` | | The starting size. A number is pixels |
| `minSize` | `number \| string` | `0` | The smallest size |
| `maxSize` | `number \| string` | `100%` | The largest size |
| `collapsible` | `boolean` | `false` | Lets the panel collapse to `collapsedSize` |
| `collapsedSize` | `number \| string` | `0` | The size when collapsed |
| `collapsedThreshold` | `number \| string` | half way | How far past `minSize` the panel moves before it collapses, and past `collapsedSize` before it expands |
| `onResize` | `(size, id, previous) => void` | | Runs when the panel size changes. A size is `{ asPercentage, inPixels }` |
| `class` | `string` | | Added to the element inside the panel that holds its content |
| `style` | `string` | | Added to the element inside the panel that holds its content |

A panel bound with `bind:this` has these methods.

| Method | Description |
| --- | --- |
| `collapse()` | Collapses a collapsible panel |
| `expand()` | Restores a collapsed panel to its last size, or to `minSize` |
| `resize(size)` | Resizes the panel to a size |
| `getSize()` | Returns `{ asPercentage, inPixels }` |
| `isCollapsed()` | Returns whether the panel is collapsed |

### ResizableHandle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `withHandle` | `boolean` | `false` | Shows a grip in the handle |
| `disabled` | `boolean` | `false` | Turns off resizing for this handle |
| `disableDoubleClick` | `boolean` | `false` | Stops a double click from resetting the panel beside the handle to its default size |
| `class` | `string` | | Added to the handle |

`ResizablePanelGroup`, `ResizablePanel` and `ResizableHandle` pass every other attribute to their outer `div`.

### savedLayout

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | | Names the saved layout. The key is `sveltery-resizable:<id>` |
| `storage` | `{ getItem, setItem }` | `localStorage` | Where to keep the layout |

It returns `{ id, defaultLayout, onLayoutChanged }` to spread on a `ResizablePanelGroup`.
