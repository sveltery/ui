<script lang="ts">
  import { MessageScrollerContent } from '@sveltery/base/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerContentProps } from './types.js';
  let { class: classProp, children, ...props }: MessageScrollerContentProps = $props();
</script>
<MessageScrollerContent data-slot="message-scroller-content" {...props} class={cn('cn-message-scroller-content flex h-max min-h-full flex-col', classProp)}>
  {@render children?.()}
</MessageScrollerContent>
