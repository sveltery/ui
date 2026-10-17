<script lang="ts">
  import SaveIcon from '@lucide/svelte/icons/save';
  import { Button } from '$registry/bases/base/ui/button';
  import { Kbd } from '$registry/bases/base/ui/kbd';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
</script>

<Tooltip>
  <TooltipTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" size="icon-sm" {...props}>{@render content?.()}</Button>{/snippet}
    <SaveIcon />
  </TooltipTrigger>
  <TooltipContent>
    Save Changes <Kbd>S</Kbd>
  </TooltipContent>
</Tooltip>
