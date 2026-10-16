<script lang="ts">
  import type { EmptyProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: EmptyProps = $props();
</script>
<div data-slot="empty" {...props} class={cn('cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance', classProp)}>
  {@render children?.()}
</div>
