<script lang="ts">
  import type { PaginationEllipsisProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, ...props }: PaginationEllipsisProps = $props();
</script>
<span aria-hidden="true" data-slot="pagination-ellipsis" {...props} class={cn('cn-pagination-ellipsis flex items-center justify-center', classProp)}>
  <IconPlaceholder
    lucide="MoreHorizontalIcon"
    tabler="IconDots"
    hugeicons="MoreHorizontalCircle01Icon"
    phosphor="DotsThreeIcon"
    remixicon="RiMoreLine"
  />
  <span class="sr-only">More pages</span>
</span>
