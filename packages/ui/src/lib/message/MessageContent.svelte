<script lang="ts">
  import type { MessageContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MessageContentProps = $props();
</script>
<div data-slot="message-content" {...props} class={cn('cn-message-content flex w-full min-w-0 flex-col wrap-break-word', classProp)}>
  {@render children?.()}
</div>
