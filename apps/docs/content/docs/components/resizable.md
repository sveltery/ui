---
title: Resizable
description: Accessible resizable panel groups and layouts with keyboard support.
---

<ComponentPreview name="base/ResizableExample" />

## About

Resizable is built on `@sveltery/resizable`, a Svelte port of [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) 4.5.8 by Brian Vaughn under the MIT License. The package carries that library's framework-free code unchanged, including its layout algorithm and its document-level pointer and keyboard handling, and its `Group`, `Panel` and `Separator` components are Svelte rewrites of the React ones. It has no runtime dependencies. Where the React library takes a ref, such as `groupRef` or `panelRef`, you bind the prop instead.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add resizable
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/resizable
```

### Copy the component

Copy the following files into `src/lib/components/ui/resizable`.

<ComponentSource name="resizable" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#lib/components/ui/resizable';
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

## Layout

A layout maps each panel `id` to its percent of the group, so give the panels an `id` to name them. Bind `groupRef` to read the layout with `getLayout()` and to set it with `setLayout()`. `setLayout` takes a size for every panel, in the order the panels sit, validates it against the panel limits and returns the layout it applied.

```svelte
<script lang="ts">
  import type { GroupImperativeHandle } from '@sveltery/resizable';

  let group = $state<GroupImperativeHandle | null>(null);
</script>

<ResizablePanelGroup bind:groupRef={group}>
  <ResizablePanel id="sidebar" defaultSize="25%">Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel id="content" defaultSize="75%">Content</ResizablePanel>
</ResizablePanelGroup>

<button onclick={() => group?.setLayout({ sidebar: 50, content: 50 })}>Half</button>
```

`onLayoutChange` runs for every step of a drag. `onLayoutChanged` runs once the change settles, which is when the pointer is released. Each runs once for each new layout, starting with the layout the group mounts with.

```svelte
<ResizablePanelGroup onLayoutChanged={(layout) => { save(layout); }}>
  …
</ResizablePanelGroup>
```

## Persistence

`useDefaultLayout` keeps a layout in `localStorage` and restores it on the next visit. Call it while a component initializes, then pass its `defaultLayout` and `onLayoutChanged` to the group. Pass `storage` to use another store, such as `sessionStorage` or cookies. Pass `panelIds` to save one layout for each set of panels when panels are rendered conditionally.

```svelte
<script lang="ts">
  import { useDefaultLayout } from '@sveltery/resizable';

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: 'editor' });
</script>

<ResizablePanelGroup {defaultLayout} {onLayoutChanged}>
  <ResizablePanel id="files" defaultSize="30%">Files</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel id="code" defaultSize="70%">Code</ResizablePanel>
</ResizablePanelGroup>
```

The server renders the panels at the sizes in `defaultLayout`, or at equal sizes without one. The browser applies each panel's `defaultSize` when the group mounts. `localStorage` does not exist on the server, so for server rendering pass a `storage` that works there, such as one that reads a cookie.

## Collapsible panels

A collapsible panel snaps to `collapsedSize` when it is dragged below half way between `collapsedSize` and `minSize`. A drag expands it again once it passes `minSize`. Press Enter on the handle to collapse the panel before it, and press Enter again to restore its last size.

```svelte
<ResizablePanelGroup>
  <ResizablePanel defaultSize="30%" minSize="20%" collapsible>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Content</ResizablePanel>
</ResizablePanelGroup>
```

Bind `panelRef` to collapse, expand or resize the panel from your own controls.

```svelte
<script lang="ts">
  import type { PanelImperativeHandle } from '@sveltery/resizable';

  let sidebar = $state<PanelImperativeHandle | null>(null);
</script>

<button onclick={() => sidebar?.collapse()}>Collapse</button>
<button onclick={() => sidebar?.expand()}>Expand</button>
<button onclick={() => sidebar?.resize('40%')}>40%</button>

<ResizablePanelGroup>
  <ResizablePanel bind:panelRef={sidebar} defaultSize="30%" minSize="20%" collapsible>Sidebar</ResizablePanel>
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

Double-click a handle to reset the first panel beside it that has a `defaultSize` to that size.

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
| `defaultLayout` | `Record<string, number>` | | Percent of the group for each panel `id`, applied on the server and when the group mounts. It is ignored unless it names every panel |
| `onLayoutChange` | `(layout) => void` | | Runs for every change, including each step of a drag |
| `onLayoutChanged` | `(layout) => void` | | Runs once a change settles |
| `groupRef` | `GroupImperativeHandle` | | Bindable. Has `getLayout()` and `setLayout(layout)` |
| `elementRef` | `HTMLDivElement` | | Bindable. The group element |
| `disabled` | `boolean` | `false` | Turns off resizing for every handle |
| `disableCursor` | `boolean` | `false` | Keeps the page cursor while a pointer hovers or drags a handle |
| `resizeTargetMinimumSize` | `{ coarse: number, fine: number }` | `{ coarse: 20, fine: 10 }` | The smallest grab area of a handle in pixels, for touch and for mouse pointers |
| `id` | `string \| number` | generated | Set on the group as `id` and `data-testid` |
| `class` | `string` | | Added to the group |
| `style` | `string` | | Added to the group. `display`, `flex-direction`, `flex-wrap` and `overflow` cannot be changed |

### ResizablePanel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| number` | generated | Names the panel in the layout. Set on the panel as `id` and `data-testid` |
| `defaultSize` | `number \| string` | | The starting size. A number is pixels |
| `minSize` | `number \| string` | `0%` | The smallest size |
| `maxSize` | `number \| string` | `100%` | The largest size |
| `collapsible` | `boolean` | `false` | Lets the panel collapse to `collapsedSize` |
| `collapsedSize` | `number \| string` | `0%` | The size when collapsed |
| `onResize` | `(size, id, previous) => void` | | Runs when the panel element resizes. A size is `{ asPercentage, inPixels }` |
| `panelRef` | `PanelImperativeHandle` | | Bindable. Has the methods below |
| `elementRef` | `HTMLDivElement` | | Bindable. The panel element |
| `class` | `string` | | Added to the element inside the panel that holds its content |
| `style` | `string` | | Added to the element inside the panel that holds its content |

A bound `panelRef` has these methods.

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
| `elementRef` | `HTMLDivElement` | | Bindable. The handle element |
| `id` | `string \| number` | generated | Set on the handle as `id` and `data-testid` |
| `class` | `string` | | Added to the handle |

`ResizablePanelGroup`, `ResizablePanel` and `ResizableHandle` pass every other attribute to their outer `div`.

### useDefaultLayout

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | | Names the saved layout. The key is `react-resizable-panels:<id>` |
| `panelIds` | `string[]` | | Saves a separate layout for each set of panel ids |
| `storage` | `{ getItem, setItem }` | `localStorage` | Where to keep the layout |

It returns `{ defaultLayout, onLayoutChanged }` to pass to a `ResizablePanelGroup`.
