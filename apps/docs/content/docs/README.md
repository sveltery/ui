# Docs content

Each `.md` file in this folder is one page of the docs site. The file path is the URL: `components/button.md` is `/docs/components/button`, and `index.md` is the folder's own page.

Pages are [mdsvex](https://github.com/pngwn/MDsveX) markdown, so they can use Svelte components. Code blocks are highlighted at build time with Shiki.

## Add a component page

1. Add the component to `apps/docs/registry/bases/base/ui/<name>`. The registry build turns each folder there into the item that `npx @sveltery/ui@latest add <name>` installs.
2. Add a preview to `apps/docs/examples`.
3. Create `components/<name>.md` from the template below. The `npx @sveltery/ui@latest add` name and the `<ComponentSource>` name are the folder name. The manual `npm install` line lists the packages the component and the folders it copies import, leaving out `cn`, `class-variance-authority` and the icon library, which `init` installs. Leave the step out when that list is empty. `markdown/install-steps.test.ts` checks it.

The sidebar, search, previous and next links, `llms.txt` and the sitemap pick the page up. You do not edit a nav file.

````md
---
title: Button
description: Displays a button or a component that looks like a button.
---

<ComponentPreview name="base/ButtonExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add button
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button`.

<ComponentSource name="button" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Button } from '#lib/components/ui/button';
</script>
```

```svelte
<Button variant="outline">Button</Button>
```
````

## Frontmatter

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | yes | The page heading and the sidebar label |
| `description` | yes | The lead paragraph, the meta description and the `llms.txt` entry |
| `order` | no | The position in the sidebar section. Pages without it sort by title after ordered pages |

The build fails when a page misses `title` or `description`.

## Components you can use

These need no import:

| Component | Use |
| --- | --- |
| `<ComponentPreview name="base/ButtonExample" />` | A live preview of `apps/docs/examples/<name>.svelte` with its source under **View Code**. Props: `align` (`center`, `start` or `end`), `hideCode` |
| `<ComponentSource name="button" />` | Every source file in `apps/docs/registry/bases/base/ui/<name>`, in the Nova style, and the `shared/` helpers it imports, highlighted, with a copy button. It also names the other component folders the component imports |
| `<Steps>` | Numbers each `###` heading inside it |
| `<InstallTabs>` and `<InstallTab value="cli">`, `<InstallTab value="manual">` | The Installation section's CLI and Manual tabs. Put a blank line around each tag so the markdown inside renders |
| `<Callout title="...">` | A highlighted note. It shows an icon only when the page passes an `icon` snippet, like upstream's `icon` prop |
| `<ComponentsList />` | Links to every component page |

The build resolves `name` and fails when the example or the folder does not exist. Write both as self-closing tags.

Code blocks take a `title="..."` and a `showLineNumbers` flag after the language. A block that starts with `npm install`, `npx`, `npm create` or `npm run` shows a tab for each package manager.

## Sections

A page's sidebar section is its folder: the root is Get Started, `components/` is Components and `forms/` is Forms. To add a section, add its folder to `SECTIONS` in `src/lib/docs/content.server.ts`.
