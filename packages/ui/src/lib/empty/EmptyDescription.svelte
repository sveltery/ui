<script lang="ts">
  // Preserve the pinned div host despite its React paragraph-props annotation.
  import type { EmptyDescriptionProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: EmptyDescriptionProps = $props();
</script>
<div data-slot="empty-description" {...props} class={classes('cn-empty-description text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
