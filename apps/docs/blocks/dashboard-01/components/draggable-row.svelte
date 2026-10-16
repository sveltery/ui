<script lang="ts" module>
  import { createContext } from 'svelte';
  import { createSortable } from '@dnd-kit/svelte/sortable';

  export const [getSortable, setSortable] = createContext<ReturnType<typeof createSortable>>();
</script>

<script lang="ts">
  import { FlexRender, type Row } from '@tanstack/svelte-table';
  import { TableCell, TableRow } from '$registry/bases/base/ui/table';
  import type { Section, features } from './data-table.svelte';

  let { row }: { row: Row<typeof features, Section> } = $props();
  const sortable = createSortable({
    get id() {
      return row.original.id;
    },
    get index() {
      return row.index;
    },
  });
  setSortable(sortable);
</script>

<TableRow
  {@attach sortable.attach}
  data-state={row.getIsSelected() ? 'selected' : undefined}
  data-dragging={sortable.isDragging}
  class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
>
  {#each row.getVisibleCells() as cell (cell.id)}
    <TableCell>
      <FlexRender {cell} />
    </TableCell>
  {/each}
</TableRow>
