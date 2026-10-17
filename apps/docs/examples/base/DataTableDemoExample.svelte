<script lang="ts">
  import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFn_includesString,
    FlexRender,
    renderSnippet,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
    type Column,
    type HeaderContext,
    type Row
  } from '@tanstack/svelte-table';
  import { Button } from '$registry/bases/base/ui/button';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
  import { Input } from '$registry/bases/base/ui/input';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';

  // New in v9: declare the features this table uses. Anything you don't
  // register is tree-shaken out of the bundle.
  const features = tableFeatures({
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

  type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
  };

  const columnHelper = createColumnHelper<typeof features, Payment>();

  const data: Payment[] = [
    {
      id: 'm5gr84i9',
      amount: 316,
      status: 'success',
      email: 'ken99@example.com'
    },
    {
      id: '3u1reuv4',
      amount: 242,
      status: 'success',
      email: 'Abe45@example.com'
    },
    {
      id: 'derv1ws0',
      amount: 837,
      status: 'processing',
      email: 'Monserrat44@example.com'
    },
    {
      id: '5kma53ae',
      amount: 874,
      status: 'success',
      email: 'Silas22@example.com'
    },
    {
      id: 'bhqecj4p',
      amount: 721,
      status: 'failed',
      email: 'carmella@example.com'
    }
  ];

  const columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: (context) => renderSnippet(selectHead, context),
      cell: ({ row }) => renderSnippet(selectCell, row),
      enableSorting: false,
      enableHiding: false
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.getValue('status'))
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => renderSnippet(emailHead, column),
      cell: ({ row }) => renderSnippet(emailCell, row.getValue('email'))
    }),
    columnHelper.accessor('amount', {
      header: () => renderSnippet(amountHead),
      cell: ({ row }) => renderSnippet(amountCell, parseFloat(row.getValue('amount')))
    }),
    columnHelper.display({
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => renderSnippet(actionsCell, row.original)
    })
  ]);

  const table = createTable({
    features,
    columns,
    data
  });
</script>

{#snippet selectHead({ table }: HeaderContext<typeof features, Payment, unknown>)}
  <Checkbox
    bind:checked={() => table.getIsAllPageRowsSelected(), (value) => table.toggleAllPageRowsSelected(value)}
    indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
    aria-label="Select all"
  />
{/snippet}

{#snippet selectCell(row: Row<typeof features, Payment>)}
  <Checkbox bind:checked={() => row.getIsSelected(), (value) => row.toggleSelected(value)} aria-label="Select row" />
{/snippet}

{#snippet statusCell(status: string)}
  <div class="capitalize">{status}</div>
{/snippet}

{#snippet emailHead(column: Column<typeof features, Payment, string>)}
  <Button variant="ghost" onclick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    Email
    <ArrowUpDownIcon />
  </Button>
{/snippet}

{#snippet emailCell(email: string)}
  <div class="lowercase">{email}</div>
{/snippet}

{#snippet amountHead()}
  <div class="text-right">Amount</div>
{/snippet}

{#snippet amountCell(amount: number)}
  {const formatted = $derived(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount))}
  <div class="text-right font-medium">{formatted}</div>
{/snippet}

{#snippet actionsCell(payment: Payment)}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet render(props, _state, children)}
        <Button {...props} variant="ghost" size="icon-xs">{@render children?.()}</Button>
      {/snippet}
      <span class="sr-only">Open menu</span>
      <EllipsisIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onclick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
{/snippet}

<div class="w-full">
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
        Columns <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-44">
        <DropdownMenuGroup>
          {#each table.getAllColumns().filter((column) => column.getCanHide()) as column (column.id)}
            <DropdownMenuCheckboxItem class="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(value)}>
              {column.id}
            </DropdownMenuCheckboxItem>
          {/each}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
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
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div class="space-x-2">
      <Button variant="outline" size="sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
      <Button variant="outline" size="sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
    </div>
  </div>
</div>
