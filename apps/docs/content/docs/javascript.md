---
title: JavaScript
description: How to use Sveltery UI with JavaScript.
order: 8
---

Sveltery UI and its components are written in TypeScript. We recommend TypeScript for your project as well.

The CLI supports TypeScript projects only. It copies components as `.svelte` files with `<script lang="ts">` and as `.ts` modules, and `components.json` must have `"typescript": true`. With any other value, the CLI stops:

```txt
components.json is invalid. typescript: expected true, got boolean. Only TypeScript projects are supported.
```

The shadcn CLI can write JavaScript components when `tsx` is `false`. This CLI has no JavaScript output yet.

## Use the components in a JavaScript app

A SvelteKit app that you write in JavaScript can still use the components. Svelte and Vite compile the TypeScript in `.svelte` and `.ts` files, so the copied components build in an app that has only a `jsconfig.json`. Your own files stay JavaScript.

```svelte title="src/routes/+page.svelte"
<script>
  import { Button } from '#lib/components/ui/button';
</script>

<Button>Click me</Button>
```
