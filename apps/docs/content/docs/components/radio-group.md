---
title: Radio Group
description: A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
---

<ComponentPreview name="base/RadioGroupExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/radio-group`.

<ComponentSource name="radio-group" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
  import { Label } from '$lib/components/ui/label';
</script>
```

```svelte
<RadioGroup name="density" defaultValue="comfortable">
  <div class="flex items-center gap-2">
    <RadioGroupItem value="default" id="r1" />
    <Label for="r1">Default</Label>
  </div>
  <div class="flex items-center gap-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label for="r2">Comfortable</Label>
  </div>
</RadioGroup>
```

Bind `value` to read or change the selection.

```svelte
<script lang="ts">
  let density = $state("comfortable");
</script>

<RadioGroup bind:value={density}>...</RadioGroup>
```

## API reference

`RadioGroup` is styled on top of the Sveltery Base `RadioGroup` and `Radio` primitives, which own the selection, arrow-key navigation and the hidden inputs that take part in form submission. `RadioGroup` keeps the HTML form semantics: `name` submits the checked value, `defaultValue` sets the initial selection, and `bind:value` shares it with the parent. See the [Base UI Radio Group documentation](https://base-ui.com/react/components/radio-group) and the [Radio documentation](https://base-ui.com/react/components/radio) for the behavior they port.
