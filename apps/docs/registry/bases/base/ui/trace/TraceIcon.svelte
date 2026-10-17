<script lang="ts">
  import type { TraceIconProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: TraceIconProps = $props();
</script>
<span data-slot="trace-icon" aria-hidden="true" {...props} class={cn('cn-trace-icon flex shrink-0 items-center justify-center [&_svg]:pointer-events-none', classProp)}>
  {@render children?.()}
</span>
