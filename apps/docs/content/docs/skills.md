---
title: Skills
description: Give your AI assistant project-aware knowledge of Sveltery UI components, patterns and the CLI.
order: 7.5
---

Skills give AI assistants, such as Claude Code, context about Sveltery UI. With the skill installed, your assistant knows how to find, install, compose and customize components with the Svelte APIs and the settings of your project.

For example, you can ask your assistant to:

- _"Add a login form with email and password fields."_
- _"Create a settings page with a form for updating profile information."_
- _"Build a dashboard with a sidebar, stats cards and a data table."_
- _"Build a chat view that streams the assistant's reply."_
- _"Switch to preset b4xFeBLg4O, but keep my components."_

The skill reads your project through the CLI: the framework, the aliases, the installed components, the icon library and the style. The assistant uses them to write code that fits your project.

Sveltery UI is not 1.0 yet, so the skill can lag behind these docs. When they disagree, the docs are correct. The skill tells the assistant so.

---

## Install

```bash
npx skills add sveltery/ui
```

This adds the `sveltery` skill to your project. Your assistant loads it when you work with Sveltery UI components.

Learn more about skills at [skills.sh](https://skills.sh).

---

## What it knows

### Project context

When the skill loads, it runs `npx @sveltery/ui@latest info --json`. The output gives the assistant your framework (SvelteKit or Vite), the Svelte and Tailwind CSS versions, your `components.json`, the resolved paths, the preset and the installed components.

### CLI commands

The skill has a reference for every command: `init`, `apply`, `add`, `diff`, `update`, `search`, `view`, `docs`, `info`, `preset`, `build`, `migrate` and `eject`. It lists only the flags the CLI has, so the assistant does not guess flags from the shadcn CLI.

### Svelte idioms

The assistant writes Svelte 5, not React. It uses `class` instead of `className`, `for` instead of `htmlFor`, `bind:open` and `bind:value`, and `render` snippets instead of `asChild`.

### Composition rules

The skill has rules with incorrect and correct examples for forms, composition, styling, icons and chat. For example, it uses `FieldGroup` and `Field` for forms, `ToggleGroup` for option sets, semantic colors instead of raw ones, and `MessageScroller` for chat threads.

### Theming and customization

The skill explains the CSS variables, dark mode, custom colors, the radius, and how to add variants to a component's `variants.ts`.

### Registry authoring

The skill explains how to write, build and serve your own registry: `registry.json`, item types, file targets, `registryDependencies`, namespaces and GitHub registries.

---

## How it works

1. **Project detection.** The skill activates in a Svelte project that uses Sveltery UI, such as one with a `components.json` that points at `ui.sveltery.dev`.
2. **Context injection.** It runs `info --json` and gives the result to the assistant.
3. **Pattern enforcement.** The assistant follows the composition rules and the Svelte idioms above.
4. **Component discovery.** Before the assistant writes code, it runs `docs` and `search`, then fetches the Markdown version of each component page. That page has the source of every example.

---

## Docs for LLMs

Each page of these docs has a Markdown version at the same URL with `.md` appended, such as [/docs/components/button.md](/docs/components/button.md). [llms.txt](/llms.txt) lists every page. The skill points the assistant at these pages instead of copying their content, so the skill stays small.

## Learn more

- [CLI](/docs/cli): every CLI command
- [Theming](/docs/theming): CSS variables and customization
- [Registry](/docs/registry): build and publish your own registry
- [Differences from shadcn/ui](/docs/differences): where Sveltery UI differs from upstream
- [skills.sh](https://skills.sh): about skills
