<script lang="ts">
  import type { PaginationItemProps } from './types.js';
  let { children, ...props }: PaginationItemProps = $props();
</script>
<li data-slot="pagination-item" {...props}>
  {@render children?.()}
</li>
