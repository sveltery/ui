<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check';
  import { Bubble, BubbleContent, BubbleReactions } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
</script>

<div class="flex w-full max-w-sm flex-col gap-4 py-12">
  <Bubble variant="secondary">
    <BubbleContent>Did you remove the stale route?</BubbleContent>
  </Bubble>
  <Bubble align="end">
    <BubbleContent>Yes, removed it from the registry.</BubbleContent>
    <BubbleReactions>
      <Tooltip>
        <TooltipTrigger>
          {#snippet render(props, _state, content)}
            <Button variant="ghost" size="icon-xs" {...props}>{@render content?.()}</Button>
          {/snippet}
          <CheckIcon />
        </TooltipTrigger>
        <TooltipContent>Read on Jan 5, 2026 at 4:32 PM</TooltipContent>
      </Tooltip>
    </BubbleReactions>
  </Bubble>
</div>
