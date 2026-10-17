---
title: Collapsible
description: An interactive component which expands/collapses a panel.
---

<ComponentPreview name="base/CollapsibleDemoExample" align="start" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add collapsible
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/collapsible`.

<ComponentSource name="collapsible" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '#lib/components/ui/collapsible';
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

Use the following composition to build a `Collapsible`:

```text
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

## Controlled State

Bind `open` to control the state.

```svelte
<script lang="ts">
  let open = $state(false);
</script>

<Collapsible bind:open>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

## Basic

<ComponentPreview name="base/CollapsibleBasicExample" align="start" />

## Settings Panel

Use a trigger button to reveal additional settings.

<ComponentPreview name="base/CollapsibleSettingsExample" />

## File Tree

Use nested collapsibles to build a file tree.

<ComponentPreview name="base/CollapsibleFileTreeExample" />

## RTL

Wrap the collapsible in a [DirectionProvider](/docs/components/direction) and set `dir` on `Collapsible`. Use the buttons to switch the language.

<ComponentPreview name="base/CollapsibleRtlExample" align="start" />

## API Reference

See the [Base UI Collapsible](https://base-ui.com/react/components/collapsible#api-reference) documentation.

`Collapsible` is styled on top of the Sveltery Base `Collapsible` primitive, which owns its behavior, open state and accessibility.
