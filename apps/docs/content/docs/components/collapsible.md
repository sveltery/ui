---
title: Collapsible
description: An interactive component which expands and collapses a panel.
---

<ComponentPreview name="base/CollapsibleExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/collapsible`.

<ComponentSource name="collapsible" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$lib/components/ui/collapsible';
</script>
```

```svelte
<Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects. No attribution required.
  </CollapsibleContent>
</Collapsible>
```

## Composition

```text
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

## Controlled state

Bind `open` to read and set the state.

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<Collapsible bind:open>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

## Custom trigger

Pass a `render` snippet to `CollapsibleTrigger` to render another element, such as a `Button`. Spread `props` onto it and render `children`.

```svelte
{#snippet button(props, state, children)}
  <Button {...props} variant="outline" size="icon">{@render children?.()}</Button>
{/snippet}

<CollapsibleTrigger render={button}>…</CollapsibleTrigger>
```

## API reference

`Collapsible` is styled on top of the Sveltery Base `Collapsible` primitive, which owns its behavior, open state and accessibility. See the [Base UI Collapsible documentation](https://base-ui.com/react/components/collapsible) for the behavior it ports.
