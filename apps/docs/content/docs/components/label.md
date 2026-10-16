---
title: Label
description: Renders an accessible label associated with controls.
---

<ComponentPreview name="base/LabelExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add label
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/label`.

<ComponentSource name="label" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Label } from '$lib/components/ui/label';
</script>
```

```svelte
<Label for="email">Your email address</Label>
```
