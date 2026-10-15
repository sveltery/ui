---
title: Native Select
description: A styled native HTML select element with consistent design system integration.
---

<ComponentPreview name="base/NativeSelectExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add native-select
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/native-select`.

<ComponentSource name="native-select" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { NativeSelect, NativeSelectOption } from '$lib/components/ui/native-select';
  let status = $state('todo');
</script>
```

```svelte
<NativeSelect name="status" bind:value={status}>
  <NativeSelectOption value="todo">Todo</NativeSelectOption>
  <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
  <NativeSelectOption value="done">Done</NativeSelectOption>
</NativeSelect>
```

## Forms

`NativeSelect` is a real `<select>`, so it submits with its form and resets like one. A form reset selects the option marked `selected` in the markup, or the first option when none is.

```svelte
<form method="POST">
  <NativeSelect name="priority">
    <NativeSelectOption value="low">Low</NativeSelectOption>
    <NativeSelectOption value="medium" selected>Medium</NativeSelectOption>
    <NativeSelectOption value="high">High</NativeSelectOption>
  </NativeSelect>
  <button type="reset">Reset</button>
</form>
```
