---
title: Spinner
description: An indicator that can be used to show a loading state.
---

<ComponentPreview name="base/SpinnerExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add spinner
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/spinner`.

<ComponentSource name="spinner" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Spinner } from '#lib/components/ui/spinner';
</script>
```

```svelte
<Spinner class="size-6" />
```
