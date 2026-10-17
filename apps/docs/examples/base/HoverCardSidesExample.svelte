<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '$registry/bases/base/ui/hover-card';

  const HOVER_CARD_SIDES = ['left', 'top', 'bottom', 'right'] as const;
</script>

<div class="flex flex-wrap justify-center gap-2">
  {#each HOVER_CARD_SIDES as side (side)}
    <HoverCard>
      <HoverCardTrigger delay={100} closeDelay={100}>
        {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
        {side}
      </HoverCardTrigger>
      <HoverCardContent {side}>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the {side} side of the trigger.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  {/each}
</div>
