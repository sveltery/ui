<script lang="ts">
  import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$registry/bases/base/ui/tooltip';

  let voiceEnabled = $state(false);
</script>

<ButtonGroup class="[--radius:9999rem]">
  <ButtonGroup>
    <Button variant="outline" size="icon">
      <PlusIcon />
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <InputGroup>
      <InputGroupInput placeholder={voiceEnabled ? 'Record and send audio...' : 'Send a message...'} disabled={voiceEnabled} />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger onclick={() => (voiceEnabled = !voiceEnabled)}>
            {#snippet render(props, _state, content)}
              <InputGroupButton
                size="icon-xs"
                data-active={voiceEnabled}
                class="data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 dark:data-[active=true]:bg-orange-800 dark:data-[active=true]:text-orange-100"
                aria-pressed={voiceEnabled}
                {...props}
              >
                {@render content?.()}
              </InputGroupButton>
            {/snippet}
            <AudioLinesIcon />
          </TooltipTrigger>
          <TooltipContent>Voice Mode</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  </ButtonGroup>
</ButtonGroup>
