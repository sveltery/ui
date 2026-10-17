---
title: registry-item.json
description: Specification for registry items.
order: 4
---

The `registry-item.json` schema defines one registry item: a component, a module, a theme, a font or a preset.

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
      "content": "<script lang=\"ts\">\n  import { Button } from '../button';\n</script>\n\n<Button>Hello</Button>\n"
    }
  ]
}
```

See [Examples](/docs/registry/examples) for more items.

## Definitions

The JSON Schema for `registry-item.json` is at [ui.sveltery.dev/schema/registry-item.json](https://ui.sveltery.dev/schema/registry-item.json). The CLI checks every item it fetches and stops with `is not a valid registry response` when an item does not match. It ignores keys that this page does not list.

### $schema

Required. The URL of the schema.

```json title="registry-item.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json"
}
```

### name

Required. The name of the item. A name in another item's `registryDependencies` refers to this name in the project's registry. Use lowercase letters, digits and hyphens, starting with a letter or digit, so that `add` accepts it.

```json title="registry-item.json"
{
  "name": "hello-card"
}
```

### title

A human-readable title for the item.

```json title="registry-item.json"
{
  "title": "Hello Card"
}
```

### description

A description of the item.

```json title="registry-item.json"
{
  "description": "A card with a greeting and a button."
}
```

### type

Required. The type of the item.

```json title="registry-item.json"
{
  "type": "registry:ui"
}
```

| Type | Description |
| --- | --- |
| `registry:ui` | A component. `add` writes its files. |
| `registry:lib` | A module, such as shared helpers. `add` writes its files. `diff` and `update` check it only as a dependency of an installed component. |
| `registry:theme` | A set of theme tokens in `cssVars`. `init` reads the base color's theme item. |
| `registry:font` | A font in `font`. `init` installs the fonts that a preset lists. |
| `registry:base` | A preset, with `config`, `cssVars` and `css`. `init --preset` reads it. |

`add` writes the files and installs the packages of any item type. It does not apply `cssVars`, `css`, `config` or `font`. Only `init` does.

### dependencies

The npm packages the item imports. Use `name@range`, such as `@sveltery/base@^0.2.0`, to set a version. The CLI installs only the packages that `package.json` does not list yet.

```json title="registry-item.json"
{
  "dependencies": ["@sveltery/base@^0.2.0", "cn"]
}
```

### registryDependencies

The items this item builds on. The CLI installs them first.

```json title="registry-item.json"
{
  "registryDependencies": ["button", "https://example.com/r/format-name.json"]
}
```

- A name, such as `button`, is an item of the project's registry in the project's style. It must use lowercase letters, digits and hyphens.
- `@namespace/name`, such as `@acme/format-name`, is an item of the registry that the installing project maps to `@acme` in `components.json`. See [Namespaces](/docs/registry/namespace).
- A URL starting with `http://` or `https://` is fetched as is.

### files

Required. The files of the item. Each file has these keys:

- `type`: always `registry:ui`.
- `target`: the path below the project's `ui` directory, such as `hello-card/HelloCard.svelte`. It must be relative and must not contain `..` segments.
- `content`: the source of the file.

```json title="registry-item.json"
{
  "files": [
    {
      "type": "registry:ui",
      "target": "hello-card/index.ts",
      "content": "export { default as HelloCard } from './HelloCard.svelte';\n"
    }
  ]
}
```

The CLI changes two things in a file's content as it writes it:

- It replaces each `IconPlaceholder` with an icon from the project's icon library. See [Examples](/docs/registry/examples#icons).
- It resolves the style markers `cn-menu-target`, `cn-menu-translucent`, `cn-font-heading` and `cn-rtl-flip` in class strings, from the project's `menuColor` and fonts.

It does not rewrite imports, so files import other items with relative paths.

An item with no files, such as a theme or a preset, has `"files": []`.

### cssVars

Theme tokens. `theme` goes into `@theme inline`, `light` into `:root` and `dark` into `.dark`. `init` merges them into your CSS file, for a theme item or a preset.

```json title="registry-item.json"
{
  "cssVars": {
    "theme": {
      "font-heading": "var(--font-sans)"
    },
    "light": {
      "brand": "oklch(0.546 0.245 262.881)"
    },
    "dark": {
      "brand": "oklch(0.623 0.214 259.815)"
    }
  }
}
```

### css

CSS rules for a preset, as a tree. A key is a selector or an at-rule, and its object holds what goes inside. A string value sets a declaration. An `@import "..."` key or an `@apply ...` key takes an empty object. `init` merges the tree into your CSS file.

```json title="registry-item.json"
{
  "css": {
    "@import \"tw-animate-css\"": {},
    "@layer base": {
      "body": {
        "@apply bg-background text-foreground": {}
      }
    }
  }
}
```

### config

Only for `registry:base`. The `components.json` values the preset sets: `style`, `iconLibrary`, `menuColor`, `menuAccent` and `tailwind.baseColor`. Each key is optional. A key the preset leaves out keeps the project's value.

```json title="registry-item.json"
{
  "config": {
    "style": "nova",
    "iconLibrary": "lucide",
    "menuColor": "default",
    "tailwind": { "baseColor": "neutral" }
  }
}
```

### font

Required for `registry:font`. The font to install from Fontsource.

```json title="font-inter.json"
{
  "$schema": "https://ui.sveltery.dev/schema/registry-item.json",
  "name": "font-inter",
  "type": "registry:font",
  "font": {
    "family": "'Inter Variable', sans-serif",
    "provider": "google",
    "variable": "--font-sans",
    "subsets": ["latin"],
    "import": "Inter",
    "dependency": "@fontsource-variable/inter"
  },
  "files": []
}
```

`init` installs `dependency`, imports it in your CSS file and sets `variable` to `family`. Without `dependency`, it uses `@fontsource-variable/` and the item name without `font-`. `--font-sans`, `--font-serif` and `--font-mono` apply to `html`. Set `selector` to apply the font to another selector. `provider` must be `google`. `import` is required, and `weight` and `subsets` are allowed, for compatibility with the shadcn format. The CLI does not use them.
