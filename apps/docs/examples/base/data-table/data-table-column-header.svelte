<script lang="ts">
  import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import EyeOffIcon from '@lucide/svelte/icons/eye-off';
  import type { Column, RowData } from '@tanstack/svelte-table';
  import { cn } from 'cn';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
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
