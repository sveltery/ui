<script lang="ts">

  import { cn } from 'cn';
  import type { AvatarGroupProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarGroupProps = $props();
  const className = $derived(cn(
    "cn-avatar-group group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
    classProp
  ));
</script>
<div data-slot="avatar-group" class={className} {...props}>
  {@render children?.()}
</div>
