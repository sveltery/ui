<script lang="ts">
  import type { PaginationContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: PaginationContentProps = $props();
</script>
<ul data-slot="pagination-content" {...props} class={cn('cn-pagination-content flex items-center', classProp)}>
  {@render children?.()}
</ul>
