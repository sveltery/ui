---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
---

<ComponentPreview name="base/DialogExample" />

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
      <DialogDescription>This action cannot be undone. It permanently deletes your account.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## API reference

`Dialog` is styled on top of the Sveltery Base `Dialog` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Dialog documentation](https://base-ui.com/react/components/dialog) for the behavior it ports.
