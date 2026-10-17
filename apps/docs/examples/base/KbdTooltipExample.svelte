<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { Kbd, KbdGroup } from '$registry/bases/base/ui/kbd';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
</script>

<div class="flex flex-wrap gap-4">
  <ButtonGroup>
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Save
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Print
      </TooltipTrigger>
      <TooltipContent>
        Print Document
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  </ButtonGroup>
</div>
