<script lang="ts">
  import type { PaginationLinkProps } from './types.js';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  let { children, class: classProp, isActive, size = 'icon', ...props }: PaginationLinkProps = $props();
</script>
<a
  aria-current={isActive ? 'page' : undefined}
  data-slot="pagination-link"
  data-active={isActive}
  {...props}
  class={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), 'cn-pagination-link', classProp)}
>
  {@render children?.()}
</a>
