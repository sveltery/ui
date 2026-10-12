<script lang="ts">
  import type { ItemMediaProps } from './types.js';
  import { cn } from 'cn';
  import { itemMediaVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', ...props }: ItemMediaProps = $props();
</script>
<div data-slot="item-media" data-variant={variant} {...props} class={cn(itemMediaVariants({ variant }), classProp)}>
  {@render children?.()}
</div>
