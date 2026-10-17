---
title: Marker
description: Displays an inline status, system note, bordered row, or labeled separator in a conversation.
style: rhea
---

<ComponentPreview name="base/MarkerExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add marker
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/marker`.

<ComponentSource name="marker" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Marker, MarkerContent, MarkerIcon } from '$lib/components/ui/marker';
</script>
```

```svelte
<Marker variant="separator">
  <MarkerContent>Worked for 42s</MarkerContent>
</Marker>
```

## Link

Pass a `render` snippet to render the marker as a link or a button. Spread `props` onto it and render `children` inside it.

```svelte
<Marker>
  {#snippet render(props, state, children)}
    <a href="/history" {...props}>{@render children?.()}</a>
  {/snippet}
  <MarkerContent>View history</MarkerContent>
</Marker>
```
