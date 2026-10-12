<script lang="ts">
  import type { BubbleReactionsProps } from './types.js';
  import { cn } from 'cn';
  import { bubbleReactionsVariants } from './variants.js';
  let { children, class: classProp, side = 'bottom', align = 'end', ...props }: BubbleReactionsProps = $props();
</script>
<div data-slot="bubble-reactions" data-align={align} data-side={side} {...props} class={cn(bubbleReactionsVariants({ side, align }), classProp)}>
  {@render children?.()}
</div>
