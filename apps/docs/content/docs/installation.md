---
title: Installation
description: Add Sveltery UI to a SvelteKit app.
order: 1
---

Sveltery UI needs a Svelte 5 app with Tailwind CSS 4. These steps use SvelteKit.

<Callout title="Not on npm yet">

Sveltery UI and Sveltery Base are not published. The steps below install Base from GitHub and copy the UI source into your app.

</Callout>

<Steps>

### Create a project

Create a SvelteKit app, then add Tailwind CSS to it.

```bash
npx sv create my-app
```

```bash
npx sv add tailwindcss
```

### Install the dependencies

```bash
npm install github:sveltery/base cn class-variance-authority clsx tw-animate-css shadcn
```

pnpm builds Base from source on install. If pnpm asks, allow the build with the key that it prints in `pnpm-workspace.yaml`.

### Add the styles

Import the Sveltery UI theme in your global stylesheet. The `shadcn` package provides `shadcn/tailwind.css`.

```css title="src/app.css"
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));
```

Then copy the theme tokens from the [theming page](/docs/theming) into the same file.

### Add components

Open a component page, for example [Button](/docs/components/button), and copy its source into `src/lib/components/ui`.

### Use a component

```svelte title="src/routes/+page.svelte"
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>

<Button onclick={() => alert('Hello')}>Click me</Button>
```

</Steps>
