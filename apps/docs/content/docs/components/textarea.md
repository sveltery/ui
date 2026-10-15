---
title: Textarea
description: Displays a form textarea or a component that looks like a textarea.
---

<ComponentPreview name="base/TextareaExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add textarea
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/textarea`.

<ComponentSource name="textarea" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Textarea } from '$lib/components/ui/textarea';
</script>
```

```svelte
<Textarea name="message" placeholder="Type your message here." />
```
