<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { buttonVariants } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Label } from '@sveltery/ui/label';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@sveltery/ui/popover';

  const topSides = ['inline-start', 'left', 'top'] as const;
  const bottomSides = ['bottom', 'right', 'inline-end'] as const;
  const inputClass = 'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';
</script>

{#snippet PopoverBasic()}
  <Example title="Basic">
    <Popover>
      <PopoverTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open Popover</PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  </Example>
{/snippet}

{#snippet PopoverSides()}
  <Example title="Sides">
    <div class="flex flex-col gap-2">
      {#each [topSides, bottomSides] as sides (sides[0])}
        <div class="flex flex-wrap gap-2">
          {#each sides as side (side)}
            <Popover>
              <PopoverTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit capitalize' })}>
                {side.replace('-', ' ')}
              </PopoverTrigger>
              <PopoverContent {side} class="w-40">
                <p>Popover on {side.replace('-', ' ')}</p>
              </PopoverContent>
            </Popover>
          {/each}
        </div>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet PopoverWithForm()}
  <Example title="With Form">
    <Popover>
      <PopoverTrigger class={buttonVariants({ variant: 'outline' })}>Open Popover</PopoverTrigger>
      <PopoverContent class="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <Label for="width" class="w-1/2">Width</Label>
            <input id="width" class={inputClass} value="100%" />
          </div>
          <div class="flex items-center gap-2">
            <Label for="height" class="w-1/2">Height</Label>
            <input id="height" class={inputClass} value="25px" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </Example>
{/snippet}

{#snippet PopoverAlignments()}
  <Example title="Alignments">
    <div class="flex gap-6">
      <Popover>
        <PopoverTrigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Start</PopoverTrigger>
        <PopoverContent align="start" class="w-40">Aligned to start</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>Center</PopoverTrigger>
        <PopoverContent align="center" class="w-40">Aligned to center</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>End</PopoverTrigger>
        <PopoverContent align="end" class="w-40">Aligned to end</PopoverContent>
      </Popover>
    </div>
  </Example>
{/snippet}

{#snippet PopoverInDialog()}
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Popover Example</DialogTitle>
          <DialogDescription>Click the button below to see the popover.</DialogDescription>
        </DialogHeader>
        <Popover>
          <PopoverTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open Popover</PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>Popover in Dialog</PopoverTitle>
              <PopoverDescription>
                This popover appears inside a dialog. Click the button to open it.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render PopoverBasic()}
  {@render PopoverSides()}
  {@render PopoverWithForm()}
  {@render PopoverAlignments()}
  {@render PopoverInDialog()}
</ExampleWrapper>
