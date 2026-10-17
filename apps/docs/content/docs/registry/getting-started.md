---
title: Getting Started
description: Write, serve and test your own registry items.
order: 1
---

This guide walks you through publishing your own components as registry items. It assumes you have a Svelte project with components that you want to share.

## Requirements

A registry item is a JSON file that follows the [registry-item schema](/docs/registry/registry-item-json). You can serve it from any server or static host that returns JSON over HTTP, such as a SvelteKit app's `static` folder, GitHub Pages or a CDN.

The CLI has no `build` command, so you write the item files yourself or generate them with a script.

## Add an item

### Write the component

Write the component in a folder of its own. Import other components with relative paths, such as `../button`, because the CLI copies every item into the same `ui` directory and does not rewrite imports.

```svelte title="hello-card/HelloCard.svelte"
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

```ts title="hello-card/index.ts"
export { default as HelloCard } from './HelloCard.svelte';
```

### Write the item

Put each file's source in `content`, and its path below the `ui` directory in `target`.

```json title="hello-card.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "hello-card",
  "type": "registry:ui",
  "title": "Hello Card",
  "description": "A card with a greeting and a button.",
  "dependencies": ["@sveltery/base@^0.2.0"],
  "registryDependencies": ["button", "https://example.com/r/format-name.json"],
  "files": [
    {
      "type": "registry:ui",
      "target": "hello-card/HelloCard.svelte",
      "content": "<script lang=\"ts\">\n  import { Button } from '../button';\n  import { formatName } from '../format-name';\n\n  let { name }: { name: string } = $props();\n</script>\n\n<div class=\"rounded-lg border p-4\">\n  <p>Hello, {formatName(name)}.</p>\n  <Button>Wave</Button>\n</div>\n"
    },
    {
      "type": "registry:ui",
      "target": "hello-card/index.ts",
      "content": "export { default as HelloCard } from './HelloCard.svelte';\n"
    }
  ]
}
```

`button` is a name, so the CLI installs Button from the project's registry, in the project's style. The second entry is a URL, so the CLI fetches that item from your registry. Write it the same way:

```json title="format-name.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "format-name",
  "type": "registry:lib",
  "files": [
    {
      "type": "registry:ui",
      "target": "format-name/index.ts",
      "content": "export const formatName = (name: string) => name.trim().replace(/^./, (c) => c.toUpperCase());\n"
    }
  ]
}
```

## Serve your registry

Serve the item files as static JSON. In a SvelteKit app, put them in `static/r`:

```txt
static
└── r
    ├── format-name.json
    └── hello-card.json
```

The items are then at `https://example.com/r/hello-card.json` and `https://example.com/r/format-name.json`.

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

## Guidelines

- Give each item a `name`, `title` and `description`.
- List every item it builds on in `registryDependencies`, and every npm package it imports in `dependencies`. Use `name@range`, such as `@sveltery/base@^0.2.0`, to set a version.
- Keep each item's files in a folder named after the item, and import other items with relative paths.
- Use `IconPlaceholder` for icons, so the component uses the project's icon library. See [Examples](/docs/registry/examples#icons).
- A `target` must be a relative path without `..` segments. The CLI rejects an item whose files would land outside the `ui` directory.
