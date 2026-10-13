<script lang="ts">
  import { MessageScroller, setMessageScroller } from './scroller.svelte.js';
  import { DEFAULT_SCROLL_EDGE_THRESHOLD, DEFAULT_SCROLL_MARGIN, DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK, type MessageScrollerProviderProps } from './types.js';

  let {
    autoScroll = false,
    defaultScrollPosition = 'end',
    scrollEdgeThreshold = DEFAULT_SCROLL_EDGE_THRESHOLD,
    scrollPreviousItemPeek = DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
    scrollMargin = DEFAULT_SCROLL_MARGIN,
    children
  }: MessageScrollerProviderProps = $props();

  const scroller = setMessageScroller(new MessageScroller({
    get autoScroll() { return autoScroll; },
    get defaultScrollPosition() { return defaultScrollPosition; },
    get scrollEdgeThreshold() { return scrollEdgeThreshold; },
    get scrollPreviousItemPeek() { return scrollPreviousItemPeek; },
    get scrollMargin() { return scrollMargin; }
  }));

  $effect(() => scroller.openAt(defaultScrollPosition));
  $effect(() => scroller.autoScrollChanged(autoScroll));
</script>

{@render children?.()}
