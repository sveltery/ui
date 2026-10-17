<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '$registry/bases/base/ui/hover-card';
</script>

<HoverCard>
  <HoverCardTrigger delay={10} closeDelay={100}>
    {#snippet render(props, _state, content)}<Button variant="link" {...props}>{@render content?.()}</Button>{/snippet}
    Hover Here
  </HoverCardTrigger>
  <HoverCardContent class="flex w-64 flex-col gap-0.5">
    <div class="font-semibold">@nextjs</div>
    <div>The React Framework – created and maintained by @vercel.</div>
    <div class="mt-1 text-xs text-muted-foreground">Joined December 2021</div>
  </HoverCardContent>
</HoverCard>
