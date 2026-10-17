---
title: Kbd
description: Used to display textual user input from keyboard.
---

<ComponentPreview name="base/KbdDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add kbd
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/kbd`.

<ComponentSource name="kbd" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Kbd, KbdGroup } from '#lib/components/ui/kbd';
</script>
```

```svelte
<Kbd>Ctrl</Kbd>
```

## Composition

Use the following composition to build `Kbd` and `KbdGroup`:

```text
Kbd
KbdGroup
├── Kbd
└── Kbd
```

## Group

Use the `KbdGroup` component to group keyboard keys together.

<ComponentPreview name="base/KbdGroupExample" />

## Button

Use the `Kbd` component inside a `Button` component to display a keyboard key inside a button.

<ComponentPreview name="base/KbdButtonExample" />

## Tooltip

You can use the `Kbd` component inside a `Tooltip` component to display a tooltip with a keyboard key.

<ComponentPreview name="base/KbdTooltipExample" />

## Input Group

You can use the `Kbd` component inside a `InputGroupAddon` component to display a keyboard key inside an input group.

<ComponentPreview name="base/KbdInputGroupExample" />

## RTL

Wrap the keys in a [DirectionProvider](/docs/components/direction) and set `dir` on their container. Use the language selector to switch the language.

<ComponentPreview name="base/KbdRtlExample" direction="rtl" align="start" />

## API Reference

### Kbd

Use the `Kbd` component to display a keyboard key.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

```svelte
<Kbd>Ctrl</Kbd>
```

### KbdGroup

Use the `KbdGroup` component to group `Kbd` components together.

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | -       |

```svelte
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>B</Kbd>
</KbdGroup>
```
