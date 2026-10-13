---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
---

<ComponentPreview name="base/AlertDialogExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/alert-dialog`.

<ComponentSource name="alert-dialog" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '$lib/components/ui/alert-dialog';
</script>
```

```svelte
<AlertDialog>
  <AlertDialogTrigger>Show Dialog</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone. It permanently deletes your account.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Closing

An alert dialog is always modal, and a press outside it does not close it. `AlertDialogCancel` and the Escape key close it. `AlertDialogAction` is a [Button](/docs/components/button) and leaves the dialog open, so that you can run the action first. Use `bind:open` to close it from your code:

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<AlertDialog bind:open>
  …
  <AlertDialogAction onclick={async () => { await deleteProject(); open = false; }}>Delete</AlertDialogAction>
</AlertDialog>
```

## Size

`size="sm"` on `AlertDialogContent` makes a narrow dialog with the footer buttons side by side.

## API reference

`AlertDialog` is styled on top of the Sveltery Base `AlertDialog` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Alert Dialog documentation](https://base-ui.com/react/components/alert-dialog) for the behavior it ports.
