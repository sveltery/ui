---
title: registry.json
description: Specification for a root registry.
order: 3
---

A root registry is the registry the CLI reads names from. Sveltery UI's is at `https://ui.sveltery.dev/r`. Point the CLI at another one with the `registry` key in `components.json` or with `SVELTERY_REGISTRY_URL`, for example to test a preview deploy or to serve a mirror.

A root registry serves a manifest at `index.json`, which follows the `registry.json` schema:

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

## Layout

The CLI reads these paths below the registry root:

| Path | Read by | Holds |
| --- | --- | --- |
| `index.json` | every command | The manifest |
| `styles/<style>/<name>.json` | `add`, `diff`, `update`, `list`, `view`, `init --preset` | Each item in each style, and the font items that presets list |
| `themes/<baseColor>.json` | `init` without `--preset` | A `registry:theme` item with the base color's tokens |

`init --preset` with a preset name or code fetches `/init` on the registry's origin, which returns a `registry:base` item. `init` also writes `<origin>/schema.json` to the `$schema` key of `components.json`.

## Definitions

The JSON Schema for `registry.json` is at [ui.sveltery.dev/schema/registry.json](https://ui.sveltery.dev/schema/registry.json).

### $schema

Required. The URL of the schema.

```json title="index.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry.json"
}
```

### name

Required. Must be `sveltery`.

```json title="index.json"
{
  "name": "sveltery"
}
```

### registryVersion

Required. The version of the registry format, which is `1`. The CLI reads it first. When it is higher than the version the CLI reads, the CLI stops and asks you to update it.

```json title="index.json"
{
  "registryVersion": 1
}
```

### styles

Required. The styles the registry serves. `init` stops when the project's style is not in this list.

```json title="index.json"
{
  "styles": ["nova", "vega"]
}
```

### baseColors

Required. The base colors that have a theme item under `themes/`.

```json title="index.json"
{
  "baseColors": ["neutral", "stone"]
}
```

### iconLibraries

Required. The icon libraries the items support.

```json title="index.json"
{
  "iconLibraries": ["lucide", "tabler"]
}
```

### items

Required. Every item the registry serves under each style, with its `name` and `type`, and an optional `description`. `add` accepts only names in this list, `add --all` adds all of them, and `list` prints them.

```json title="index.json"
{
  "items": [
    { "name": "button", "type": "registry:ui", "description": "Displays a button." }
  ]
}
```

An item can have `meta.links`, an object from a name to a URL, which `docs` prints for the item. Sveltery UI's registry gives each component `docs`, `examples` and, when it is styled on a Base UI component, `api`.

```json title="index.json"
{
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "meta": {
        "links": {
          "docs": "https://ui.sveltery.dev/docs/components/button",
          "examples": "https://ui.sveltery.dev/docs/components/button.md",
          "api": "https://base-ui.com/react/components/button.md"
        }
      }
    }
  ]
}
```
