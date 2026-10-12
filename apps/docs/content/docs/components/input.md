---
title: Input
description: A text input component for forms and user data entry with built-in styling and accessibility features.
---

<ComponentPreview name="base/InputExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/input`.

<ComponentSource name="input" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

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
