---
title: Separator
description: Visually or semantically separates content.
---

<ComponentPreview name="base/SeparatorExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/separator`.

<ComponentSource name="separator" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';
</script>
```

```svelte
<Separator />
```

## API reference

`Separator` is styled on top of the Sveltery Base `Separator` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Separator documentation](https://base-ui.com/react/components/separator) for the behavior it ports.
