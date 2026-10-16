---
title: Bubble
description: Displays conversational content in a message bubble. Supports variants, alignment, grouping, and reactions.
---

<ComponentPreview name="base/BubbleExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add bubble
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/bubble`.

<ComponentSource name="bubble" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Bubble, BubbleContent, BubbleGroup } from '$lib/components/ui/bubble';
</script>
```

```svelte
<BubbleGroup>
  <Bubble>
    <BubbleContent>Hey, are we still on for today?</BubbleContent>
  </Bubble>
  <Bubble align="end" variant="secondary">
    <BubbleContent>Yes, see you at three.</BubbleContent>
  </Bubble>
</BubbleGroup>
```

## Link

Pass a `render` snippet to `BubbleContent` to render it as a link or a button. Spread `props` onto it and render `children` inside it.

```svelte
<Bubble>
  <BubbleContent>
    {#snippet render(props, state, children)}
      <button type="button" {...props}>{@render children?.()}</button>
    {/snippet}
    Show me the report
  </BubbleContent>
</Bubble>
```
