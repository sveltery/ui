<script lang="ts">
  import type { PaginationProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: PaginationProps = $props();
</script>
<!-- svelte-ignore a11y_no_redundant_roles -->
<nav role="navigation" aria-label="pagination" data-slot="pagination" {...props} class={cn('cn-pagination mx-auto flex w-full justify-center', classProp)}>
  {@render children?.()}
</nav>
