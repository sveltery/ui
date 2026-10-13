<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { buttonVariants } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sveltery/ui/hover-card';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;
  const gap = 'flex flex-col style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-luma:gap-2';
</script>

<!-- The trigger is a link by default. These examples hover a button, as upstream does. -->
{#snippet button(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <button type="button" {...props as HTMLButtonAttributes}>{@render children?.()}</button>
{/snippet}

<ExampleWrapper>
  <Example title="Sides" containerClass="col-span-2">
    <div class="flex flex-wrap items-center justify-center gap-2">
      {#each sides as side (side)}
        <HoverCard>
          <HoverCardTrigger delay={100} closeDelay={100} render={button} class={buttonVariants({ variant: 'outline', class: 'capitalize' })}>
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
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hover Card Example</DialogTitle>
          <DialogDescription>Hover over the button below to see the hover card.</DialogDescription>
        </DialogHeader>
        <HoverCard>
          <HoverCardTrigger delay={100} closeDelay={100} render={button} class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Hover me</HoverCardTrigger>
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
