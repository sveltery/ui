<script lang="ts">
  import { MessageScrollerRoot } from '@sveltery/base/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerProps } from './types.js';
  let { class: classProp, children, ...props }: MessageScrollerProps = $props();
</script>
<MessageScrollerRoot data-slot="message-scroller" {...props} class={cn('cn-message-scroller group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden', classProp)}>
  {@render children?.()}
</MessageScrollerRoot>
