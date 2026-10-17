<script lang="ts" generics="TData extends RowData">
  import Settings2Icon from '@lucide/svelte/icons/settings-2';
  import type { RowData, SvelteTable } from '@tanstack/svelte-table';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
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
