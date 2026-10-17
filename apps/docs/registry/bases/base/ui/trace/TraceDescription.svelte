<script lang="ts">
  import type { TraceDescriptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: TraceDescriptionProps = $props();
</script>
<span data-slot="trace-description" {...props} class={cn('cn-trace-description shrink-0 text-muted-foreground/70 tabular-nums', classProp)}>
  {@render children?.()}
</span>
