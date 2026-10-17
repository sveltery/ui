<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '$registry/bases/base/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
</script>

<Tooltip>
  <TooltipTrigger>
    {#snippet render(props: HTMLAttributes<HTMLElement>, _state: unknown, content?: Snippet)}<span {...props} class="inline-block w-fit">{@render content?.()}</span>{/snippet}
    <Button variant="outline" disabled>Disabled</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This feature is currently unavailable</p>
  </TooltipContent>
</Tooltip>
