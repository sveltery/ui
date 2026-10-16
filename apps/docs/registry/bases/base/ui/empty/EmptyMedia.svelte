<script lang="ts">
  import type { EmptyMediaProps } from './types.js';
  import { cn } from 'cn';
  import { emptyMediaVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', ...props }: EmptyMediaProps = $props();
</script>
<div data-slot="empty-icon" data-variant={variant} {...props} class={cn(emptyMediaVariants({ variant, class: classProp }))}>
  {@render children?.()}
</div>
