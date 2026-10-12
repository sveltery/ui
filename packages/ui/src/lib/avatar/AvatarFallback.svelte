<script lang="ts">
  import { Avatar as AvatarPrimitive } from '@sveltery/base/avatar';
  import { cn } from 'cn';
  import type { AvatarFallbackProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarFallbackProps = $props();
  const className = $derived(cn(
    "cn-avatar-fallback flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
    classProp
  ));
</script>
<AvatarPrimitive.Fallback data-slot="avatar-fallback" class={className} {...props} {children} />
