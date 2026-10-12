---
title: Textarea
description: Displays a form textarea or a component that looks like a textarea.
---

<ComponentPreview name="base/TextareaExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/textarea`.

<ComponentSource name="textarea" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Textarea } from '$lib/components/ui/textarea';
</script>
```

```svelte
<Textarea name="message" placeholder="Type your message here." />
```
