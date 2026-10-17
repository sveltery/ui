<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  let open = $state(false);
  let date = $state<Date | undefined>();
</script>

<Field class="mx-auto w-44">
  <FieldLabel for="date">Date of birth</FieldLabel>
  <Popover bind:open>
    <PopoverTrigger id="date">
      {#snippet render(props, _state, content)}
        <Button variant="outline" class="justify-start font-normal" {...props}>{@render content?.()}</Button>
      {/snippet}
      {date ? date.toLocaleDateString() : 'Select date'}
    </PopoverTrigger>
    <PopoverContent class="w-auto overflow-hidden p-0" align="start">
      <Calendar mode="single" bind:selected={date} defaultMonth={date} captionLayout="dropdown" onSelect={() => (open = false)} />
    </PopoverContent>
  </Popover>
</Field>
