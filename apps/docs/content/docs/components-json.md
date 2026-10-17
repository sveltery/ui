---
title: components.json
description: Configuration for your project.
order: 2
---

The `components.json` file holds the configuration for your project.

The CLI reads it to learn how your project is set up, where to place components and how to adapt them to your choices.

<Callout title="components.json is only for the CLI">

You need it only if you use the CLI to add components. If you copy components by hand, you do not need this file.

</Callout>

Create the file with `init`:

```bash
npx @sveltery/ui@latest init
```

See [CLI](/docs/cli) for more information. A full file looks like this:

```json title="components.json"
{
  "$schema": "https://ui.sveltery.dev/schema.json",
  "style": "nova",
  "iconLibrary": "lucide",
  "rtl": false,
  "menuColor": "default",
  "tailwind": {
    "css": "src/app.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "#lib/components",
    "ui": "#lib/components/ui",
    "utils": "#lib/utils",
    "lib": "#lib",
    "hooks": "#lib/hooks"
  },
  "registry": "https://ui.sveltery.dev/r",
  "typescript": true
}
```

`init` writes the keys on this page in this order and keeps any other keys you add. The CLI stops with `components.json is invalid` when a required key is missing or a key has a value it does not know. Every key is required except `$schema`, `rtl`, `menuAccent`, `registry` and `registries`.

## $schema

The JSON Schema for `components.json` is at [ui.sveltery.dev/schema.json](https://ui.sveltery.dev/schema.json). Editors use it to complete and check the file.

```json title="components.json"
{
  "$schema": "https://ui.sveltery.dev/schema.json"
}
```

## style

The style of your components: `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`, `sera` or `rhea`. `add` fetches each component in this style.

```json title="components.json"
{
  "style": "nova"
}
```

To change the style, run `init --style <name>`, then run `update`. `init` does not touch your components. `update` shows how each installed component differs in the new style and asks before it overwrites it.

## iconLibrary

The icon library your components import: `lucide`, `tabler`, `hugeicons`, `phosphor` or `remixicon`. When `add` copies a component, it rewrites the component's icons to this library and installs the library's Svelte package.

```json title="components.json"
{
  "iconLibrary": "lucide"
}
```

To change the library, run `init --icons <library>`, then run `update`.

## rtl

Whether your app is right-to-left. With `true`, `add` turns physical classes such as `ml-2` and `left-0` into logical ones such as `ms-2` and `start-0`, and flips arrow and chevron icons. It defaults to `false`.

```json title="components.json"
{
  "rtl": true
}
```

`init --rtl` sets it, and `migrate rtl` sets it while it converts the components you already have. See [RTL](/docs/rtl).

## menuColor

The look of menus: `default`, `inverted`, `default-translucent` or `inverted-translucent`. `add` applies it to the menu components it copies. An inverted menu gets the `dark` class. A translucent menu gets a blurred, see-through background.

```json title="components.json"
{
  "menuColor": "default"
}
```

A preset sets this key. You can also edit it, then run `update` to apply it to installed menus.

## menuAccent

The accent of highlighted menu items: `subtle` or `bold`. It is optional. `subtle` highlights an item with the muted accent color of the base color. `bold` highlights it with the primary color. `init` sets `--accent` and `--accent-foreground` in your CSS file to the values of `--primary` and `--primary-foreground`, in light and dark mode.

```json title="components.json"
{
  "menuAccent": "subtle"
}
```

A preset sets this key. If you edit it, run `init` again to apply it to your theme.

## tailwind

How Tailwind CSS is set up in your project. The CLI needs Tailwind CSS 4. If your app does not use Tailwind yet, run `npx sv add tailwindcss`.

### tailwind.css

The path to the CSS file that imports Tailwind CSS, relative to the project root. `init` adds the theme to this file.

```json title="components.json"
{
  "tailwind": {
    "css": "src/app.css"
  }
}
```

### tailwind.baseColor

The base color of the theme tokens: `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist` or `taupe`.

```json title="components.json"
{
  "tailwind": {
    "baseColor": "neutral"
  }
}
```

To change it, run `init --base-color <name>`. `init` replaces the theme tokens in your CSS file.

## aliases

The import roots of your project. SvelteKit resolves `$lib`, and SvelteKit 3 apps resolve `#lib` through `imports` in `package.json`. `init` writes `#lib` when your `package.json` maps `#lib/*`, and `$lib` otherwise.

`init` also adds a fallback to SvelteKit 3's `#lib/*` mapping. Vite resolves `#lib/components/ui/button` to the folder's `index.ts`, but TypeScript does not look inside a folder behind `imports`. It does try each target of an array:

```json title="package.json"
{
  "imports": {
    "#lib": "./src/lib/index.js",
    "#lib/*": ["./src/lib/*", "./src/lib/*/index.js"]
  }
}
```

The CLI places files by `aliases.ui`. It does not rewrite imports in the files it copies. Components import each other with relative paths, so they keep working wherever `aliases.ui` points.

`init` writes all five aliases, and the file must keep them. Only `ui` changes where files go.

### aliases.ui

The directory for `ui` components. Change it to install components somewhere else.

```json title="components.json"
{
  "aliases": {
    "ui": "#lib/components/ui"
  }
}
```

The value must start with `$lib` or `#lib`, which the CLI reads as `src/lib`, or with `./` or `../`, which it reads relative to the project root. In a monorepo, it can also be a path that a workspace package exports, such as `@workspace/ui/components`. The CLI then installs `ui` components in that package, with the settings of its own `components.json`. See [Monorepo](/docs/monorepo). The CLI stops with `Cannot place files for the alias` for any other value.

### aliases.components

The import root for your components.

```json title="components.json"
{
  "aliases": {
    "components": "#lib/components"
  }
}
```

### aliases.utils

The import root for utility functions.

```json title="components.json"
{
  "aliases": {
    "utils": "#lib/utils"
  }
}
```

### aliases.lib

The import root for `lib` files.

```json title="components.json"
{
  "aliases": {
    "lib": "#lib"
  }
}
```

### aliases.hooks

The import root for hooks.

```json title="components.json"
{
  "aliases": {
    "hooks": "#lib/hooks"
  }
}
```

## registry

The root URL of the registry the CLI reads. It defaults to `https://ui.sveltery.dev/r`. The `SVELTERY_REGISTRY_URL` environment variable takes precedence over it. See [Registry](/docs/registry).

```json title="components.json"
{
  "registry": "https://ui.sveltery.dev/r"
}
```

## registries

The namespaced registries you install from with `@namespace/item`, such as `npx @sveltery/ui@latest add @acme/hello-card`. Each key is a namespace that starts with `@`. Each value is the URL of an item, with `{name}` where the item name goes. See [Namespaces](/docs/registry/namespace).

```json title="components.json"
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json",
    "@internal": "https://registry.company.com/{style}/{name}.json"
  }
}
```

`{style}` is replaced with the project's `style`.

### Authentication

For a private registry, give an object with `url`, and `headers` or `params`:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      },
      "params": {
        "version": "latest"
      }
    }
  }
}
```

The CLI replaces each `${VAR}` with the environment variable of that name. It reads the variables from the environment, then from `.env.local`, `.env.development.local`, `.env.development` and `.env` in the project root. `params` become the query string, such as `?version=latest`. See [Authentication](/docs/registry/authentication).

`@sveltery` is built in. It names the registry in the `registry` key, so `@sveltery/button` is the same as `button`. A `@sveltery` entry in `registries` replaces it.

## typescript

Must be `true`. The CLI supports TypeScript projects only. See [JavaScript](/docs/javascript).

```json title="components.json"
{
  "typescript": true
}
```
