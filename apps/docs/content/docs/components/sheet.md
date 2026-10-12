---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
---

<ComponentPreview name="base/SheetExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/sheet`.

<ComponentSource name="sheet" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '$lib/components/ui/sheet';
  let open = $state(false);
</script>
```

```svelte
<Sheet bind:open>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>This action cannot be undone. It permanently deletes your account.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

`SheetContent` takes `side` (`top`, `right`, `bottom` or `left`, default `right`) and `showCloseButton` (default `true`).

## API reference

`Sheet` is styled on top of the Sveltery Base `Dialog` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Dialog documentation](https://base-ui.com/react/components/dialog) for the behavior it ports.
