---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
---

<ComponentPreview name="base/DialogExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/dialog`.

<ComponentSource name="dialog" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
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
