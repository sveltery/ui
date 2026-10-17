---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
---

<ComponentPreview name="base/DialogDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add dialog
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/dialog`.

<ComponentSource name="dialog" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '#lib/components/ui/dialog';
</script>
```

```svelte
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Composition

Use the following composition to build a `Dialog`:

```text
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter
```

## Custom Close Button

Replace the default close control with your own button.

<ComponentPreview name="base/DialogCloseButtonExample" />

## No Close Button

Use `showCloseButton={false}` to hide the close button.

<ComponentPreview name="base/DialogNoCloseButtonExample" />

## Sticky Footer

Keep actions visible while the content scrolls.

<ComponentPreview name="base/DialogStickyFooterExample" />

## Scrollable Content

Long content can scroll while the header stays in view.

<ComponentPreview name="base/DialogScrollableContentExample" />

## RTL

Wrap the dialog in a [DirectionProvider](/docs/components/direction) and set `dir` on `DialogContent`. Use the buttons to switch the language.

<ComponentPreview name="base/DialogRtlExample" align="start" />

## API Reference

See the [Base UI Dialog](https://base-ui.com/react/components/dialog#api-reference) documentation.

`Dialog` is styled on top of the Sveltery Base `Dialog` primitive, which owns its behavior, focus handling and accessibility.
