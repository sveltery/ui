<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { format } from 'date-fns';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  let open = $state(false);
  let date = $state<Date | undefined>();
</script>

<FieldGroup class="mx-auto max-w-xs flex-row">
  <Field>
    <FieldLabel for="date-picker-optional">Date</FieldLabel>
    <Popover bind:open>
      <PopoverTrigger id="date-picker-optional">
        {#snippet render(props, _state, content)}
          <Button variant="outline" class="w-32 justify-between font-normal" {...props}>{@render content?.()}</Button>
        {/snippet}
        {date ? format(date, 'PPP') : 'Select date'}
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent class="w-auto overflow-hidden p-0" align="start">
        <Calendar mode="single" bind:selected={date} captionLayout="dropdown" defaultMonth={date} onSelect={() => (open = false)} />
      </PopoverContent>
    </Popover>
  </Field>
  <Field class="w-32">
    <FieldLabel for="time-picker-optional">Time</FieldLabel>
    <Input
      type="time"
      id="time-picker-optional"
      step="1"
      value="10:30:00"
      class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  </Field>
</FieldGroup>
