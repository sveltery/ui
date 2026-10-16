<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Button } from '@sveltery/components/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/components/dialog';
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sveltery/components/hover-card';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;
  const gap = 'flex flex-col style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-luma:gap-2';
</script>

<ExampleWrapper>
  <Example title="Sides" containerClass="col-span-2">
    <div class="flex flex-wrap items-center justify-center gap-2">
      {#each sides as side (side)}
        <HoverCard>
          <HoverCardTrigger delay={100} closeDelay={100}>
            {#snippet render(props, _state, content)}<Button variant="outline" class="capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side.replace('-', ' ')}
          </HoverCardTrigger>
          <HoverCardContent {side}>
            <div class={gap}>
              <h4 class="font-medium">Hover Card</h4>
              <p>This hover card appears on the {side.replace('-', ' ')} side of the trigger.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      {/each}
    </div>
  </Example>
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hover Card Example</DialogTitle>
          <DialogDescription>Hover over the button below to see the hover card.</DialogDescription>
        </DialogHeader>
        <HoverCard>
          <HoverCardTrigger delay={100} closeDelay={100}>
            {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
            Hover me
          </HoverCardTrigger>
          <HoverCardContent>
            <div class={gap}>
              <h4 class="font-medium">Hover Card</h4>
              <p>This hover card appears inside a dialog. Hover over the button to see it.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </DialogContent>
    </Dialog>
  </Example>
</ExampleWrapper>
