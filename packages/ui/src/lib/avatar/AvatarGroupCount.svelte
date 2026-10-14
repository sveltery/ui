<script lang="ts">
  import { cn } from 'cn';
  import type { AvatarGroupCountProps } from './types.js';
  let { children, class: classProp, ...props }: AvatarGroupCountProps = $props();
</script>
<div data-slot="avatar-group-count" class={cn('cn-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-background', '', classProp)} {...props}>
  {@render children?.()}
</div>
