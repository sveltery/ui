---
title: Hover Card
description: For sighted users to preview content available behind a link.
---

<ComponentPreview name="base/HoverCardDemoExample" class="h-80" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add hover-card
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/hover-card`.

<ComponentSource name="hover-card" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '#lib/components/ui/hover-card';
</script>
```

```svelte
<HoverCard>
  <HoverCardTrigger href="https://github.com/sveltery">@sveltery</HoverCardTrigger>
  <HoverCardContent>Svelte components on Base UI behavior.</HoverCardContent>
</HoverCard>
```

`HoverCardTrigger` renders a link. The card opens when the pointer rests on it or it gets keyboard focus, and it stays open while the pointer moves into the card. It is a preview for sighted users, so keep the link itself useful on its own.

## Composition

Use the following composition to build a `HoverCard`:

```text
HoverCard
├── HoverCardTrigger
└── HoverCardContent
```

## Trigger Delays

Use `delay` and `closeDelay` on the trigger to control when the card opens and closes, in milliseconds. They default to 600 and 300.

```svelte
<HoverCard>
  <HoverCardTrigger delay={100} closeDelay={200}>Hover</HoverCardTrigger>
  <HoverCardContent>Content</HoverCardContent>
</HoverCard>
```

## Positioning

Use the `side` and `align` props on `HoverCardContent` to control placement.

```svelte
<HoverCard>
  <HoverCardTrigger>Hover</HoverCardTrigger>
  <HoverCardContent side="top" align="start">Content</HoverCardContent>
</HoverCard>
```

## Basic

<ComponentPreview name="base/HoverCardDemoExample" class="h-80" />

## Sides

<ComponentPreview name="base/HoverCardSidesExample" class="h-[22rem]" />

## RTL

Wrap the hover card in a [DirectionProvider](/docs/components/direction) and set `dir` on `HoverCardContent`. Use the buttons to switch the language.

<ComponentPreview name="base/HoverCardRtlExample" class="h-80" />

## API Reference

See the [Base UI Preview Card](https://base-ui.com/react/components/preview-card#api-reference) documentation.

`HoverCard` is styled on top of the Sveltery Base `PreviewCard` primitive, which owns its behavior, positioning and accessibility.
