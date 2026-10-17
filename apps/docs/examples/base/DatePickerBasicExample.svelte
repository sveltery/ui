<script lang="ts">
  import { format } from 'date-fns';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  let date = $state<Date | undefined>();
</script>

<Field class="mx-auto w-44">
  <FieldLabel for="date-picker-simple">Date</FieldLabel>
  <Popover>
    <PopoverTrigger id="date-picker-simple">
      {#snippet render(props, _state, content)}
        <Button variant="outline" class="justify-start font-normal" {...props}>{@render content?.()}</Button>
      {/snippet}
      {#if date}{format(date, 'PPP')}{:else}<span>Pick a date</span>{/if}
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar mode="single" bind:selected={date} defaultMonth={date} />
    </PopoverContent>
  </Popover>
</Field>
