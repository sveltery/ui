<script lang="ts">
  import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';
</script>

<ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="icon">
      <PlusIcon />
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <InputGroup>
      <InputGroupInput placeholder="Send a message..." />
      <Tooltip>
        <TooltipTrigger>
          {#snippet render(props, _state, content)}
            <InputGroupAddon align="inline-end" {...props}>{@render content?.()}</InputGroupAddon>
          {/snippet}
          <AudioLinesIcon />
        </TooltipTrigger>
        <TooltipContent>Voice Mode</TooltipContent>
      </Tooltip>
    </InputGroup>
  </ButtonGroup>
</ButtonGroup>
