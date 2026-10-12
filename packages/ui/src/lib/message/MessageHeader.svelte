<script lang="ts">
  import type { MessageHeaderProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MessageHeaderProps = $props();
</script>
<div data-slot="message-header" {...props} class={cn('cn-message-header flex max-w-full min-w-0 items-center', classProp)}>
  {@render children?.()}
</div>
