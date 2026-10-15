<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Kbd } from '@sveltery/ui/kbd';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@sveltery/ui/tooltip';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;
</script>

{#snippet span(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <span {...props} class="inline-block w-fit">{@render children?.()}</span>
{/snippet}

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <a {...props} href="#" class="w-fit text-sm text-primary underline-offset-4 hover:underline" onclick={event => event.preventDefault()}>{@render children?.()}</a>
{/snippet}

<ExampleWrapper>
  <Example title="Basic">
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
        Show Tooltip
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </Example>
  <Example title="Sides">
    <div class="flex flex-wrap gap-2">
      {#each sides as side (side)}
        <Tooltip>
          <TooltipTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit capitalize" {...props}>{@render content?.()}</Button>{/snippet}
            {side.replace('-', ' ')}
          </TooltipTrigger>
          <TooltipContent {side}>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      {/each}
    </div>
  </Example>
  <Example title="With Icon">
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="ghost" size="icon" {...props}>{@render content?.()}</Button>{/snippet}
        <IconPlaceholder lucide="InfoIcon" tabler="IconInfoCircle" hugeicons="AlertCircleIcon" phosphor="InfoIcon" remixicon="RiInformationLine" />
        <span class="sr-only">Info</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Additional information</p>
      </TooltipContent>
    </Tooltip>
  </Example>
  <Example title="Long Content">
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
        Show Tooltip
      </TooltipTrigger>
      <TooltipContent>To learn more about how this works, check out the docs. If you have any questions, please reach out to us.</TooltipContent>
    </Tooltip>
  </Example>
  <Example title="Disabled">
    <Tooltip>
      <TooltipTrigger render={span}>
        <Button variant="outline" disabled>Disabled</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This feature is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  </Example>
  <Example title="With Keyboard Shortcut">
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" size="icon-sm" {...props}>{@render content?.()}</Button>{/snippet}
        <IconPlaceholder lucide="SaveIcon" tabler="IconDeviceFloppy" hugeicons="FloppyDiskIcon" phosphor="FloppyDiskIcon" remixicon="RiSaveLine" />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  </Example>
  <Example title="On Link">
    <Tooltip>
      <TooltipTrigger render={link}>Learn more</TooltipTrigger>
      <TooltipContent>
        <p>Click to read the documentation</p>
      </TooltipContent>
    </Tooltip>
  </Example>
  <Example title="Formatted Content">
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit" {...props}>{@render content?.()}</Button>{/snippet}
        Status
      </TooltipTrigger>
      <TooltipContent>
        <div class="flex flex-col gap-1">
          <p class="font-semibold">Active</p>
          <p class="text-xs opacity-80">Last updated 2 hours ago</p>
        </div>
      </TooltipContent>
    </Tooltip>
  </Example>
</ExampleWrapper>
