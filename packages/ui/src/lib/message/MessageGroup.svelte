<script lang="ts">
  import type { MessageGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: MessageGroupProps = $props();
</script>
<div data-slot="message-group" {...props} class={cn('cn-message-group flex min-w-0 flex-col', classProp)}>
  {@render children?.()}
</div>
