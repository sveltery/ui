<script lang="ts">
  import { MessageScrollerViewport } from '@sveltery/base/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerViewportProps } from './types.js';
  let { class: classProp, children, ...props }: MessageScrollerViewportProps = $props();
</script>
<MessageScrollerViewport data-slot="message-scroller-viewport" {...props} class={cn('cn-message-scroller-viewport size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent data-pending-scroll:invisible', classProp)}>
  {@render children?.()}
</MessageScrollerViewport>
