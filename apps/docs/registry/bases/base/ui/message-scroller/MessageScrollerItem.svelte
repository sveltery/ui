<script lang="ts">
  import { Item } from '@sveltery/svelte/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerItemProps } from './types.js';
  let { class: classProp, scrollAnchor = false, children, ...props }: MessageScrollerItemProps = $props();
</script>
<Item data-slot="message-scroller-item" {scrollAnchor} {...props} class={cn('cn-message-scroller-item min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]', classProp)}>
  {@render children?.()}
</Item>
