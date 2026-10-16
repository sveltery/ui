<script lang="ts">
  import type { MarkerIconProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MarkerIconProps = $props();
</script>
<span data-slot="marker-icon" aria-hidden="true" {...props} class={cn('cn-marker-icon shrink-0', classProp)}>
  {@render children?.()}
</span>
