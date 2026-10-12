<script lang="ts">
  import type { MarkerContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MarkerContentProps = $props();
</script>
<span data-slot="marker-content" {...props} class={cn('cn-marker-content min-w-0 wrap-break-word', classProp)}>
  {@render children?.()}
</span>
