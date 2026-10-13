<script lang="ts">
  import { useMessageScroller } from '@sveltery/ui/message-scroller';

  const scroller = useMessageScroller();
  const states = $derived([
    { label: 'At top', on: !scroller.scrollable.start },
    { label: 'At bottom', on: !scroller.scrollable.end },
    { label: 'Older above', on: scroller.scrollable.start },
    { label: 'Newer below', on: scroller.scrollable.end },
  ]);
</script>

<div class="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap gap-1.5">
  {#each states as state (state.label)}
    <span
      data-on={state.on}
      class="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground data-[on=true]:border-transparent data-[on=true]:bg-primary data-[on=true]:text-primary-foreground"
    >
      {state.label}
    </span>
  {/each}
</div>
