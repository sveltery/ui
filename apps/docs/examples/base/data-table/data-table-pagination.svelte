<script lang="ts" generics="TData extends RowData">
  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
  import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
  import type { RowData, SvelteTable } from '@tanstack/svelte-table';
  import { Button } from '$registry/bases/base/ui/button';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';
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
      <Select bind:value={() => `${pagination.pageSize}`, (value) => table.setPageSize(Number(value))}>
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
