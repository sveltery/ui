<script lang="ts">
  import type { MessageAvatarProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MessageAvatarProps = $props();
</script>
<div data-slot="message-avatar" {...props} class={cn('cn-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted', classProp)}>
  {@render children?.()}
</div>
