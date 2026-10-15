---
title: Avatar
description: An image element with a fallback for representing the user.
---

<ComponentPreview name="base/AvatarExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx sveltery add avatar
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/avatar`.

<ComponentSource name="avatar" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
</script>
```

```svelte
<Avatar>
  <AvatarImage src="https://github.com/sveltejs.png" alt="@sveltejs" />
  <AvatarFallback>SV</AvatarFallback>
</Avatar>
```

## API reference

`Avatar` is styled on top of the Sveltery Base `Avatar` primitive, which owns its behavior, focus handling and accessibility. See the [Base UI Avatar documentation](https://base-ui.com/react/components/avatar) for the behavior it ports.
