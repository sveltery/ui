<script lang="ts">
  // Pinned shadcn Avatar composition; primitive behavior remains in Base.

  import { cn, type ClassValue } from 'cn';
  import type { AvatarGroupProps } from './types.js';
  let { children, class: classProp, ref = $bindable(), ...props }: AvatarGroupProps = $props();
  const className = $derived(cn(
    "cn-avatar-group group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
    classProp as ClassValue
  ));
</script>
<div data-slot="avatar-group" class={className} {...props} bind:this={ref}>
  {@render children?.()}
</div>
