<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { getSortable } from './draggable-row.svelte';

  const sortable = getSortable();
</script>

<Button {@attach sortable.attachHandle} variant="ghost" size="icon" class="size-7 text-muted-foreground hover:bg-transparent">
  <IconPlaceholder lucide="GripVerticalIcon" tabler="IconGripVertical" hugeicons="DragDropVerticalIcon" phosphor="DotsSixVerticalIcon" remixicon="RiDraggable" class="size-3 text-muted-foreground" />
  <span class="sr-only">Drag to reorder</span>
</Button>
