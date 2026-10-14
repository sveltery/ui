---
title: Sonner
description: An opinionated toast component for Svelte.
---

<ComponentPreview name="base/SonnerExample" />

## About

Sonner is built and maintained by [emilkowalski](https://twitter.com/emilkowalski). This component uses [svelte-sonner](https://github.com/wobsoriano/svelte-sonner), the Svelte port of Sonner by [wobsoriano](https://github.com/wobsoriano). `Toaster` only sets the theme, the icons and the colors, as the shadcn/ui component does.

## Installation

<Steps>

### Install the dependencies

```bash
npm install svelte-sonner
```

### Copy the component

Copy the following files into `src/lib/components/ui/sonner`.

<ComponentSource name="sonner" />

### Update the import paths

Change the imports to match your project setup.

### Add the Toaster component

Mount `Toaster` once, in your root layout.

```svelte
<script lang="ts">
  import { Toaster } from '$lib/components/ui/sonner';
  let { children } = $props();
</script>

<main>{@render children()}</main>
<Toaster />
```

</Steps>

## Usage

```ts
import { toast } from 'svelte-sonner';
```

```ts
toast('Event has been created.');
```

## Types

```ts
toast('Event has been created');
toast.success('Event has been created');
toast.info('Be at the area 10 minutes before the event time');
toast.warning('Event start time cannot be earlier than 8am');
toast.error('Event has not been created');
toast.promise(saveEvent(), {
  loading: 'Loading...',
  success: (event) => `${event.name} has been created`,
  error: 'Error'
});
```

## Description

```ts
toast('Event has been created', {
  description: 'Monday, January 3rd at 6:00pm'
});
```

## Position

Use the `position` prop to change the position of the toast.

```svelte
<Toaster position="top-center" />
```

## Theme

`Toaster` defaults to the `system` theme. Pass `theme` to follow your app's color mode, for example `<Toaster theme={mode.current} />` with [mode-watcher](https://mode-watcher.sveco.dev) or your own store.

## API Reference

See the [svelte-sonner documentation](https://svelte-sonner.vercel.app) for more information.
