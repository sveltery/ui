---
title: Examples
description: Examples of registry items, by type.
order: 2
---

Each example is a complete item. Serve it as a JSON file, then install it with `add` and its URL, or with `init --preset` and its URL for a `registry:base` item.

## registry:ui

### UI component

A component with one file and an npm dependency.

```json title="shimmer-text.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "shimmer-text",
  "type": "registry:ui",
  "title": "Shimmer Text",
  "description": "Text with a shimmer for loading states.",
  "dependencies": ["cn@^0.2.2"],
  "files": [
    {
      "type": "registry:ui",
      "target": "shimmer-text/ShimmerText.svelte",
      "content": "<script lang=\"ts\">\n  import type { HTMLAttributes } from 'svelte/elements';\n  import { cn } from 'cn';\n\n  let { class: className, children, ...props }: HTMLAttributes<HTMLSpanElement> = $props();\n</script>\n\n<span class={cn('animate-pulse text-muted-foreground', className)} {...props}>{@render children?.()}</span>\n"
    },
    {
      "type": "registry:ui",
      "target": "shimmer-text/index.ts",
      "content": "export { default as ShimmerText } from './ShimmerText.svelte';\n"
    }
  ]
}
```

### UI component that builds on others

List the items a component imports in `registryDependencies`. A name installs that item from the project's registry, in the project's style. A URL installs it from any registry.

```json title="hello-card.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "hello-card",
  "type": "registry:ui",
  "registryDependencies": ["button", "https://example.com/r/format-name.json"],
  "files": [
    {
      "type": "registry:ui",
      "target": "hello-card/HelloCard.svelte",
      "content": "<script lang=\"ts\">\n  import { Button } from '../button';\n  import { formatName } from '../format-name';\n\n  let { name }: { name: string } = $props();\n</script>\n\n<div class=\"rounded-lg border p-4\">\n  <p>Hello, {formatName(name)}.</p>\n  <Button>Wave</Button>\n</div>\n"
    }
  ]
}
```

### Icons

To make a component use the project's icon library, write its icons as `IconPlaceholder` with one attribute per library. `add` replaces each placeholder and its import with the icon of the library in `components.json`, and installs that library's package.

```json title="done-label.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "done-label",
  "type": "registry:ui",
  "files": [
    {
      "type": "registry:ui",
      "target": "done-label/DoneLabel.svelte",
      "content": "<script lang=\"ts\">\n  import { IconPlaceholder } from '../icons/index.js';\n</script>\n\n<span class=\"inline-flex items-center gap-1 text-sm\">\n  <IconPlaceholder lucide=\"CheckIcon\" tabler=\"IconCheck\" hugeicons=\"Tick02Icon\" phosphor=\"CheckIcon\" remixicon=\"RiCheckLine\" class=\"size-4\" />\n  Done\n</span>\n"
    }
  ]
}
```

In a project with `"iconLibrary": "tabler"`, `add` writes this file:

```svelte title="done-label/DoneLabel.svelte"
<script lang="ts">
  import { IconCheck } from '@tabler/icons-svelte';
</script>

<span class="inline-flex items-center gap-1 text-sm">
  <IconCheck class="size-4" />
  Done
</span>
```

Give every placeholder a static attribute for all five libraries: `lucide`, `tabler`, `hugeicons`, `phosphor` and `remixicon`. The CLI stops when the project's library has no attribute.

## registry:lib

### Utility library

A module with no component. Its files still go to the `ui` directory.

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

## registry:base

### Custom preset

A `registry:base` item is a preset. Pass its URL to `init --preset`. `init` takes the style, icon library and menu color from `config`, writes the tokens in `cssVars` and the rules in `css` into your CSS file, and installs the fonts it lists in `registryDependencies`.

With a preset, `init` does not read the base color's theme item. `config.tailwind.baseColor` only sets the value in `components.json`. So a preset must carry the whole theme: the `@theme inline` mappings in `cssVars.theme`, every token in `light` and `dark`, and the imports and base layer in `css`. A preset that lists only a few tokens leaves the rest undefined in a new project.

The easiest start is a preset that Sveltery UI serves. Build one on the [Create page](/create), take the URL of its `init` command, and save the JSON it returns:

```bash
curl "https://ui.sveltery.dev/init?style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default" -o acme.json
```

Change `name` to your own, edit the tokens, and serve the file. This excerpt shows the keys you are most likely to change:

```json title="acme.json (excerpt)"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "acme",
  "type": "registry:base",
  "config": {
    "style": "nova",
    "iconLibrary": "lucide",
    "menuColor": "default",
    "menuAccent": "subtle",
    "tailwind": { "baseColor": "neutral" }
  },
  "registryDependencies": ["font-inter"],
  "cssVars": {
    "light": {
      "primary": "oklch(0.546 0.245 262.881)",
      "primary-foreground": "oklch(0.97 0.014 254.604)"
    },
    "dark": {
      "primary": "oklch(0.623 0.214 259.815)",
      "primary-foreground": "oklch(0.97 0.014 254.604)"
    }
  },
  "files": []
}
```

```bash
npx @sveltery/ui@latest init --preset https://example.com/r/acme.json
```

`font-inter` is one of the font items that Sveltery UI's registry serves. `init` installs `@fontsource-variable/inter`, imports it in your CSS file and sets `--font-sans`.
