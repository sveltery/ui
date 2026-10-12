---
title: Badge
description: Displays a badge or a component that looks like a badge.
---

<ComponentPreview name="base/BadgeExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/badge`.

<ComponentSource name="badge" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
</script>
```

```svelte
<Badge variant="outline">Badge</Badge>
```

## Link

Pass a `render` snippet to render the badge as another element. Spread `props` onto it and render `children` inside it.

```svelte
<Badge>
  {#snippet render(props, state, children)}
    <a href="/changelog" {...props}>{@render children?.()}</a>
  {/snippet}
  New
</Badge>
```
