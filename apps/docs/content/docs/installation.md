---
title: Installation
description: Add Sveltery UI to a SvelteKit app.
order: 1
---

Sveltery UI needs a Svelte 5 app with Tailwind CSS 4. These steps use SvelteKit.

<Steps>

### Create a project

Create a SvelteKit app, then add Tailwind CSS to it.

```bash
npx sv create my-app
```

```bash
npx sv add tailwindcss
```

### Set up Sveltery UI

Run `init` in the project. It asks for a style, an icon library and a base color. Pass `-y` to take the defaults.

```bash
npx @sveltery/ui@latest init
```

`init` changes these files and packages, so check them in your diff:

- `components.json` holds your choices and the import aliases. `aliases.ui` is where components go, `src/lib/components/ui` by default.
- Your CSS file, `src/app.css` by default, gets the `tw-animate-css` and `@sveltery/ui/tailwind.css` imports, the `dark` custom variant, and the [theme tokens](/docs/theming) for light and dark mode. It also gets a base layer that gives every border the theme's `--border` color. Without that layer, a bare `border` class draws in the text color.
- `cn`, `class-variance-authority`, `tw-animate-css` and your icon library install as dependencies. `@sveltery/ui` installs as a dev dependency, because your CSS imports its `tailwind.css`.

Running `init` again with the same choices leaves your files unchanged.

To start from a preset instead, pass `--preset`. It takes a preset name such as `nova` or a preset code from the [Create page](/create). A preset sets the style, icon library, base color, theme, fonts, radius and menu look.

```bash
npx @sveltery/ui@latest init --preset <code>
```

### Add components

```bash
npx @sveltery/ui@latest add button
```

This copies the Button source into `src/lib/components/ui/button`. It also installs the packages Button needs, such as `@sveltery/base`. A component that builds on another one copies that one too. See [Components](/docs/components) for the full list.

### Use a component

```svelte title="src/routes/+page.svelte"
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>

<Button onclick={() => alert('Hello')}>Click me</Button>
```

</Steps>

## Keep components up to date

The files are yours to edit. To see how they differ from the current Sveltery UI source, run `diff`. It prints a diff and writes nothing.

```bash
npx @sveltery/ui@latest diff
```

Run `update` to apply the changes. It shows the diff for each file you changed and asks before it overwrites that file.

```bash
npx @sveltery/ui@latest update
```

`npx @sveltery/ui@latest list` shows every component and marks the ones in your project. Read the [CLI README](https://github.com/sveltery/ui/tree/main/packages/cli#readme) for all commands and options.
