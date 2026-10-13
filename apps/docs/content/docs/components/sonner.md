---
title: Sonner
description: An opinionated toast component for Svelte.
---

<ComponentPreview name="base/SonnerExample" />

## About

Sonner is an opinionated toast component. This port follows the [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/base/sonner) API, but it does not use the `sonner` library. `Toaster` renders the Sveltery Base `Toast` parts, and `toast()` adds toasts to a Base toast manager.

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/sonner`. The toast action also needs the [Button](/docs/components/button) component.

<ComponentSource name="sonner" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

Mount `Toaster` once, in your root layout.

```svelte
<script lang="ts">
  import { Toaster } from '$lib/components/ui/sonner';
  let { children } = $props();
</script>

{@render children()}
<Toaster />
```

Call `toast()` from any component or module.

```svelte
<script lang="ts">
  import { toast } from '$lib/components/ui/sonner';
</script>

<button onclick={() => toast('Event has been created')}>Show Toast</button>
```

## Examples

### Description

Pass `description` to add a second line under the title.

```ts
toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' });
```

### Types

Each type shows its own icon. `loading` stays open until you dismiss it or update it.

```ts
toast.success('Event has been created');
toast.info('Be at the area 10 minutes before the event time');
toast.warning('Event start time cannot be earlier than 8am');
toast.error('Event has not been created');
toast.loading('Loading data');
```

### Action

`action` adds a button. The toast closes after `onClick` runs, unless the handler calls `event.preventDefault()`.

```ts
toast('Event has been created', {
  action: { label: 'Undo', onClick: () => console.log('Undo') }
});
```

### Promise

`toast.promise()` shows a loading toast, then replaces it with the success or error toast. `success` and `error` take a string, a `{ message, description }` object, or a function of the result or the error that returns either. It returns `{ unwrap }`, where `unwrap()` gives back a promise that settles like the one you passed.

```ts
toast.promise(saveEvent(), {
  loading: 'Saving event',
  success: (event) => `${event.name} has been saved`,
  error: 'Event has not been saved'
});
```

### Update and dismiss

`toast()` and the typed variants return the toast's id. Pass the same `id` again to update that toast in place. `toast.dismiss(id)` closes one toast, and `toast.dismiss()` closes every toast.

```ts
const id = toast.loading('Uploading');
toast.success('Uploaded', { id });
toast.dismiss(id);
```

## API reference

### Toaster

`Toaster` renders the Base `Toast.Provider`, `Toast.Portal` and `Toast.Viewport`, and one `Toast.Root` for each toast. It spreads its other props onto the viewport.

| Prop      | Type     | Default | Description                                                  |
| --------- | -------- | ------- | ------------------------------------------------------------ |
| `timeout` | `number` | `4000`  | Milliseconds before a toast closes itself. `0` keeps it open. |
| `limit`   | `number` | `3`     | How many toasts show at once.                                |

### toast

| Function                                                         | Description                                                    |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `toast(message, options?)`, `toast.message(message, options?)`   | Shows a toast without an icon. Returns its id.                 |
| `toast.success`, `info`, `warning`, `error`, `loading`           | Show a toast of that type. Each takes `(message, options?)`.   |
| `toast.promise(promise, data)`                                   | Shows a loading toast, then success or error.                  |
| `toast.dismiss(id?)`                                             | Closes one toast, or every toast without an id.                |

`message` and `options.description` are a string or a Svelte snippet.

| Option        | Type                                                   | Description                                                      |
| ------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| `id`          | `string`                                               | Reuse an id to update that toast in place.                       |
| `description` | `string \| Snippet`                                    | The second line.                                                 |
| `duration`    | `number`                                               | Milliseconds before the toast closes itself. `Infinity` keeps it open. |
| `action`      | `{ label: string \| Snippet; onClick?: (event) => void }` | The action button.                                               |

See the [Base Toast documentation](https://base-ui.com/react/components/toast) for the behavior it ports: stacking, hover and F6 expansion, swipe to dismiss and screen reader announcements.
