---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
---

<ComponentPreview name="base/AlertDialogDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add alert-dialog
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/alert-dialog`.

<ComponentSource name="alert-dialog" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

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
  } from '#lib/components/ui/alert-dialog';
</script>
```

```svelte
<AlertDialog>
  <AlertDialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Composition

Use the following composition to build an `AlertDialog`:

```text
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
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

## Basic

A basic alert dialog with a title, description, and cancel and continue buttons.

<ComponentPreview name="base/AlertDialogBasicExample" />

## Small

Use the `size="sm"` prop to make the alert dialog smaller.

<ComponentPreview name="base/AlertDialogSmallExample" />

## Media

Use the `AlertDialogMedia` component to add a media element such as an icon or image to the alert dialog.

<ComponentPreview name="base/AlertDialogMediaExample" />

## Small with Media

Use the `size="sm"` prop to make the alert dialog smaller and the `AlertDialogMedia` component to add a media element such as an icon or image to the alert dialog.

<ComponentPreview name="base/AlertDialogSmallMediaExample" />

## Destructive

Use the `AlertDialogAction` component to add a destructive action button to the alert dialog.

<ComponentPreview name="base/AlertDialogDestructiveExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the alert dialog in a [DirectionProvider](/docs/components/direction) and set `dir` on `AlertDialogContent`. Use the language selector to switch the language.

<ComponentPreview name="base/AlertDialogRtlExample" direction="rtl" />

## API Reference

### size

Use the `size` prop on the `AlertDialogContent` component to control the size of the alert dialog. It accepts the following values:

| Prop   | Type                | Default     |
| ------ | ------------------- | ----------- |
| `size` | `"default" \| "sm"` | `"default"` |

`AlertDialog` is styled on top of the Sveltery Base `AlertDialog` primitive, which owns its behavior, focus handling and accessibility. For more information about the other components and their props, see the [Base UI documentation](https://base-ui.com/react/components/alert-dialog#api-reference).
