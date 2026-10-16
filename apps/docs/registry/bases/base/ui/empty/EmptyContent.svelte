<script lang="ts">
  import type { EmptyContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: EmptyContentProps = $props();
</script>
<div data-slot="empty-content" {...props} class={cn('cn-empty-content flex w-full max-w-sm min-w-0 flex-col items-center text-balance', classProp)}>
  {@render children?.()}
</div>
