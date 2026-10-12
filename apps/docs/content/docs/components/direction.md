---
title: Direction
description: A provider component that sets the text direction for your application.
---

`DirectionProvider` sets the text direction, `ltr` or `rtl`, for the components inside it. It supports right-to-left languages such as Arabic, Hebrew and Persian. The preview below is in RTL mode. Use the buttons to switch the language.

<ComponentPreview name="base/DirectionExample" hideCode />

## Installation

<Steps>

### Install the dependencies

```bash
npm install github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/direction`.

<ComponentSource name="direction" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { DirectionProvider } from '$lib/components/ui/direction';
</script>
```

Set `dir` on the document and wrap the app in `DirectionProvider` with the same direction.

```svelte
<!-- src/app.html: <html dir="rtl"> -->
<DirectionProvider direction="rtl">
  {@render children()}
</DirectionProvider>
```

`DirectionProvider` renders no element, so the `dir` attribute stays yours to set. Pass a reactive `direction` and the components inside follow it.

```svelte
<script lang="ts">
  let language = $state<'en' | 'ar'>('ar');
  const direction = $derived(language === 'ar' ? 'rtl' : 'ltr');
</script>

<div dir={direction}>
  <DirectionProvider {direction}>…</DirectionProvider>
</div>
```

## useDirection

`useDirection` reads the direction of the nearest `DirectionProvider`, or `ltr` when there is none. Call it while the component initializes. It returns an object, so read its `direction` property in the template or in `$derived` to stay in sync with the provider.

```svelte
<script lang="ts">
  import { useDirection } from '$lib/components/ui/direction';

  const reading = useDirection();
</script>

<div>Current direction: {reading.direction}</div>
```

## API reference

See the [Base UI Direction Provider](https://base-ui.com/react/utils/direction-provider) documentation for more information.
