---
title: Monorepo
description: Use Sveltery UI components and the CLI in a monorepo.
order: 7
---

The CLI understands a monorepo's structure. It installs components, their dependencies and their registry dependencies to the correct workspace, and it handles the imports for you.

## Getting started

<Steps>

### Create a new monorepo project

To create a new monorepo project, run the `init` command with the `--monorepo` flag in an empty directory.

```bash
npx @sveltery/ui@latest init --monorepo
```

The CLI asks for the project name, then for the style, the icon library and the base color, as `init` does in an app. To start from a preset, add `--preset`.

This creates a new monorepo project with two workspaces, `web` and `ui`, and [Turborepo](https://turbo.build/repo/docs) as the build system. The `web` workspace is a SvelteKit app, and the CLI adds the button to `ui` for you.

Everything is set up for you, so you can start adding components to your project.

### Add components to your project

To add components to your project, run the `add` command **in the path of your app**.

```bash
cd apps/web
```

```bash
npx @sveltery/ui@latest add [COMPONENT]
```

The CLI figures out what type of component you are adding and installs the files to the correct path.

For example, if you run `npx @sveltery/ui@latest add button`, the CLI installs the button component under `packages/ui` and its packages in `packages/ui/package.json`.

If you run `npx @sveltery/ui@latest add login-01`, the CLI installs the `button`, `card`, `field`, `input`, `label` and `separator` components under `packages/ui`, and the `login-form` component and the `/login` page under `apps/web`. The `login-form` component imports the other components from `@workspace/ui`.

`diff` and `update` work in the app the same way. Run at the root of the monorepo, `init` and `add` list the workspaces to run them in.

### Importing components

You can import components from the `@workspace/ui` package as follows:

```svelte
<script lang="ts">
  import { Button } from '@workspace/ui/components/button';
</script>
```

The components import `cn` from the [`cn`](https://www.npmjs.com/package/cn) package, so the ui package has no `lib/utils` file. Modules that you add to `packages/ui/src/lib` and `packages/ui/src/hooks` are importable as `@workspace/ui/lib/<name>` and `@workspace/ui/hooks/<name>`.

</Steps>

## File structure

When you create a new monorepo project, the CLI creates the following file structure:

```txt
apps
└── web                 # Your SvelteKit app goes here.
    ├── src
    │   ├── lib
    │   │   └── components
    │   │       └── login-form.svelte
    │   └── routes
    │       ├── +layout.svelte
    │       └── +page.svelte
    ├── components.json
    └── package.json
packages
└── ui                  # Your components and dependencies are installed here.
    ├── src
    │   ├── components
    │   │   └── button
    │   ├── hooks
    │   ├── lib
    │   └── styles
    │       └── globals.css
    ├── components.json
    └── package.json
package.json
turbo.json
```

`npm run check` at the root runs `svelte-check` in both workspaces, and `npm run dev` starts the app.

## Requirements

1. Every workspace must have a `components.json` file. A `package.json` file tells the package manager how to install the dependencies. A `components.json` file tells the CLI how and where to install components.

2. The `components.json` file must define the aliases of the workspace. This tells the CLI how to import components, hooks, utilities and so on.

```json title="apps/web/components.json"
{
  "$schema": "https://ui.sveltery.dev/schema.json",
  "style": "nova",
  "iconLibrary": "lucide",
  "rtl": false,
  "menuColor": "default",
  "tailwind": {
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "#lib/components",
    "hooks": "#lib/hooks",
    "lib": "#lib",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components"
  },
  "registry": "https://ui.sveltery.dev/r",
  "typescript": true
}
```

```json title="packages/ui/components.json"
{
  "$schema": "https://ui.sveltery.dev/schema.json",
  "style": "nova",
  "iconLibrary": "lucide",
  "rtl": false,
  "menuColor": "default",
  "tailwind": {
    "css": "src/styles/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "@workspace/ui/lib/utils",
    "hooks": "@workspace/ui/hooks",
    "lib": "@workspace/ui/lib",
    "ui": "@workspace/ui/components"
  },
  "registry": "https://ui.sveltery.dev/r",
  "typescript": true
}
```

3. Ensure you have the same `style`, `iconLibrary` and `baseColor` in both `components.json` files. The CLI transforms the ui components with the settings in `packages/ui/components.json`, and the app's own files with the settings in `apps/web/components.json`.

4. `tailwind.css` in `apps/web/components.json` names the stylesheet of the ui package. The app imports it as `@workspace/ui/globals.css` in `src/routes/+layout.svelte`.

By following these requirements, the CLI can install ui components, blocks and their packages to the correct paths and handle the imports for you.

To change the preset, run `apply` in `apps/web`. It writes the new settings to both `components.json` files, re-adds the ui components in `packages/ui` with them, and installs the packages of the theme and the fonts in `packages/ui`.

Run `migrate` in `packages/ui`, which holds the ui components and their settings, then set the same value in `apps/web/components.json`. Run in `apps/web`, a migration such as `migrate icons` changes the ui components in `packages/ui` but writes the new setting only to `apps/web/components.json`.

<Callout class="mt-6">
  `package.json#imports` works well for package-local aliases inside a workspace, such as `#lib` in the app. For shared workspace imports such as `@workspace/ui/components`, keep explicit aliases in `components.json`. The CLI uses those aliases to route files across workspace boundaries.
</Callout>

## Using `package.json#imports`

The app uses SvelteKit's `#lib` package import for its own files, and the ui package's `exports` for the shared imports. The CLI reads `#lib` as `src/lib`, and an alias such as `@workspace/ui/components` as the directory that the ui package exports under that path.

```json title="apps/web/package.json"
{
  "name": "web",
  "private": true,
  "type": "module",
  "imports": {
    "#lib": "./src/lib/index.js",
    "#lib/*": ["./src/lib/*", "./src/lib/*/index.js"]
  },
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

```json title="packages/ui/package.json"
{
  "name": "@workspace/ui",
  "private": true,
  "type": "module",
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*/index.ts",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

In this setup:

- files added from the app to the shared ui package are routed through `@workspace/ui/...`
- files added inside `packages/ui` go to the directories its own aliases name
- the shared package must export any path referenced by another workspace

The CLI finds the package by its name in the workspaces that `pnpm-workspace.yaml` or the `workspaces` field of the root `package.json` lists. With npm, the app depends on the ui package as `*` instead of `workspace:*`.
