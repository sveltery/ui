---
title: Registry
description: Distribute your own components through the Sveltery UI CLI.
---

The CLI installs components from a registry: JSON files served over HTTP. Each component is one registry item, a JSON file that holds its source files, the packages it needs and the items it builds on. Sveltery UI's own components are served this way at `https://ui.sveltery.dev/r`.

You can serve your own items the same way. Host each item as a JSON file, and anyone can install it with `add` and its URL:

```bash
npx @sveltery/ui@latest add https://example.com/r/hello-card.json
```

The CLI copies the item's files into the project's `ui` directory, installs its packages, and installs the items it depends on, from your registry or from Sveltery UI's.

## What the CLI supports

The format follows the shadcn registry, limited to what this CLI reads. It supports:

- adding an item by its URL, and checking it with `diff <url>` and `update <url>`,
- `registryDependencies` by name, from the project's registry, or by URL, from any registry,
- `dependencies` on npm packages,
- items that switch to the project's icon library,
- a different root registry with `SVELTERY_REGISTRY_URL` or the `registry` key in `components.json`, for example a preview deploy of Sveltery UI.

It does not support these shadcn registry features yet: a `build` command, namespaces such as `@acme/button`, authentication headers, GitHub registries, search, the registry index, MCP and Open in v0. Without arguments, `diff` and `update` check only the registry's own items, so pass the URL of an item you added by URL.

## Next steps

- [Getting Started](/docs/registry/getting-started) shows how to write and serve your own items.
- [Examples](/docs/registry/examples) shows items of each type.
- [registry-item.json](/docs/registry/registry-item-json) describes the fields of an item.
- [registry.json](/docs/registry/registry-json) describes a root registry, which `SVELTERY_REGISTRY_URL` can point at.
