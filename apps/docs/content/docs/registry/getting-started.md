---
title: Getting Started
description: Write, serve and test your own registry items.
order: 1
---

This guide walks you through publishing your own components as registry items. It assumes you have a Svelte project with components that you want to share.

## Requirements

A registry item is a JSON file that follows the [registry-item schema](/docs/registry/registry-item-json). You can serve it from any server or static host that returns JSON over HTTP, such as a SvelteKit app's `static` folder, GitHub Pages or a CDN.

`build` turns a `registry.json` and your source files into those item files.

## Add an item

### Write the component

Write the component in a folder of its own. Import other components with relative paths, such as `../button`, because the CLI copies every item into the same `ui` directory and does not rewrite imports.

```svelte title="src/lib/components/ui/hello-card/HelloCard.svelte"
<script lang="ts">
  import { Button } from '../button';
  import { formatName } from '../format-name';

  let { name }: { name: string } = $props();
</script>

<div class="rounded-lg border p-4">
  <p>Hello, {formatName(name)}.</p>
  <Button>Wave</Button>
</div>
```

```ts title="src/lib/components/ui/hello-card/index.ts"
export { default as HelloCard } from './HelloCard.svelte';
```

```ts title="src/lib/components/ui/format-name/index.ts"
export const formatName = (name: string) => name.trim().replace(/^./, (c) => c.toUpperCase());
```

### Add the item to registry.json

Create `registry.json` in the root of your project. List each item with its `name`, `type`, `title`, `description` and `files`. For each file, give its `path` from the project root and its `type`.

```json title="registry.json"
{
  "name": "acme",
  "homepage": "https://example.com",
  "items": [
    {
      "name": "hello-card",
      "type": "registry:ui",
      "title": "Hello Card",
      "description": "A card with a greeting and a button.",
      "dependencies": ["@sveltery/base@^0.2.0"],
      "registryDependencies": ["button", "https://example.com/r/format-name.json"],
      "files": [
        { "path": "src/lib/components/ui/hello-card/HelloCard.svelte", "type": "registry:ui" },
        { "path": "src/lib/components/ui/hello-card/index.ts", "type": "registry:ui" }
      ]
    },
    {
      "name": "format-name",
      "type": "registry:lib",
      "files": [{ "path": "src/lib/components/ui/format-name/index.ts", "type": "registry:ui" }]
    }
  ]
}
```

`button` is a name, so the CLI installs Button from the project's registry, in the project's style. The second entry is a URL, so the CLI fetches that item from your registry.

A `registry:ui` file goes to the `ui` directory of the project that adds it, at the part of `path` after `ui/`, such as `hello-card/HelloCard.svelte`. Set `target` to place it somewhere else. See [registry.json](/docs/registry/registry-json#items).

## Build your registry

Run `build` in the root of your project:

```bash
npx @sveltery/ui@latest build
```

It writes each item to `static/r`, with the source of each file in `content`, and copies `registry.json` there:

```txt
static
└── r
    ├── format-name.json
    ├── hello-card.json
    └── registry.json
```

```json title="static/r/format-name.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "format-name",
  "type": "registry:lib",
  "files": [
    {
      "path": "src/lib/components/ui/format-name/index.ts",
      "type": "registry:ui",
      "target": "format-name/index.ts",
      "content": "export const formatName = (name: string) => name.trim().replace(/^./, (c) => c.toUpperCase());\n"
    }
  ]
}
```

To write the files somewhere else, pass `--output`. See [build](/docs/cli#build).

## Serve your registry

SvelteKit serves the `static` folder, so `npm run dev` serves the items at `http://localhost:5173/r/hello-card.json` and `http://localhost:5173/r/format-name.json`. Once you deploy the app, they are at `https://example.com/r/hello-card.json` and `https://example.com/r/format-name.json`.

You can also serve the `static/r` folder from any static host that returns JSON over HTTP, such as GitHub Pages or a CDN.

## Test your registry

Run `add` with the item's URL in a project that ran `init`. Start with `--dry-run` to see the plan:

```bash
npx @sveltery/ui@latest add https://example.com/r/hello-card.json --dry-run
```

```txt
Files:
  + src/lib/components/ui/button/Button.svelte (new)
  + src/lib/components/ui/button/index.ts (new)
  + src/lib/components/ui/button/types.ts (new)
  + src/lib/components/ui/button/variants.ts (new)
  + src/lib/components/ui/format-name/index.ts (new)
  + src/lib/components/ui/hello-card/HelloCard.svelte (new)
  + src/lib/components/ui/hello-card/index.ts (new)
Packages:
  @sveltery/base@^0.2.0
```

The CLI installs the items an item depends on before the item itself. Then run it without `--dry-run` to write the files.

## Publish your registry

Share the item URLs with your users. They need a project that ran `init`, because the CLI reads `components.json` to find the `ui` directory, the style and the icon library.

To give your registry a short name, tell your users to add it to `registries` in `components.json`:

```json title="components.json"
{
  "registries": {
    "@acme": "https://example.com/r/{name}.json"
  }
}
```

They can then install `@acme/hello-card`. See [Namespaces](/docs/registry/namespace).

## Guidelines

- Give each item a `name`, `title` and `description`.
- List every item it builds on in `registryDependencies`, and every npm package it imports in `dependencies`. Use `name@range`, such as `@sveltery/base@^0.2.0`, to set a version.
- Keep each item's files in a folder named after the item, and import other items with relative paths.
- Use `IconPlaceholder` for icons, so the component uses the project's icon library. See [Examples](/docs/registry/examples#icons).
- A `target` must be a relative path without `..` segments. The CLI rejects an item whose files would land outside the `ui` directory.
