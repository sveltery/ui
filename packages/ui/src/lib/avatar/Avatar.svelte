<script lang="ts">
  import { Avatar as AvatarPrimitive } from '@sveltery/base/avatar';
  import { cn } from 'cn';
  import type { AvatarProps } from './types.js';
  let { children, class: classProp, size = 'default', ...props }: AvatarProps = $props();
  const className = $derived(cn(
    "cn-avatar group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
    classProp
  ));
</script>
<AvatarPrimitive.Root data-slot="avatar" data-size={size} class={className} {...props} {children} />
