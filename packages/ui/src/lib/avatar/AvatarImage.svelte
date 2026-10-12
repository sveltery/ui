<script lang="ts">
  import { Avatar as AvatarPrimitive } from '@sveltery/base/avatar';
  import { cn } from 'cn';
  import type { AvatarImageProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarImageProps = $props();
  const className = $derived(cn(
    "cn-avatar-image aspect-square size-full object-cover",
    classProp
  ));
</script>
<AvatarPrimitive.Image data-slot="avatar-image" class={className} {...props} {children} />
