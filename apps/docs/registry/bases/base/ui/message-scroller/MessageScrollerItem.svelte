<script lang="ts">
  import { MessageScrollerItem } from '@sveltery/base/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerItemProps } from './types.js';
  let { class: classProp, scrollAnchor = false, children, ...props }: MessageScrollerItemProps = $props();
</script>
<MessageScrollerItem data-slot="message-scroller-item" {scrollAnchor} {...props} class={cn('cn-message-scroller-item min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]', classProp)}>
  {@render children?.()}
</MessageScrollerItem>
