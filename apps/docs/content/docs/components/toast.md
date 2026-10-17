---
title: Toast
description: A toast built from the Base toast parts, with a toast manager you can call from anywhere.
---

<ComponentPreview name="base/ToastDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add toast
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/toast`. The toast action and close button also need the [Button](/docs/components/button) component's `buttonVariants`.

<ComponentSource name="toast" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

Mount `Toaster` once, in your root layout.

```svelte
<script lang="ts">
  import { Toaster } from '#lib/components/ui/toast';
  let { children } = $props();
</script>

{@render children()}
<Toaster />
```

Call `toast.add()` from any component or module.

```svelte
<script lang="ts">
  import { toast } from '#lib/components/ui/toast';
</script>

<button onclick={() => toast.add({ title: 'Event created', description: 'Sunday, December 3 at 9:00 AM' })}>
  Show Toast
</button>
```

`Toaster` renders the provider, the portal, the viewport and one `Toast` for each toast. Sveltery UI has no Sonner component, because Toast covers the same behavior. Where shadcn/ui code calls `toast()` from `sonner`, call `toast.add()` here.

## Types

Set the `type` option to render a status icon. The built-in renderer recognizes `success`, `info`, `warning`, `error` and `loading`. Other values show no icon.

<ComponentPreview name="base/ToastTypesExample" />

## Action

Pass button props with `actionProps` to render an action. `children` is its label and `onclick` runs when it is clicked. `toast.add()` returns the toast's id, so the handler can close the toast.

```ts
const id = toast.add({
  title: 'Event created',
  actionProps: {
    children: 'Undo',
    onclick() {
      toast.close(id);
    }
  }
});
```

## Promise

Use `toast.promise()` to update one toast as an asynchronous task moves through loading, success and error states. Each takes a string, an options object, or a function of the result or the error that returns either. It returns the promise you passed.

<ComponentPreview name="base/ToastPromiseExample" />

## Custom layout

`Toaster` is the standard layout. To change it, compose the parts yourself and read the toasts with `getToastManager()` inside a `ToastProvider`.

```svelte
<script lang="ts">
  import { Toast, ToastClose, ToastContent, ToastDescription, ToastPortal, ToastTitle, ToastViewport, getToastManager } from '#lib/components/ui/toast';

  const manager = getToastManager();
</script>

<ToastPortal>
  <ToastViewport>
    {#each manager.toasts as item (item.id)}
      <Toast toast={item}>
        <ToastContent>
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle />
            <ToastDescription />
          </div>
          <ToastClose />
        </ToastContent>
      </Toast>
    {/each}
  </ToastViewport>
</ToastPortal>
```

Render that component inside `<ToastProvider toastManager={toast}>`.

## API Reference

See the [Base UI Toast documentation](https://base-ui.com/react/components/toast) for details about manager options, stacking, swipe dismissal, and the primitive API.

### Toaster

`Toaster` takes the Base `Toast.Provider` props and passes the global `toast` manager as `toastManager`. Pass your own manager from `createToastManager()` to use a separate stack.

| Prop           | Type           | Default | Description                                                      |
| -------------- | -------------- | ------- | ---------------------------------------------------------------- |
| `timeout`      | `number`       | `5000`  | Milliseconds before a toast closes itself. `0` keeps it open.    |
| `limit`        | `number`       | `3`     | How many toasts show at once. Older toasts get `data-limited`.   |
| `toastManager` | `ToastManager` | `toast` | The manager that feeds this provider.                            |

### toast

| Method                         | Description                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| `toast.add(options)`           | Adds a toast and returns its id. An existing `id` updates that toast.      |
| `toast.update(id, updates)`    | Changes a toast. `updates` is an object or a function of the current toast. |
| `toast.close(id?)`             | Closes one toast, or every toast without an id.                            |
| `toast.promise(promise, opts)` | Shows a toast that follows the promise.                                    |

`title` and `description` are a string or a Svelte snippet.

| Option        | Type                         | Description                                                          |
| ------------- | ---------------------------- | -------------------------------------------------------------------- |
| `id`          | `string`                     | Reuse an id to update that toast in place.                           |
| `title`       | `string \| Snippet`          | The first line.                                                      |
| `description` | `string \| Snippet`          | The second line.                                                     |
| `type`        | `string`                     | Picks the icon and sets `data-type`.                                 |
| `timeout`     | `number`                     | Milliseconds before this toast closes itself. `0` keeps it open.     |
| `priority`    | `'low' \| 'high'`            | `high` is announced urgently.                                        |
| `actionProps` | `ButtonHTMLAttributes`       | Props for the action button. `children` is its label.                |
| `onClose`     | `() => void`                 | Runs when the toast closes.                                          |
| `onRemove`    | `() => void`                 | Runs when the toast leaves the DOM after its exit animation.         |
| `data`        | `object`                     | Custom data for your own layout.                                     |

### Parts

Each part accepts the props of the Base part it wraps and sets a `data-slot`.

| Component          | Base part            | `data-slot`         |
| ------------------ | -------------------- | ------------------- |
| `ToastProvider`    | `Toast.Provider`     | none                |
| `ToastPortal`      | `Toast.Portal`       | `toast-portal`      |
| `ToastViewport`    | `Toast.Viewport`     | `toast-viewport`    |
| `Toast`            | `Toast.Root`         | `toast`             |
| `ToastContent`     | `Toast.Content`      | `toast-content`     |
| `ToastTitle`       | `Toast.Title`        | `toast-title`       |
| `ToastDescription` | `Toast.Description`  | `toast-description` |
| `ToastAction`      | `Toast.Action`       | `toast-action`      |
| `ToastClose`       | `Toast.Close`        | `toast-close`       |

`ToastClose` shows an X icon unless you pass children. The icon for a toast's `type` has `data-slot="toast-icon"`.
