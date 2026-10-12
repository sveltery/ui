---
title: Kbd
description: Used to display textual user input from keyboard.
---

<ComponentPreview name="base/KbdExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/kbd`.

<ComponentSource name="kbd" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Kbd, KbdGroup } from '$lib/components/ui/kbd';
</script>
```

```svelte
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```
