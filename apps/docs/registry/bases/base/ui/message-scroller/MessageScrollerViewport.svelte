<script lang="ts">
  import { Viewport } from '@sveltery/svelte/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerViewportProps } from './types.js';
  let { class: classProp, children, ...props }: MessageScrollerViewportProps = $props();
</script>
<Viewport data-slot="message-scroller-viewport" {...props} class={cn('cn-message-scroller-viewport size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent data-pending-scroll:invisible', classProp)}>
  {@render children?.()}
</Viewport>
