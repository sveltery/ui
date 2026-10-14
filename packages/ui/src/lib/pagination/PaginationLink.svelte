<script lang="ts">
  import type { PaginationLinkProps } from './types.js';
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  let { children, class: classProp, isActive, size = 'icon', ...props }: PaginationLinkProps = $props();
</script>
<Button variant={isActive ? 'outline' : 'ghost'} {size} class={cn('cn-pagination-link', classProp)} nativeButton={false}>
  {#snippet render(buttonProps)}
    <a {...buttonProps} aria-current={isActive ? 'page' : undefined} data-slot="pagination-link" data-active={isActive} {...props}>
      {@render children?.()}
    </a>
  {/snippet}
</Button>
