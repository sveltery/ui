<script lang="ts">
  import type { TraceLineProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, status, ...props }: TraceLineProps = $props();
</script>
<span
  data-slot="trace-line"
  data-status={status}
  {...props}
  class={cn(
    'cn-trace-line flex w-fit max-w-full min-w-0 items-center text-muted-foreground transition-colors in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-foreground data-[status=error]:text-destructive data-[status=error]:in-[a:hover,button:hover]:text-destructive data-[status=pending]:opacity-60 data-[status=running]:*:data-[slot=trace-title]:shimmer',
    classProp,
  )}
>
  {@render children?.()}
</span>
