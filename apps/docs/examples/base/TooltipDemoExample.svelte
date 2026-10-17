<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
</script>

<Tooltip>
  <TooltipTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Hover
  </TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
