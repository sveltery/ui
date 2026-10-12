<script lang="ts">

  import { cn } from 'cn';
  import type { AvatarBadgeProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarBadgeProps = $props();
  const className = $derived(cn(
    "cn-avatar-badge absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
    "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
    "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
    "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
    classProp
  ));
</script>
<span data-slot="avatar-badge" class={className} {...props}>
  {@render children?.()}
</span>
