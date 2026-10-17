<script lang="ts">
  import InfoIcon from '@lucide/svelte/icons/info';
  import { Bubble, BubbleContent, BubbleReactions } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$registry/bases/base/ui/popover';
</script>

<div class="flex w-full max-w-sm flex-col gap-4 py-12">
  <Bubble align="end">
    <BubbleContent>Run the build script.</BubbleContent>
  </Bubble>
  <Bubble variant="destructive">
    <BubbleContent>Failed to run the command.</BubbleContent>
    <BubbleReactions>
      <Popover>
        <PopoverTrigger>
          {#snippet render(props, _state, content)}
            <Button variant="ghost" size="icon-xs" aria-label="Show error details" class="aria-expanded:text-destructive" {...props}>
              {@render content?.()}
            </Button>
          {/snippet}
          <InfoIcon />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle class="text-sm">Command failed with exit code 1</PopoverTitle>
            <PopoverDescription class="text-sm">ENOENT: no such file or directory, open pnpm-lock.yaml</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </BubbleReactions>
  </Bubble>
</div>
