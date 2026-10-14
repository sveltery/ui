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

### Position

Set `position` on `Toaster` to one of `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center` or `bottom-right`. The default is `bottom-right`. Toasts stack away from the screen edge they sit on, so top positions stack downward and slide in from the top. Below the `sm` breakpoint every position centers the toasts with a 16px margin.

```svelte
<Toaster position="top-center" />
```

Swiping dismisses a toast toward its own edge. Top positions swipe up, bottom positions swipe down, and left, right or center positions also swipe that way sideways.

### Rich colors

Set `richColors` on `Toaster` to tint `success`, `info`, `warning` and `error` toasts. Untyped and `loading` toasts keep the popover colors. Pass `richColors` in a toast's options to override the `Toaster` for that toast.

```svelte
<Toaster richColors />
```

```ts
toast.success('Event has been created', { richColors: true });
toast.error('Event has not been created', { richColors: false });
```

`error` uses the `destructive` theme token. The shadcn themes define no success, info or warning tokens, so those three use the Tailwind green, blue and amber palette, with dark mode variants under the `dark` class. Restyle a type with `classNames.toast`, for example `data-[type=success]:bg-emerald-100`.

### Close button

Set `closeButton` on `Toaster` to add a close button to every toast. It appears in the toast's top corner when the toast is hovered or focused. Pass `closeButton` in a toast's options to override the `Toaster` for that toast. Loading and custom toasts never show it.

```svelte
<Toaster closeButton />
```

```ts
toast('Event has been created', { closeButton: true });
```

The button is labelled `Close toast`. Set `closeButtonAriaLabel` on `Toaster` to translate it.

### Custom

`toast.custom()` shows a snippet in place of the default layout. The toast has no background, border, icon, close button or action, so the snippet draws all of it. The snippet receives the toast's id, which `toast.dismiss(id)` accepts. It takes `id`, `duration` and `className`.

```svelte
{#snippet invite(id)}
  <div class="flex w-full items-center gap-3 rounded-2xl border bg-popover p-4 shadow-lg">
    <p class="flex-1 text-sm">Ada invited you to the Sveltery team.</p>
    <button onclick={() => toast.dismiss(id)}>Accept</button>
  </div>
{/snippet}

<button onclick={() => toast.custom(invite)}>Show Toast</button>
```

To show a component, render it from the snippet.

```svelte
{#snippet invite(id)}
  <InviteToast {id} />
{/snippet}
```

### Styling

`class` on `Toaster` styles the viewport. `classNames` on `Toaster` adds classes to the parts of every toast, and a toast's own `classNames` and `className` add to one toast. Each value merges after the default classes, so a later `bg-*` or `border-*` class wins.

```svelte
<Toaster classNames={{ toast: 'bg-card', description: 'italic' }} />
```

```ts
toast('Event has been created', { className: 'border-dashed', classNames: { title: 'uppercase' } });
```

The parts are `toast`, `content`, `icon`, `title`, `description`, `actionButton` and `closeButton`.

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

| Prop                   | Type                                  | Default          | Description                                                   |
| ---------------------- | ------------------------------------- | ---------------- | ------------------------------------------------------------- |
| `position`             | `ToastPosition`                       | `'bottom-right'` | Where the toasts appear.                                      |
| `richColors`           | `boolean`                             | `false`          | Tints success, info, warning and error toasts.                |
| `closeButton`          | `boolean`                             | `false`          | Shows a close button on every toast.                          |
| `closeButtonAriaLabel` | `string`                              | `'Close toast'`  | The accessible name of the close button.                      |
| `classNames`           | `ToastClassNames`                     |                  | Extra classes for the parts of every toast.                   |
| `class`                | `string`                              |                  | Extra classes for the viewport.                               |
| `timeout`              | `number`                              | `4000`           | Milliseconds before a toast closes itself. `0` keeps it open. |
| `limit`                | `number`                              | `3`              | How many toasts show at once.                                 |

### toast

| Function                                                         | Description                                                    |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `toast(message, options?)`, `toast.message(message, options?)`   | Shows a toast without an icon. Returns its id.                 |
| `toast.success`, `info`, `warning`, `error`, `loading`           | Show a toast of that type. Each takes `(message, options?)`.   |
| `toast.custom(snippet, options?)`                                | Shows a snippet with no default styling. Returns its id.       |
| `toast.promise(promise, data)`                                   | Shows a loading toast, then success or error.                  |
| `toast.dismiss(id?)`                                             | Closes one toast, or every toast without an id.                |

`message` and `options.description` are a string or a Svelte snippet.

| Option        | Type                                                   | Description                                                      |
| ------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| `id`          | `string`                                               | Reuse an id to update that toast in place.                       |
| `description` | `string \| Snippet`                                    | The second line.                                                 |
| `duration`    | `number`                                               | Milliseconds before the toast closes itself. `Infinity` keeps it open. |
| `action`      | `{ label: string \| Snippet; onClick?: (event) => void }` | The action button.                                               |
| `className`   | `string`                                               | Extra classes for the toast.                                     |
| `classNames`  | `ToastClassNames`                                      | Extra classes for the parts of the toast.                        |
| `closeButton` | `boolean`                                              | Overrides `Toaster` `closeButton` for this toast.                |
| `richColors`  | `boolean`                                              | Overrides `Toaster` `richColors` for this toast.                 |

An update by `id` replaces the toast's options, so pass `className`, `closeButton` and the others again when you update a toast.

See the [Base Toast documentation](https://base-ui.com/react/components/toast) for the behavior it ports: stacking, hover and F6 expansion, swipe to dismiss and screen reader announcements.

## Differences from Sonner

These parts of the Sonner API do not map onto Base Toast. The Sonner side of this table comes from the library's API as recalled, not from a copy of its source.

| Sonner                                          | Here                                                    | Reason                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `position` option on a single toast             | Not supported. Set `position` on `Toaster`.             | A Base toast manager has one viewport, so every toast shares one position.                                                   |
| `toast.custom(jsx)` with a component            | `toast.custom(snippet)`                                 | Svelte components and snippets are both plain functions, so they cannot be told apart. Render a component from the snippet. |
| `toast.custom()` options such as `description`  | `id`, `duration` and `className` only                   | The snippet replaces the title, description, icon and action, so those options have nothing to render into.                  |
| `toastOptions.classNames` and `className`       | `classNames` and `class` on `Toaster`                   | The options object is flattened into props. `class` styles the viewport, as Sonner's `className` does.                       |
| `classNames` keys `success`, `error` and so on  | Not supported                                           | Use `data-[type=error]:` variants inside `classNames.toast`, since each toast carries a `data-type` attribute.               |
| `classNames` keys `loader` and `cancelButton`   | Not supported                                           | This port has no loader wrapper and no cancel button.                                                                        |
| `--success-bg`, `--error-text` and other CSS variables | Not supported. Use `classNames.toast`.            | Rich colors are Tailwind classes built from theme tokens and the Tailwind palette, so there are no variables to override.    |
| An update by `id` keeps the earlier options     | An update by `id` replaces them                         | Base replaces a toast's `data` on update, and the options live there.                                                        |
