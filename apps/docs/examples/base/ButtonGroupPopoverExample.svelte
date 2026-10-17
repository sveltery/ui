<script lang="ts">
  import BotIcon from '@lucide/svelte/icons/bot';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { Field, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '$registry/bases/base/ui/popover';
  import { Textarea } from '$registry/bases/base/ui/textarea';
</script>

<ButtonGroup>
  <Button variant="outline">
    <BotIcon /> Copilot
  </Button>
  <Popover>
    <PopoverTrigger>
      {#snippet render(props, _state, content)}
        <Button variant="outline" size="icon" aria-label="Open Popover" {...props}>{@render content?.()}</Button>
      {/snippet}
      <ChevronDownIcon />
    </PopoverTrigger>
    <PopoverContent align="end" class="rounded-xl text-sm">
      <PopoverHeader>
        <PopoverTitle>Start a new task with Copilot</PopoverTitle>
        <PopoverDescription>Describe your task in natural language.</PopoverDescription>
      </PopoverHeader>
      <Field>
        <FieldLabel for="task" class="sr-only">Task Description</FieldLabel>
        <Textarea id="task" placeholder="I need to..." class="resize-none" />
        <FieldDescription>Copilot will open a pull request for review.</FieldDescription>
      </Field>
    </PopoverContent>
  </Popover>
</ButtonGroup>
