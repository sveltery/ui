<script lang="ts">
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import { addDays, format } from 'date-fns';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar, type DateRange } from '$registry/bases/base/ui/calendar';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  let date = $state<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });
</script>

<Field class="mx-auto w-60">
  <FieldLabel for="date-picker-range">Date Picker Range</FieldLabel>
  <Popover>
    <PopoverTrigger id="date-picker-range">
      {#snippet render(props, _state, content)}
        <Button variant="outline" class="justify-start px-2.5 font-normal" {...props}>{@render content?.()}</Button>
      {/snippet}
      <CalendarIcon data-icon="inline-start" />
      {#if date?.from}
        {#if date.to}
          {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
        {:else}
          {format(date.from, 'LLL dd, y')}
        {/if}
      {:else}
        <span>Pick a date</span>
      {/if}
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar mode="range" defaultMonth={date?.from} bind:selected={date} numberOfMonths={2} />
    </PopoverContent>
  </Popover>
</Field>
