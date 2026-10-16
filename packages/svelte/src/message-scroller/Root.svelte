<script lang="ts">
  import { useMessageScroller } from './scroller.svelte.js';
  import type { MessageScrollerRootProps } from './types.js';

  let { children, ...rest }: MessageScrollerRootProps = $props();
  const scroller = useMessageScroller();
</script>

<div {...rest} {...scroller.stateAttributes}>
  {@render children?.()}
</div>
