<script lang="ts">
  // Pinned shadcn Avatar composition; primitive behavior remains in Base.
  import { Avatar as AvatarPrimitive } from '@sveltery/base/avatar';
  import { cn, type ClassValue } from 'cn';
  import type { AvatarImageProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarImageProps = $props();
  const className = $derived(cn(
    "cn-avatar-image aspect-square size-full object-cover",
    classProp as ClassValue
  ));
</script>
<AvatarPrimitive.Image data-slot="avatar-image" class={className} {...props} {children} />
