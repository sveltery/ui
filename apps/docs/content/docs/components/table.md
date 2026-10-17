---
title: Table
description: A responsive table component.
---

<ComponentPreview name="base/TableDemoExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add table
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority
```

### Copy the component

Copy the following files into `src/lib/components/ui/table`.

<ComponentSource name="table" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '#lib/components/ui/table';
</script>
```

```svelte
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead class="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead class="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell class="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell class="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Composition

Use the following composition to build a `Table`:

```text
Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       ├── TableHead
│       ├── TableHead
│       ├── TableHead
│       └── TableHead
├── TableBody
│   ├── TableRow
│   │   ├── TableCell
│   │   ├── TableCell
│   │   ├── TableCell
│   │   └── TableCell
│   └── TableRow
│       ├── TableCell
│       ├── TableCell
│       ├── TableCell
│       └── TableCell
└── TableFooter
```

## Footer

Use the `<TableFooter />` component to add a footer to the table.

<ComponentPreview name="base/TableFooterExample" />

## Actions

A table showing actions for each row using a `<DropdownMenu />` component.

<ComponentPreview name="base/TableActionsExample" />

## Data Table

You can use the `<Table />` component to build more complex data tables. Combine it with [TanStack Table](https://tanstack.com/table/latest) to create tables with sorting, filtering and pagination.

See the [Data Table](/docs/components/data-table) documentation for more information.

You can also see an example of a data table in the [Tasks](https://ui.shadcn.com/examples/tasks) demo.

## RTL

Wrap the table in a [DirectionProvider](/docs/components/direction) and set `dir` on `Table`. Use the language selector to switch the language.

<ComponentPreview name="base/TableRtlExample" direction="rtl" align="start" />
