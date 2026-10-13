---
title: Hover Card
description: For sighted users to preview content available behind a link.
---

<ComponentPreview name="base/HoverCardExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/hover-card`.

<ComponentSource name="hover-card" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '$lib/components/ui/hover-card';
</script>
```

```svelte
<HoverCard>
  <HoverCardTrigger href="https://github.com/sveltery">@sveltery</HoverCardTrigger>
  <HoverCardContent>Svelte components on Base UI behavior.</HoverCardContent>
</HoverCard>
```

`HoverCardTrigger` renders a link. The card opens when the pointer rests on it or it gets keyboard focus, and it stays open while the pointer moves into the card. It is a preview for sighted users, so keep the link itself useful on its own.

## Delays

`delay` and `closeDelay` on `HoverCardTrigger` set how long the card waits to open and to close, in milliseconds. They default to 600 and 300.

## API reference

`HoverCard` is styled on top of the Sveltery Base `PreviewCard` primitive, which owns its behavior, positioning and accessibility. See the [Base UI Preview Card documentation](https://base-ui.com/react/components/preview-card) for the behavior it ports.
