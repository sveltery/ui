<script lang="ts">
  import type { TraceTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: TraceTitleProps = $props();
</script>
<span data-slot="trace-title" {...props} class={cn('cn-trace-title min-w-0 truncate motion-reduce:shimmer-none', classProp)}>
  {@render children?.()}
</span>
