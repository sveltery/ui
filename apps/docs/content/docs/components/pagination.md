---
title: Pagination
description: Pagination with page navigation, next and previous links.
---

<ComponentPreview name="base/PaginationDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add pagination
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/base @lucide/svelte
```

### Copy the component

Copy the following files into `src/lib/components/ui/pagination`.

<ComponentSource name="pagination" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '#lib/components/ui/pagination';
</script>
```

```svelte
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Composition

Use the following composition to build a `Pagination`:

```text
Pagination
└── PaginationContent
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink
    ├── PaginationItem
    │   └── PaginationEllipsis
    └── PaginationItem
        └── PaginationNext
```

## Simple

A simple pagination with only page numbers.

<ComponentPreview name="base/PaginationSimpleExample" />

## Icons Only

Use just the previous and next buttons without page numbers. This is useful for data tables with a rows per page selector.

<ComponentPreview name="base/PaginationIconsOnlyExample" />

## SvelteKit

`PaginationLink` renders an `<a>` tag, so SvelteKit's client router handles `href` links with no changes. Set `isActive` on the link for the current page, which sets `aria-current="page"` and `data-active`.

```svelte
<PaginationLink href="?page=2" isActive>2</PaginationLink>
```

## RTL

Wrap the pagination in a [DirectionProvider](/docs/components/direction) and set `dir` on `Pagination`. Pass `text` to `PaginationPrevious` and `PaginationNext` to translate their labels. Use the language selector to switch the language.

<ComponentPreview name="base/PaginationRtlExample" direction="rtl" align="start" />

## Changelog

### RTL Support

`PaginationPrevious` and `PaginationNext` take a `text` prop for their label, which defaults to "Previous" and "Next". If you edited your copy of the components and need to add the prop back, apply the following updates.

<Steps>

### Update `PaginationPrevious`.

```diff
  let {
    class: classProp,
+   text = 'Previous',
    ...props
  }: PaginationPreviousProps = $props();
  ...
- <span class="cn-pagination-previous-text hidden sm:block">Previous</span>
+ <span class="cn-pagination-previous-text hidden sm:block">{text}</span>
```

### Update `PaginationNext`.

```diff
  let {
    class: classProp,
+   text = 'Next',
    ...props
  }: PaginationNextProps = $props();
  ...
- <span class="cn-pagination-next-text hidden sm:block">Next</span>
+ <span class="cn-pagination-next-text hidden sm:block">{text}</span>
```

</Steps>

Both prop types are `Omit<PaginationLinkProps, 'children'> & { text?: string }` in `types.ts`.
