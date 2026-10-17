---
title: registry.json
description: Specification for a registry that build reads, and for a root registry.
order: 3
---

The `registry.json` file defines your registry: its name, its homepage and its items. [`build`](/docs/cli#build) reads it and writes one item file per item.

```json title="registry.json"
{
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "hello-card",
      "type": "registry:ui",
      "title": "Hello Card",
      "description": "A card with a greeting and a button.",
      "registryDependencies": ["button", "https://example.com/r/format-name.json"],
      "dependencies": ["@sveltery/base@^0.2.0"],
      "files": [
        {
          "path": "src/lib/components/ui/hello-card/HelloCard.svelte",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

You can also split a large registry across several `registry.json` files with `include`.

```json title="registry.json"
{
  "name": "acme",
  "homepage": "https://acme.com",
  "include": ["src/lib/components/ui/registry.json", "src/lib/hooks/registry.json"]
}
```

## Definitions

### name

Required in the root `registry.json`. The name of your registry.

```json title="registry.json"
{
  "name": "acme"
}
```

### homepage

Required in the root `registry.json`. The homepage of your registry.

```json title="registry.json"
{
  "homepage": "https://acme.com"
}
```

### include

Other `registry.json` files whose items belong to this registry. Each path is relative to the file that includes it and must end in `registry.json`. Folder paths, URLs, absolute paths and `..` segments are not allowed.

```json title="registry.json"
{
  "include": ["src/lib/components/ui/registry.json"]
}
```

An included file may leave out `name` and `homepage`. In an included file, item file paths are relative to that file:

```json title="src/lib/components/ui/registry.json"
{
  "items": [
    {
      "name": "hello-card",
      "type": "registry:ui",
      "files": [{ "path": "hello-card/HelloCard.svelte", "type": "registry:ui" }]
    }
  ]
}
```

Item names must be unique across all included files. `build` writes a flattened `registry.json` without `include`, with each file path relative to the root `registry.json`.

### items

The items of your registry. Each item follows the [registry-item schema](/docs/registry/registry-item-json), except that its files name a `path` instead of holding `content`. `build` writes each item to `<name>.json`, so it stops when a `name` is not lowercase letters, digits and hyphens.

- `path`: the source file. Without `include`, it is relative to the working directory of `build`. It must be a relative path to a file inside that directory, without `..` segments.
- `type`: `registry:ui`, `registry:component`, `registry:page` or `registry:file`.
- `target`: where `add` writes the file. A `registry:ui` file without a `target` goes below the `ui` directory, at the part of `path` after its first `ui` folder, such as `hello-card/HelloCard.svelte`. A `registry:component` file does the same with its first `components` folder. Without that folder, the file name is the target. A `registry:page` or `registry:file` file needs a `target`.

```json title="registry.json"
{
  "items": [
    {
      "name": "greeting",
      "type": "registry:block",
      "files": [
        {
          "path": "src/routes/greeting/+page.svelte",
          "type": "registry:page",
          "target": "src/routes/greeting/+page.svelte"
        }
      ]
    }
  ]
}
```

`build` stops when an item is not one the CLI can install, for example an item of type `registry:hook`.

## Root registry

A root registry is the registry the CLI reads names from. Sveltery UI's is at `https://ui.sveltery.dev/r`. Point the CLI at another one with the `registry` key in `components.json` or with `SVELTERY_REGISTRY_URL`, for example to test a preview deploy or to serve a mirror.

A root registry serves a manifest at `index.json`:

```json title="index.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry.json",
  "name": "sveltery",
  "registryVersion": 1,
  "styles": ["vega", "nova", "maia", "lyra", "mira", "luma", "sera", "rhea"],
  "baseColors": ["neutral", "stone", "zinc", "mauve", "olive", "mist", "taupe"],
  "iconLibraries": ["lucide", "tabler", "hugeicons", "phosphor", "remixicon"],
  "items": [
    { "name": "accordion", "type": "registry:ui" },
    { "name": "button", "type": "registry:ui" }
  ]
}
```

To share your own components, you do not need a root registry. Serve item files and install them by URL, as [Getting Started](/docs/registry/getting-started) shows.

### Layout

The CLI reads these paths below the registry root:

| Path | Read by | Holds |
| --- | --- | --- |
| `index.json` | every command | The manifest |
| `styles/<style>/<name>.json` | `add`, `diff`, `update`, `list`, `view`, `init --preset` | Each item in each style, and the font items that presets list |
| `themes/<baseColor>.json` | `init` without `--preset` | A `registry:theme` item with the base color's tokens |

`init --preset` with a preset name or code fetches `/init` on the registry's origin, which returns a `registry:base` item. `init` also writes `<origin>/schema.json` to the `$schema` key of `components.json`.

### Manifest keys

The JSON Schema for the manifest is at [ui.sveltery.dev/schema/registry.json](https://ui.sveltery.dev/schema/registry.json).

#### $schema

Required. The URL of the schema.

```json title="index.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry.json"
}
```

#### name

Required. Must be `sveltery`.

```json title="index.json"
{
  "name": "sveltery"
}
```

#### registryVersion

Required. The version of the registry format, which is `1`. The CLI reads it first. When it is higher than the version the CLI reads, the CLI stops and asks you to update it.

```json title="index.json"
{
  "registryVersion": 1
}
```

#### styles

Required. The styles the registry serves. `init` stops when the project's style is not in this list.

```json title="index.json"
{
  "styles": ["nova", "vega"]
}
```

#### baseColors

Required. The base colors that have a theme item under `themes/`.

```json title="index.json"
{
  "baseColors": ["neutral", "stone"]
}
```

#### iconLibraries

Required. The icon libraries the items support.

```json title="index.json"
{
  "iconLibraries": ["lucide", "tabler"]
}
```

#### items

Required. Every item the registry serves under each style, with its `name` and `type`, and an optional `description`. `add` accepts only names in this list, `add --all` adds all of them, and `list` prints them.

```json title="index.json"
{
  "items": [
    { "name": "button", "type": "registry:ui", "description": "Displays a button." }
  ]
}
```
