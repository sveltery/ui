<script lang="ts">
  import { untrack } from 'svelte';
  import { useMessageScroller, type MessageScroller } from '@sveltery/svelte/message-scroller';

  let { capture, restore, onscrollable }: { capture: (scroller: MessageScroller) => void; restore?: string; onscrollable: () => void } = $props();
  const scroller = useMessageScroller();
  untrack(() => capture(scroller));
  $effect(() => {
    void scroller.scrollable;
    onscrollable();
  });
  $effect(() => {
    if (restore) scroller.scrollToMessage(restore);
  });
</script>
