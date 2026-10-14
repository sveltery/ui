<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@sveltery/ui/popover';

  const topSides = ['inline-start', 'left', 'top'] as const;
  const bottomSides = ['bottom', 'right', 'inline-end'] as const;
</script>

{#snippet PopoverBasic()}
  <Example title="Basic">
    <Popover>
      <PopoverTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
        Open Popover
      </PopoverTrigger>
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
              <PopoverTrigger>
                {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit capitalize" {...props}>{@render content?.()}</Button>{/snippet}
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
      <PopoverTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open Popover
      </PopoverTrigger>
      <PopoverContent class="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <FieldGroup class="gap-4">
          <Field orientation="horizontal">
            <FieldLabel for="width" class="w-1/2">Width</FieldLabel>
            <Input id="width" defaultValue="100%" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel for="height" class="w-1/2">Height</FieldLabel>
            <Input id="height" defaultValue="25px" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  </Example>
{/snippet}

{#snippet PopoverAlignments()}
  <Example title="Alignments">
    <div class="flex gap-6">
      <Popover>
        <PopoverTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" size="sm" {...props}>{@render content?.()}</Button>{/snippet}
          Start
        </PopoverTrigger>
        <PopoverContent align="start" class="w-40">Aligned to start</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" size="sm" {...props}>{@render content?.()}</Button>{/snippet}
          Center
        </PopoverTrigger>
        <PopoverContent align="center" class="w-40">Aligned to center</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" size="sm" {...props}>{@render content?.()}</Button>{/snippet}
          End
        </PopoverTrigger>
        <PopoverContent align="end" class="w-40">Aligned to end</PopoverContent>
      </Popover>
    </div>
  </Example>
{/snippet}

{#snippet PopoverInDialog()}
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Popover Example</DialogTitle>
          <DialogDescription>Click the button below to see the popover.</DialogDescription>
        </DialogHeader>
        <Popover>
          <PopoverTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
            Open Popover
          </PopoverTrigger>
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
