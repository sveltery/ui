<script lang="ts">
  import type { BubbleProps } from './types.js';
  import { cn } from 'cn';
  import { bubbleVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', align = 'start', ...props }: BubbleProps = $props();
</script>
<div data-slot="bubble" data-variant={variant} data-align={align} {...props} class={cn(bubbleVariants({ variant }), classProp)}>
  {@render children?.()}
</div>
