---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
---

<ComponentPreview name="base/SheetDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add sheet
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/sheet`.

<ComponentSource name="sheet" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '#lib/components/ui/sheet';
</script>
```

```svelte
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>This action cannot be undone.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Composition

Use the following composition to build a `Sheet`.

```text
Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    └── SheetFooter
```

## Binding the open state

Bind `open` to read or change the state of the sheet from your code.

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<Sheet bind:open>
  ...
</Sheet>
```

## Side

Use the `side` prop on `SheetContent` to set the edge of the screen where the sheet appears. Values are `top`, `right`, `bottom`, or `left`.

<ComponentPreview name="base/SheetSideExample" />

## No Close Button

Use `showCloseButton={false}` on `SheetContent` to hide the close button.

<ComponentPreview name="base/SheetNoCloseButtonExample" />

## RTL

Wrap the sheet in a [DirectionProvider](/docs/components/direction) and set `dir` on `SheetContent`. Use the buttons to switch the language.

<ComponentPreview name="base/SheetRtlExample" align="start" />

## API Reference

See the [Base UI Dialog](https://base-ui.com/react/components/dialog#api-reference) documentation.

`SheetContent` takes `side` (`top`, `right`, `bottom` or `left`, default `right`) and `showCloseButton` (default `true`).
