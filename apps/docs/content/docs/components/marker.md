---
title: Marker
description: Displays an inline status, system note, bordered row, or labeled separator in a conversation.
---

<ComponentPreview name="base/MarkerExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/marker`.

<ComponentSource name="marker" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

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
