# Docs content

Each `.md` file in this folder is one page of the docs site. The file path is the URL: `components/button.md` is `/docs/components/button`, and `index.md` is the folder's own page.

Pages are [mdsvex](https://github.com/pngwn/MDsveX) markdown, so they can use Svelte components. Code blocks are highlighted at build time with Shiki.

## Add a component page

1. Add the component to `packages/ui/src/lib/<name>`.
2. Add a preview to `apps/docs/examples`.
3. Create `components/<name>.md` from the template below.

The sidebar, search, previous and next links, `llms.txt` and the sitemap pick the page up. You do not edit a nav file.

````md
---
title: Button
description: Displays a button or a component that looks like a button.
---

<ComponentPreview name="base/ButtonExample" />

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority github:sveltery/base
```

### Copy the component

Copy the following files into `src/lib/components/ui/button`.

<ComponentSource name="button" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
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
| `<ComponentSource name="button" />` | Every source file in `packages/ui/src/lib/<name>` and the `shared/` helpers it imports, highlighted, with a copy button. It also names the other component folders the component imports |
| `<Steps>` | Numbers each `###` heading inside it |
| `<Callout title="...">` | A highlighted note |
| `<ComponentsList />` | Links to every component page |

The build resolves `name` and fails when the example or the folder does not exist. Write both as self-closing tags.

Code blocks take a `title="..."` and a `showLineNumbers` flag after the language. A block that starts with `npm install`, `npx`, `npm create` or `npm run` shows a tab for each package manager.

## Sections

A page's sidebar section is its folder: the root is Get Started, `components/` is Components and `forms/` is Forms. To add a section, add its folder to `SECTIONS` in `src/lib/docs/content.server.ts`.
