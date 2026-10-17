<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';

  const sides = ['left', 'top', 'bottom', 'right'] as const;
</script>

<div class="flex flex-wrap gap-2">
  {#each sides as side (side)}
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-fit capitalize" {...props}>{@render content?.()}</Button>{/snippet}
        {side}
      </TooltipTrigger>
      <TooltipContent {side}>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  {/each}
</div>
