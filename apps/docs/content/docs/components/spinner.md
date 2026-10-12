---
title: Spinner
description: An indicator that can be used to show a loading state.
---

<ComponentPreview name="base/SpinnerExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn
```

### Copy the component

Copy the following files into `src/lib/components/ui/spinner`.

<ComponentSource name="spinner" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Spinner } from '$lib/components/ui/spinner';
</script>
```

```svelte
<Spinner class="size-6" />
```
