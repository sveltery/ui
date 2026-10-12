<script lang="ts">
  // Pinned shadcn Avatar composition; primitive behavior remains in Base.

  import { cn, type ClassValue } from 'cn';
  import type { AvatarGroupCountProps } from './types.js';
  let { children, class: classProp, ref = $bindable(), ...props }: AvatarGroupCountProps = $props();
  const className = $derived(cn(
    "cn-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-background",
    "",
    classProp as ClassValue
  ));
</script>
<div data-slot="avatar-group-count" class={className} {...props} bind:this={ref}>
  {@render children?.()}
</div>
