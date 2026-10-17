---
title: Direction
description: A provider component that sets the text direction for your application.
---

The `DirectionProvider` component is used to set the text direction (`ltr` or `rtl`) for your application. This is essential for supporting right-to-left languages like Arabic, Hebrew, and Persian.

Here's a preview of the component in RTL mode. Use the language buttons to switch the language. To see more examples, look for the RTL section on components pages.

<ComponentPreview name="base/DirectionExample" hideCode />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add direction
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/direction`.

<ComponentSource name="direction" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { DirectionProvider } from '#lib/components/ui/direction';
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

The `useDirection` hook is used to get the current direction of the application. It reads the nearest `DirectionProvider`, or `ltr` when there is none. Call it while the component initializes. It returns an object, so read its `direction` property in the template or in `$derived` to stay in sync with the provider.

```svelte
<script lang="ts">
  import { useDirection } from '#lib/components/ui/direction';

  const reading = useDirection();
</script>

<div>Current direction: {reading.direction}</div>
```
