<script lang="ts">
  import { Avatar as AvatarPrimitive } from '@sveltery/base/avatar';
  import { cn } from 'cn';
  import type { AvatarImageProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarImageProps = $props();
</script>
<AvatarPrimitive.Image data-slot="avatar-image" class={cn('cn-avatar-image aspect-square size-full object-cover', classProp)} {...props} {children} />
