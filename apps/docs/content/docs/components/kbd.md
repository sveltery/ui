---
title: Kbd
description: Used to display textual user input from keyboard.
---

<ComponentPreview name="base/KbdExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add kbd
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
  import { Kbd, KbdGroup } from '$lib/components/ui/kbd';
</script>
```

```svelte
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```
