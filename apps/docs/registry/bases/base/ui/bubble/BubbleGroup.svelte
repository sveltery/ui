<script lang="ts">
  import type { BubbleGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: BubbleGroupProps = $props();
</script>
<div data-slot="bubble-group" {...props} class={cn('cn-bubble-group flex min-w-0 flex-col', classProp)}>
  {@render children?.()}
</div>
