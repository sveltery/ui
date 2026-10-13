<script lang="ts">
  import { useMessageScroller } from './scroller.svelte.js';
  import type { MessageScrollerItemProps } from './types.js';

  let { messageId, scrollAnchor = false, children, ...rest }: MessageScrollerItemProps = $props();
  const scroller = useMessageScroller();
</script>

<div data-message-id={messageId} data-scroll-anchor={scrollAnchor ? 'true' : 'false'} {...rest} {@attach scroller.item(messageId)}>
  {@render children?.()}
</div>
