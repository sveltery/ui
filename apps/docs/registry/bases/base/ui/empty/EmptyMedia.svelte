<script lang="ts">
  // Native pinned shadcn Empty/Nova contract; see tests/reference/empty-sources.json.
  import { cva } from 'class-variance-authority';
  import type { EmptyMediaProps } from './types.js';
  import { classes } from '../shared/classes.js';
  const emptyMediaVariants = cva('cn-empty-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0', {
    variants: { variant: { default: 'cn-empty-media-default', icon: 'cn-empty-media-icon' } },
    defaultVariants: { variant: 'default' },
  });
  let { children, class: classProp, ref = $bindable(), variant = 'default', ...props }: EmptyMediaProps = $props();
</script>
<div data-slot="empty-icon" data-variant={variant} {...props} class={classes(emptyMediaVariants({ variant }), classProp)} bind:this={ref}>
  {@render children?.()}
</div>
