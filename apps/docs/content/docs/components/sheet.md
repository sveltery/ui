---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
---

<ComponentPreview name="base/SheetExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add sheet
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
