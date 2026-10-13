<script lang="ts">
  import { CardFooter } from '@sveltery/ui/card';
  import { useMessageScroller } from '@sveltery/ui/message-scroller';

  const scroller = useMessageScroller();
  const status = $derived.by(() => {
    const { start, end } = scroller.scrollable;
    if (start && end) return 'You can scroll both ways.';
    if (end) return 'You are at the top. You can only scroll down.';
    if (start) return 'You are at the bottom. You can only scroll up.';
    return 'All messages fit in the viewport.';
  });
</script>

<CardFooter class="justify-center border-t text-center text-sm text-muted-foreground">{status}</CardFooter>
