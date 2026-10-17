---
title: Monorepo
description: Use Sveltery UI components and the CLI in a monorepo.
order: 7
---

In a monorepo, keep your components in one shared workspace package and import them from each app. Run the CLI in that package, and it installs the components and their dependencies there.

The shadcn CLI can scaffold a monorepo with `init --monorepo` and route files across workspaces. This CLI does neither yet. You create the shared package yourself, and you point the CLI at it with `--cwd`.

## File structure

These steps use pnpm workspaces and build this layout:

```txt
apps
└── web                 # Your SvelteKit app.
    ├── src
    │   └── routes
    │       ├── layout.css
    │       └── +page.svelte
    └── package.json
packages
└── ui                  # Your components and their dependencies.
    ├── src
    │   ├── lib
    │   │   └── components
    │   │       └── ui
    │   │           └── button
    │   └── styles
    │       └── globals.css
    ├── components.json
    └── package.json
package.json
pnpm-workspace.yaml
```

## Getting started

<Steps>

### Create the workspace

List the workspaces in `pnpm-workspace.yaml`:

```yaml title="pnpm-workspace.yaml"
packages:
  - apps/*
  - packages/*
```

Create the app in `apps/web`, then add Tailwind CSS to it:

```bash
npx sv create apps/web
```

```bash
npx sv add tailwindcss -C apps/web
```

### Create the shared package

Create `packages/ui/package.json`. The CLI checks that the package lists Svelte 5, Tailwind CSS 4, and `vite` or `@sveltejs/kit`. The `#lib/*` import tells `init` to write `#lib` aliases, and `exports` lets the app import the components and the stylesheet.

```json title="packages/ui/package.json"
{
  "name": "@workspace/ui",
  "private": true,
  "type": "module",
  "imports": {
    "#lib/*": "./src/lib/*"
  },
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./components/*": "./src/lib/components/ui/*/index.ts"
  },
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "svelte": "^5.56.7",
    "tailwindcss": "^4.3.0",
    "vite": "^8.3.0"
  }
}
```

Create the stylesheet. `@source` tells Tailwind to scan the package's own files, because Tailwind does not scan packages that the app reaches through `node_modules`.

```css title="packages/ui/src/styles/globals.css"
@import "tailwindcss";
@source "..";
```

### Set up the shared package

Run `init` in the shared package. It finds `src/styles/globals.css`, adds the theme to it and installs the base packages in `packages/ui`.

```bash
npx @sveltery/ui@latest init --cwd packages/ui
```

### Use the shared package in the app

Add the package to the app's dependencies:

```json title="apps/web/package.json"
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

Replace the app's stylesheet with the shared one:

```css title="apps/web/src/routes/layout.css"
@import "@workspace/ui/globals.css";
```

Then run `pnpm install` at the root.

### Add components

Run `add` with `--cwd` pointing at the shared package. `--cwd` is relative to where you run the command, so from `apps/web` it is `--cwd ../../packages/ui`.

```bash
npx @sveltery/ui@latest add button --cwd packages/ui
```

The CLI writes the files to `packages/ui/src/lib/components/ui/button` and installs `@sveltery/base` and the other packages in `packages/ui`.

### Import components

Import components from the `@workspace/ui` package:

```svelte title="apps/web/src/routes/+page.svelte"
<script lang="ts">
  import { Button } from '@workspace/ui/components/button';
</script>

<Button variant="outline">Click me</Button>
```

</Steps>

## Requirements

1. Run every CLI command in the shared package, with `--cwd` or from its folder. Only that package needs a `components.json`.
2. The shared package exports each path that an app imports.
3. The app's CSS imports the shared stylesheet, so the theme tokens and the component classes reach the app.

To keep `diff` and `update` working, run them in the shared package too:

```bash
npx @sveltery/ui@latest diff --cwd packages/ui
```
