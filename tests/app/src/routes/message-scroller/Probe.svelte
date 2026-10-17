<script lang="ts">
  import { useMessageScroller } from '@sveltery/svelte/message-scroller';

  let { jumpTo, visibility }: { jumpTo?: string; visibility: boolean } = $props();
  const scroller = useMessageScroller();
</script>

{#if jumpTo}
  <button type="button" onclick={() => scroller.scrollToMessage(jumpTo, { align: 'start', behavior: 'auto' })}>Jump to message</button>
{/if}
{#if visibility}
  <output data-testid="visibility" data-current-anchor={scroller.visibility.currentAnchorId ?? ''} data-visible={scroller.visibility.visibleMessageIds.join(',')}></output>
{/if}
