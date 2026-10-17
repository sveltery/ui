<script lang="ts">
  import { createColumnHelper, createTable, FlexRender, renderComponent } from '@tanstack/svelte-table';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';
  import DataTableActions from './data-table/data-table-actions.svelte';
  import DataTableCheckbox from './data-table/data-table-checkbox.svelte';
  import DataTableColumnHeader from './data-table/data-table-column-header.svelte';
  import { features, type DataTableFeatures } from './data-table/data-table-features';
  import DataTablePagination from './data-table/data-table-pagination.svelte';
  import DataTableViewOptions from './data-table/data-table-view-options.svelte';

  type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
  };

  const statuses = ['pending', 'processing', 'success', 'failed'] as const;
  const data: Payment[] = Array.from({ length: 25 }, (_, index) => ({
    id: `payment-${index + 1}`,
    amount: (index + 1) * 10,
    status: statuses[index % statuses.length],
    email: `user${index + 1}@example.com`
  }));

  const columnHelper = createColumnHelper<DataTableFeatures, Payment>();
  const columns = columnHelper.columns([
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
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Status' }),
      cell: ({ row }) => row.original.status
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Email' })
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Amount' })
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
    })
  ]);

  const table = createTable({ features, columns, data });
</script>

<div class="w-full space-y-4">
  <div class="flex items-center">
    <DataTableViewOptions {table} />
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
          <TableRow>
            {#each row.getVisibleCells() as cell (cell.id)}
              <TableCell>
                <FlexRender {cell} />
              </TableCell>
            {/each}
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
  <DataTablePagination {table} />
</div>
