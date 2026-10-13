<script lang="ts">
  import { useMessageScroller } from './scroller.svelte.js';
  import type { MessageScrollerContentProps } from './types.js';

  let { spacerClass, role = 'log', 'aria-relevant': ariaRelevant = 'additions', children, ...rest }: MessageScrollerContentProps = $props();
  const scroller = useMessageScroller();
</script>

<div {...rest} {role} aria-relevant={ariaRelevant} {@attach scroller.content}>
  {@render children?.()}
  <div aria-hidden="true" data-message-scroller-spacer="" hidden class={spacerClass} {@attach scroller.spacer}></div>
</div>
