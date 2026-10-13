<script lang="ts">
  import { useMessageScroller } from '@sveltery/message-scroller';
  const scroller = useMessageScroller();
</script>
<output data-testid="visibility" data-current-anchor={scroller.visibility.currentAnchorId ?? ''}>{scroller.visibility.visibleMessageIds.join(',')}</output>
