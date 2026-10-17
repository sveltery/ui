<script lang="ts" generics="TData extends RowData">
  import { createTable, FlexRender, type ColumnDef, type RowData } from '@tanstack/svelte-table';
  import { Button } from '$registry/bases/base/ui/button';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
  import { Input } from '$registry/bases/base/ui/input';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$registry/bases/base/ui/table';
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
      {table.getFilteredSelectedRowModel().rows.length} of
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <Button variant="outline" size="sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
    <Button variant="outline" size="sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
  </div>
</div>
