<script lang="ts">
  import type { MessageFooterProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MessageFooterProps = $props();
</script>
<div data-slot="message-footer" {...props} class={cn('cn-message-footer flex max-w-full min-w-0 items-center group-data-[align=end]/message:justify-end', classProp)}>
  {@render children?.()}
</div>
