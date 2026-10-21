# Registry Authoring and Addresses

Use this reference when the user wants to create, fix, publish or reason about a registry of Svelte components for the Sveltery UI CLI.

The full guides start at [ui.sveltery.dev/docs/registry.md](https://ui.sveltery.dev/docs/registry.md), with [Getting Started](https://ui.sveltery.dev/docs/registry/getting-started.md), [registry.json](https://ui.sveltery.dev/docs/registry/registry-json.md), [registry-item.json](https://ui.sveltery.dev/docs/registry/registry-item-json.md), [Namespaces](https://ui.sveltery.dev/docs/registry/namespace.md) and [Authentication](https://ui.sveltery.dev/docs/registry/authentication.md). They win over this page.

## Mental Model

A registry has two forms:

- **Source registry.** An authored `registry.json`. Each file names a `path` to a source file.
- **Built registry.** One JSON file per item, with each file's source in `content`, served over HTTP. `npx @sveltery/ui@latest build` writes it to `static/r`, which SvelteKit serves at `/r/<name>.json`.

The format follows the shadcn registry, limited to what this CLI reads. Items hold Svelte 5 components, TypeScript modules, pages and files.

## Root `registry.json`

```json
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
    }
  ]
}
```

Rules:

- The root file needs `name` and `homepage`.
- Item names are lowercase letters, digits and hyphens. `build` writes each item to `<name>.json`.
- `include` splits the registry into more `registry.json` files. Each path is relative to the including file and ends in `registry.json`. No folders, URLs, absolute paths or `..`. Item names stay unique across all of them.

## Writing an Item

- Put each item's files in a folder named after it, with an `index.ts` that re-exports the components: `export { default as HelloCard } from './HelloCard.svelte';`.
- Import other items with relative paths, such as `../button`. The CLI copies every item into the same `ui` directory and does not rewrite these imports.
- Write Svelte 5: `$props()`, snippets, `class`, spread the rest props. Follow the [rules](./rules/styling.md) for classes.
- Use `IconPlaceholder` for icons, so the item switches to the installing project's icon library. See [Examples](https://ui.sveltery.dev/docs/registry/examples.md).
- List every npm import in `dependencies`. Use `name@range` to pin a version.

## Item Types

| Type | What `add` does |
| --- | --- |
| `registry:ui` | Writes the files below the `ui` directory |
| `registry:lib` | Writes the files. `diff` and `update` check it only as a dependency |
| `registry:block` | Writes the files, usually pages and components |
| `registry:theme` | Tokens in `cssVars`. Only `init` applies them |
| `registry:font` | A font in `font`. Only `init` installs it |
| `registry:base` | A preset with `config`, `cssVars` and `css`. Only `init --preset` reads it |

`add` never applies `cssVars`, `css`, `config` or `font`. `build` stops on a type the CLI cannot install, such as `registry:hook`.

## Files and Targets

- `path` is relative to the `registry.json` that declares it, without `..`.
- A `registry:ui` file without `target` lands below the `ui` directory at the part of `path` after its first `ui/` folder: `src/lib/components/ui/hello-card/HelloCard.svelte` → `hello-card/HelloCard.svelte`.
- A `registry:component` file lands below the `components` directory at the part of `path` after its first `components/` folder.
- A `registry:page` or `registry:file` file needs a `target`, such as `src/routes/greeting/+page.svelte`.
- A `target` is relative and cannot leave the `ui` directory.

## Registry Dependencies

`registryDependencies` entries are item addresses, not file paths.

| Address | Meaning |
| --- | --- |
| `button` | `button` from the installing project's registry (Sveltery UI by default), in its style |
| `@acme/format-name` | `format-name` from the registry the project maps to `@acme` in `components.json` |
| `https://example.com/r/format-name.json` | That built item, fetched as is |
| `acme/ui/format-name` | `format-name` from the root `registry.json` of the public GitHub repository `acme/ui` |
| `acme/ui/format-name#v1.0` | The same, at a branch, tag or commit |

- A bare name never means "this registry". To depend on your own item, use its URL, `@namespace/name` or `owner/repo/name`.
- Refs are not inherited. A GitHub dependency without `#ref` reads the default branch even when its parent was installed at a ref.

## Namespaces

Users map a namespace to a URL template in `components.json`:

```json
{
  "registries": {
    "@acme": "https://example.com/r/{name}.json",
    "@internal": {
      "url": "https://registry.company.com/{style}/{name}.json",
      "headers": { "Authorization": "Bearer ${REGISTRY_TOKEN}" }
    }
  }
}
```

`{name}` is the item and `{style}` is the project's style. `${VAR}` reads an environment variable. `@sveltery` is built in and cannot be remapped.

## GitHub Registries

A public repository with a root `registry.json` is a registry. The CLI reads `registry.json` and each file at the same ref. It does not resolve `include` in a GitHub registry and cannot read private repositories.

## Build and Verify

```bash
npx @sveltery/ui@latest build
npx @sveltery/ui@latest build ./registry.json --output ./public/r   # Vite without SvelteKit

npx @sveltery/ui@latest search https://example.com/r/registry.json
npx @sveltery/ui@latest search @acme -q card
npx @sveltery/ui@latest view https://example.com/r/hello-card.json
npx @sveltery/ui@latest add https://example.com/r/hello-card.json --dry-run
npx @sveltery/ui@latest add acme/ui/hello-card --dry-run
```

Test every item with `add --dry-run` in a project that ran `init`.

## Not Supported

The registry index, `registry add`, `registry validate`, private GitHub registries, `include` in a GitHub registry, MCP and Open in v0. Do not suggest them.
