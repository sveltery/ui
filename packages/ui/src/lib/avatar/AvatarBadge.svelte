<script lang="ts">
  // Pinned shadcn Avatar composition; primitive behavior remains in Base.

  import { cn, type ClassValue } from 'cn';
  import type { AvatarBadgeProps } from './types.js';
  let { children, class: classProp, ref = $bindable(), ...props }: AvatarBadgeProps = $props();
  const className = $derived(cn(
    "cn-avatar-badge absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
    "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
    "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
    "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
    classProp as ClassValue
  ));
</script>
<span data-slot="avatar-badge" class={className} {...props} bind:this={ref}>
  {@render children?.()}
</span>
