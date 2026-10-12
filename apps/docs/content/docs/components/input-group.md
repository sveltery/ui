---
title: Input Group
description: Add addons, buttons, and helper content to inputs and textareas.
---

<ComponentPreview name="base/InputGroupExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/input-group`. It builds on the `button`, `input` and `textarea` components, so copy those as well.

<ComponentSource name="input-group" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '$lib/components/ui/input-group';
  let url = $state('');
</script>
```

```svelte
<InputGroup>
  <InputGroupAddon>
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput name="url" placeholder="example.com" bind:value={url} />
  <InputGroupAddon align="inline-end">
    <InputGroupButton>Go</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

`InputGroupAddon` takes `align`: `inline-start` (default), `inline-end`, `block-start` or `block-end`. Clicking an addon focuses the input in the group, unless the click lands on a button or your own `onclick` calls `event.preventDefault()`. `InputGroupInput` and `InputGroupTextarea` accept `bind:value` like the `Input` and `Textarea` they wrap.

## API reference

`InputGroupInput` wraps the Sveltery UI `Input`, which is styled on top of the Sveltery Base `Input` primitive. See the [Base UI Input documentation](https://base-ui.com/react/components/input) for the behavior it ports.
