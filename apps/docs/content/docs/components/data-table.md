---
title: Data Table
description: Powerful table and datagrids built using TanStack Table.
---

<ComponentPreview name="base/DataTableDemoExample" align="start" class="[&_[data-slot=preview]]:h-auto [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:min-h-0 [&_[data-slot=preview]]:px-4 md:[&_[data-slot=preview]]:px-8" hideCode />

## Introduction

Every data table or datagrid I've created has been unique. They all behave differently, have specific sorting and filtering requirements, and work with different data sources.

It doesn't make sense to combine all of these variations into a single component. If we do that, we'll lose the flexibility that [headless UI](https://tanstack.com/table/latest/docs/overview#what-is-headless-ui) provides.

So instead of a data-table component, I thought it would be more helpful to provide a guide on how to build your own.

We'll start with the basic `<Table />` component and build a complex data table from scratch.

<Callout class="mt-4">

**Tip:** If you find yourself using the same table in multiple places in your app, you can always extract it into a reusable component.

</Callout>

## Table of Contents

This guide will show you how to use [TanStack Table](https://tanstack.com/table) and the `<Table />` component to build your own custom data table. We'll cover the following topics:

- [Set up Table Features](#set-up-table-features)
- [Basic Table](#basic-table)
- [Row Actions](#row-actions)
- [Pagination](#pagination)
- [Sorting](#sorting)
- [Filtering](#filtering)
- [Visibility](#visibility)
- [Row Selection](#row-selection)
- [Reusable Components](#reusable-components)

## Installation

1. Add the `<Table />` component to your project:

```bash
npx @sveltery/ui@latest add table
```

The code in this guide also uses the `button`, `checkbox`, `dropdown-menu`, `input` and `select` components. Add each one the same way when you reach the section that uses it.

2. Add the `@tanstack/svelte-table` dependency. This guide uses **TanStack Table v9**:

```bash
npm install @tanstack/svelte-table
```

## Prerequisites

We are going to build a table to show recent payments. Here's what our data looks like:

```ts showLineNumbers
type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com'
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com'
  }
  // ...
];
```

## Project Structure

Start by creating the following file structure:

```txt
src/routes
└── payments
    ├── columns.ts
    ├── data-table-features.ts
    ├── data-table.svelte
    ├── +page.svelte
    └── +page.ts
```

I'm using a SvelteKit example here but this works for any other Svelte setup.

- `columns.ts` will contain our column definitions.
- `data-table-features.ts` will contain the shared `features` object that tells TanStack Table which behavior to enable.
- `data-table.svelte` will contain our `<DataTable />` component.
- `+page.ts` is where we'll fetch data.
- `+page.svelte` is where we'll render our table.

## Set up Table Features

TanStack Table v9 is feature-based: you opt into the behavior you want — sorting, filtering, pagination, and so on — by declaring it with `tableFeatures()`. Anything you don't list is tree-shaken out of your bundle. That includes the built-in filter and sort functions: register the ones your columns rely on under `filterFns` and `sortFns` (our email filter uses `includesString`, and string columns sort with `text` / `alphanumeric`).

```ts showLineNumbers title="src/routes/payments/data-table-features.ts"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures
} from '@tanstack/svelte-table';

// New in v9: declare the features this table uses. Anything you don't
// register is tree-shaken out of the bundle.
export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text }
});

// Pass this as the first generic argument to `ColumnDef`, `Column`, `Table`,
// and `Row` so each type knows which feature APIs are available.
export type DataTableFeatures = typeof features;
```

<Callout class="mt-4">

**Note:** The core row model is always included, so you never register it yourself. Row models for optional features are created with `create*RowModel()` and registered on the features object — there are no more `get*RowModel` table options.

</Callout>

## Basic Table

Let's start by building a basic table.

<Steps>

### Column Definitions

First, we'll define our columns.

```ts showLineNumbers title="src/routes/payments/columns.ts" {1-2,13-14,16-26}
import { createColumnHelper } from '@tanstack/svelte-table';
import type { DataTableFeatures } from './data-table-features';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

export const columns = columnHelper.columns([
  columnHelper.accessor('status', {
    header: 'Status'
  }),
  columnHelper.accessor('email', {
    header: 'Email'
  }),
  columnHelper.accessor('amount', {
    header: 'Amount'
  })
]);
```

<Callout class="mt-4">

**Note:** Columns are where you define the core of what your table
will look like. They define the data that will be displayed, how it will be
formatted, sorted and filtered.

</Callout>

### `<DataTable />` component

Next, we'll create a `<DataTable />` component to render our table.

```svelte showLineNumbers title="src/routes/payments/data-table.svelte"
<script lang="ts" generics="TData extends RowData">
  import { createTable, FlexRender, type ColumnDef, type RowData } from '@tanstack/svelte-table';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#lib/components/ui/table';
  import { features, type DataTableFeatures } from './data-table-features';

  let { columns, data }: { columns: ColumnDef<DataTableFeatures, TData>[]; data: TData[] } = $props();

  const table = createTable({
    features,
    get columns() {
      return columns;
    },
    get data() {
      return data;
    }
  });
</script>

<div class="overflow-hidden rounded-md border">
  <Table>
    <TableHeader>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <TableRow>
          {#each headerGroup.headers as header (header.id)}
            <TableHead>
              {#if !header.isPlaceholder}
                <FlexRender {header} />
              {/if}
            </TableHead>
          {/each}
        </TableRow>
      {/each}
    </TableHeader>
    <TableBody>
      {#each table.getRowModel().rows as row (row.id)}
        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <TableCell>
              <FlexRender {cell} />
            </TableCell>
          {/each}
        </TableRow>
      {:else}
        <TableRow>
          <TableCell colspan={columns.length} class="h-24 text-center">No results.</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
```

<Callout>

**Tip**: If you find yourself using `<DataTable />` in multiple places, this is the component you could make reusable by extracting it to `src/lib/components/ui/data-table.svelte`.

`<DataTable {columns} {data} />`

</Callout>

<Callout class="mt-4">

**`<FlexRender />`:** This guide uses the adapter's `<FlexRender header={header} />` and `<FlexRender cell={cell} />` component to render whatever a column definition returns. A `header` or `cell` can be a string, or it can return `renderComponent(Component, props)` or `renderSnippet(snippet, params)` to render Svelte markup, as the next sections do.

</Callout>

### Render the table

Finally, we'll fetch the data in `+page.ts` and render our table in the page component.

```ts showLineNumbers title="src/routes/payments/+page.ts"
import type { PageLoad } from './$types';
import type { Payment } from './columns';

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    }
    // ...
  ];
}

export const load: PageLoad = async () => {
  return { payments: await getData() };
};
```

```svelte showLineNumbers title="src/routes/payments/+page.svelte" {10}
<script lang="ts">
  import type { PageProps } from './$types';
  import { columns } from './columns';
  import DataTable from './data-table.svelte';

  let { data }: PageProps = $props();
</script>

<div class="container mx-auto py-10">
  <DataTable {columns} data={data.payments} />
</div>
```

</Steps>

## Cell Formatting

Let's format the amount cell to display the dollar amount. We'll also align the cell to the right.

<Steps>

### Create the amount component

A cell that shows row data returns a component with `renderComponent`, so it follows the row when `data` changes. Create `data-table-amount.svelte` next to `columns.ts`. It takes the `amount` as a prop and formats it:

```svelte showLineNumbers title="src/routes/payments/data-table-amount.svelte"
<script lang="ts">
  let { amount }: { amount: number } = $props();

  const formatted = $derived(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount));
</script>

<div class="text-right font-medium">{formatted}</div>
```

### Update columns definition

Update the `header` and `cell` definitions for amount as follows. The header never changes, so a snippet made with `createRawSnippet` and `renderSnippet` renders it. The `cell` returns the `<DataTableAmount />` component.

```ts showLineNumbers title="src/routes/payments/columns.ts" {1-3,5-7,11-12}
import { createColumnHelper, renderComponent, renderSnippet } from '@tanstack/svelte-table';
import { createRawSnippet } from 'svelte';
import DataTableAmount from './data-table-amount.svelte';

const amountHeader = createRawSnippet(() => ({
  render: () => `<div class="text-right">Amount</div>`
}));

export const columns = columnHelper.columns([
  columnHelper.accessor('amount', {
    header: () => renderSnippet(amountHeader),
    cell: ({ row }) => renderComponent(DataTableAmount, { amount: row.original.amount })
  })
]);
```

You can use the same approach to format other cells and headers.

<Callout class="mt-4">

**Note:** A `createRawSnippet` reads its arguments once, so it keeps showing its first value when `data` changes. Use it for markup that stays the same, like the header above. For anything that shows row data, return `renderComponent(Component, props)` as this section and the next ones do.

</Callout>

</Steps>

## Row Actions

Let's add row actions to our table. We'll use a `<DropdownMenu />` component for this.

<Steps>

### Create the actions component

A cell can return a component with `renderComponent`. Create `data-table-actions.svelte` next to `columns.ts`. It takes the payment `id` as a prop and renders a `<DropdownMenu />`:

```svelte showLineNumbers title="src/routes/payments/data-table-actions.svelte"
<script lang="ts">
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import { Button } from '#lib/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from '#lib/components/ui/dropdown-menu';

  let { id }: { id: string } = $props();
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, children)}
      <Button {...props} variant="ghost" class={[props.class, 'h-8 w-8 p-0']}>{@render children?.()}</Button>
    {/snippet}
    <span class="sr-only">Open menu</span>
    <EllipsisIcon class="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onclick={() => navigator.clipboard.writeText(id)}>Copy payment ID</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>View customer</DropdownMenuItem>
    <DropdownMenuItem>View payment details</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Update columns definition

Update our columns definition to add a new `actions` column. The `actions` cell returns the `<DataTableActions />` component.

```ts showLineNumbers title="src/routes/payments/columns.ts" {1-2,6-9}
import { createColumnHelper, renderComponent } from '@tanstack/svelte-table';
import DataTableActions from './data-table-actions.svelte';

export const columns = columnHelper.columns([
  // ...
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
  })
  // ...
]);
```

You can access the row data using `row.original` in the `cell` function. Use this to handle actions for your row eg. use the `id` to make a DELETE call to your API.

</Steps>

## Pagination

Next, we'll add pagination to our table.

<Steps>

### Pagination is already enabled

Because our features object includes `rowPaginationFeature` and `createPaginatedRowModel()`, the table automatically paginates rows into pages of 10 — there's nothing to add to `createTable`. See the [pagination docs](https://tanstack.com/table/latest/docs/framework/svelte/guide/pagination) for more information on customizing page size and implementing manual pagination.

### Add pagination controls

We can add pagination controls to our table using the `<Button />` component and the `table.previousPage()`, `table.nextPage()` API methods.

```svelte showLineNumbers title="src/routes/payments/data-table.svelte" {2,12-15}
<script lang="ts" generics="TData extends RowData">
  import { Button } from '#lib/components/ui/button';
  // ...
</script>

<div>
  <div class="overflow-hidden rounded-md border">
    <Table>
      <!-- ... -->
    </Table>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <Button variant="outline" size="sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
    <Button variant="outline" size="sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
  </div>
</div>
```

See [Reusable Components](#reusable-components) section for a more advanced pagination component.

</Steps>

## Sorting

Let's make the email column sortable.

The `rowSortingFeature` and sorted row model are already registered in our features object, so all that's left is the header. The Svelte adapter keeps the sorting state inside the table, so there is no state to wire up.

<Steps>

### Make header cell sortable

We can now update the `email` header cell to add sorting controls. Create `data-table-email-button.svelte` next to `columns.ts`:

```svelte showLineNumbers title="src/routes/payments/data-table-email-button.svelte"
<script lang="ts">
  import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
  import { Button } from '#lib/components/ui/button';

  let { onclick }: { onclick: () => void } = $props();
</script>

<Button variant="ghost" {onclick}>
  Email
  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
</Button>
```

Then return it from the `email` header:

```ts showLineNumbers title="src/routes/payments/columns.ts" {1-2,5-10}
import { createColumnHelper, renderComponent } from '@tanstack/svelte-table';
import DataTableEmailButton from './data-table-email-button.svelte';

export const columns = columnHelper.columns([
  columnHelper.accessor('email', {
    header: ({ column }) =>
      renderComponent(DataTableEmailButton, {
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
  })
]);
```

This will automatically sort the table (asc and desc) when the user toggles on the header cell.

</Steps>

## Filtering

Let's add a search input to filter emails in our table.

The `columnFilteringFeature` and filtered row model are already part of our features object, so we only need to render an input. The filter state lives in the table too.

<Steps>

### Update `<DataTable>`

```svelte showLineNumbers title="src/routes/payments/data-table.svelte" {2,7-14}
<script lang="ts" generics="TData extends RowData">
  import { Input } from '#lib/components/ui/input';
  // ...
</script>

<div>
  <div class="flex items-center py-4">
    <Input
      placeholder="Filter emails..."
      value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
      oninput={(event) => table.getColumn('email')?.setFilterValue(event.currentTarget.value)}
      class="max-w-sm"
    />
  </div>
  <div class="overflow-hidden rounded-md border">
    <Table>
      <!-- ... -->
    </Table>
  </div>
</div>
```

Filtering is now enabled for the `email` column. You can add filters to other columns as well. See the [filtering docs](https://tanstack.com/table/latest/docs/framework/svelte/guide/column-filtering) for more information on customizing filters.

</Steps>

## Visibility

Adding column visibility is fairly simple using `@tanstack/svelte-table` visibility API.

<Steps>

### Update `<DataTable>`

```svelte showLineNumbers title="src/routes/payments/data-table.svelte" {3-8,21-39}
<script lang="ts" generics="TData extends RowData">
  import { Button } from '#lib/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
  } from '#lib/components/ui/dropdown-menu';
  import { Input } from '#lib/components/ui/input';
  // ...
</script>

<div>
  <div class="flex items-center py-4">
    <Input
      placeholder="Filter emails..."
      value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
      oninput={(event) => table.getColumn('email')?.setFilterValue(event.currentTarget.value)}
      class="max-w-sm"
    />
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet render(props, _state, children)}
          <Button {...props} variant="outline" class={[props.class, 'ml-auto']}>{@render children?.()}</Button>
        {/snippet}
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {#each table.getAllColumns().filter((column) => column.getCanHide()) as column (column.id)}
          <DropdownMenuCheckboxItem
            class="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        {/each}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <div class="overflow-hidden rounded-md border">
    <Table>
      <!-- ... -->
    </Table>
  </div>
</div>
```

This adds a dropdown menu that you can use to toggle column visibility.

</Steps>

## Row Selection

Next, we're going to add row selection to our table.

<Steps>

### Update column definitions

Create `data-table-checkbox.svelte` next to `columns.ts`:

```svelte showLineNumbers title="src/routes/payments/data-table-checkbox.svelte"
<script lang="ts">
  import { Checkbox } from '#lib/components/ui/checkbox';

  let {
    checked,
    indeterminate = false,
    onCheckedChange,
    'aria-label': ariaLabel
  }: {
    checked: boolean;
    indeterminate?: boolean;
    onCheckedChange: (value: boolean) => void;
    'aria-label': string;
  } = $props();
</script>

<Checkbox bind:checked={() => checked, onCheckedChange} {indeterminate} aria-label={ariaLabel} />
```

Then add a `select` column:

```ts showLineNumbers title="src/routes/payments/columns.ts" {1-2,5-22}
import { createColumnHelper, renderComponent } from '@tanstack/svelte-table';
import DataTableCheckbox from './data-table-checkbox.svelte';

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(value),
        'aria-label': 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  })
]);
```

This adds a checkbox to each row and a checkbox in the header to select all rows. The table keeps the selection itself, and `data-state="selected"` on each `<TableRow>` marks the selected rows.

### Show selected rows

You can show the number of selected rows using the `table.getFilteredSelectedRowModel()` API.

```svelte
<div class="flex-1 text-sm text-muted-foreground">
  {table.getFilteredSelectedRowModel().rows.length} of
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

</Steps>

## Reusable Components

Here are some components you can use to build your data tables. This is from the [Tasks](https://ui.shadcn.com/examples/tasks) demo, which shares its features object (and the matching `DataTableFeatures` type) across every component via a `data-table-features.ts` module — the same pattern we set up in [Set up Table Features](#set-up-table-features). Put each component next to `data-table-features.ts`.

### Column header

Make any column header sortable and hideable.

```svelte showLineNumbers title="src/routes/payments/data-table-column-header.svelte"
<script lang="ts">
  import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import EyeOffIcon from '@lucide/svelte/icons/eye-off';
  import type { Column, RowData } from '@tanstack/svelte-table';
  import { cn } from 'cn';
  import { Button } from '#lib/components/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '#lib/components/ui/dropdown-menu';
  import type { DataTableFeatures } from './data-table-features';

  // `renderComponent` cannot infer a component's generics, so the header asks only for the methods it calls.
  let {
    column,
    title,
    class: className
  }: {
    column: Pick<Column<DataTableFeatures, RowData, unknown>, 'getCanSort' | 'getIsSorted' | 'toggleSorting' | 'toggleVisibility'>;
    title: string;
    class?: string;
  } = $props();
</script>

{#if !column.getCanSort()}
  <div class={className}>{title}</div>
{:else}
  <div class={cn('flex items-center gap-2', className)}>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet render(props, _state, children)}
          <Button {...props} variant="ghost" size="sm" class={[props.class, '-ml-3 h-8 data-popup-open:bg-accent']}>{@render children?.()}</Button>
        {/snippet}
        <span>{title}</span>
        {#if column.getIsSorted() === 'desc'}
          <ArrowDownIcon />
        {:else if column.getIsSorted() === 'asc'}
          <ArrowUpIcon />
        {:else}
          <ChevronsUpDownIcon />
        {/if}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onclick={() => column.toggleSorting(false)}>
          <ArrowUpIcon />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onclick={() => column.toggleSorting(true)}>
          <ArrowDownIcon />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onclick={() => column.toggleVisibility(false)}>
          <EyeOffIcon />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
{/if}
```

```ts showLineNumbers {1-2,6}
import { renderComponent } from '@tanstack/svelte-table';
import DataTableColumnHeader from './data-table-column-header.svelte';

export const columns = columnHelper.columns([
  columnHelper.accessor('email', {
    header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Email' })
  })
]);
```

### Pagination

Add pagination controls to your table including page size and selection count.

```svelte showLineNumbers title="src/routes/payments/data-table-pagination.svelte"
<script lang="ts" generics="TData extends RowData">
  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
  import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
  import type { RowData, SvelteTable } from '@tanstack/svelte-table';
  import { Button } from '#lib/components/ui/button';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#lib/components/ui/select';
  import type { DataTableFeatures } from './data-table-features';

  let { table }: { table: SvelteTable<DataTableFeatures, TData> } = $props();

  const pagination = $derived(table.atoms.pagination.get());
</script>

<div class="flex items-center justify-between px-2">
  <div class="flex-1 text-sm text-muted-foreground">
    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
  </div>
  <div class="flex items-center space-x-6 lg:space-x-8">
    <div class="flex items-center space-x-2">
      <p class="text-sm font-medium">Rows per page</p>
      <Select value={`${pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
        <SelectTrigger class="h-8 w-[70px]">
          <SelectValue placeholder={`${pagination.pageSize}`} />
        </SelectTrigger>
        <SelectContent side="top">
          {#each [10, 20, 25, 30, 40, 50] as pageSize (pageSize)}
            <SelectItem value={`${pageSize}`}>{pageSize}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </div>
    <div class="flex w-[100px] items-center justify-center text-sm font-medium">
      Page {pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
    <div class="flex items-center space-x-2">
      <Button variant="outline" size="icon" class="hidden size-8 lg:flex" onclick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
        <span class="sr-only">Go to first page</span>
        <ChevronsLeftIcon />
      </Button>
      <Button variant="outline" size="icon" class="size-8" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        <span class="sr-only">Go to previous page</span>
        <ChevronLeftIcon />
      </Button>
      <Button variant="outline" size="icon" class="size-8" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        <span class="sr-only">Go to next page</span>
        <ChevronRightIcon />
      </Button>
      <Button variant="outline" size="icon" class="hidden size-8 lg:flex" onclick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
        <span class="sr-only">Go to last page</span>
        <ChevronsRightIcon />
      </Button>
    </div>
  </div>
</div>
```

```svelte
<DataTablePagination {table} />
```

### Column toggle

A component to toggle column visibility.

```svelte showLineNumbers title="src/routes/payments/data-table-view-options.svelte"
<script lang="ts" generics="TData extends RowData">
  import Settings2Icon from '@lucide/svelte/icons/settings-2';
  import type { RowData, SvelteTable } from '@tanstack/svelte-table';
  import { Button } from '#lib/components/ui/button';
  import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '#lib/components/ui/dropdown-menu';
  import type { DataTableFeatures } from './data-table-features';

  let { table }: { table: SvelteTable<DataTableFeatures, TData> } = $props();
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, children)}
      <Button {...props} variant="outline" size="sm" class={[props.class, 'ml-auto hidden h-8 lg:flex']}>{@render children?.()}</Button>
    {/snippet}
    <Settings2Icon />
    View
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" class="w-[150px]">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    {#each table.getAllColumns().filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()) as column (column.id)}
      <DropdownMenuCheckboxItem class="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(value)}>
        {column.id}
      </DropdownMenuCheckboxItem>
    {/each}
  </DropdownMenuContent>
</DropdownMenu>
```

```svelte
<DataTableViewOptions {table} />
```

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the table in a [DirectionProvider](/docs/components/direction) and set `dir` on its container and on each `DropdownMenuContent`. Use the buttons to switch the language.

<ComponentPreview name="base/DataTableRtlExample" align="start" class="[&_[data-slot=preview]]:h-auto [&_[data-slot=preview]]:max-h-none [&_[data-slot=preview]]:min-h-0 [&_[data-slot=preview]]:px-4 md:[&_[data-slot=preview]]:px-8" hideCode />
