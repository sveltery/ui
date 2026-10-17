<script lang="ts">
  import type { TraceProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: TraceProps = $props();
</script>
<div
  data-slot="trace"
  {...props}
  class={cn(
    'cn-trace flex w-full min-w-0 flex-col *:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:outline-none',
    classProp,
  )}
>
  {@render children?.()}
</div>
