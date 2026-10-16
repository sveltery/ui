---
title: Input
description: A text input component for forms and user data entry with built-in styling and accessibility features.
---

<ComponentPreview name="base/InputExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add input
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/input`.

<ComponentSource name="input" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  let email = $state('');
</script>
```

```svelte
<Input type="email" name="email" placeholder="Email" bind:value={email} />
```

## Forms

`Input` renders a real `<input>`, so it submits its `name` and value with the form. Use `bind:value` to share the value, or `defaultValue` to give an unbound input its starting value.

```svelte
<form method="POST">
  <Input name="email" type="email" defaultValue="me@example.com" />
  <button type="submit">Save</button>
</form>
```

## API reference

`Input` is styled on top of the Sveltery Base `Input` primitive, which owns its behavior and its integration with Base fields and forms. See the [Base UI Input documentation](https://base-ui.com/react/components/input) for the behavior it ports.
