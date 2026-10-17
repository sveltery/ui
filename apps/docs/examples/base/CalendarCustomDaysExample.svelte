<script lang="ts">
  import { addDays } from 'date-fns';
  import { Calendar, CalendarDayButton, type DateRange } from '$registry/bases/base/ui/calendar';
  import { Card, CardContent } from '$registry/bases/base/ui/card';

  let range = $state<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10)
  });
</script>

<Card class="mx-auto w-fit p-0">
  <CardContent class="p-0">
    <Calendar
      mode="range"
      defaultMonth={range?.from}
      bind:selected={range}
      numberOfMonths={1}
      captionLayout="dropdown"
      class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
      formatters={{
        formatMonthDropdown: (date) => {
          return date.toLocaleString('default', { month: 'long' });
        }
      }}
    >
      {#snippet dayButton({ day, modifiers, props, text })}
        {const isWeekend = $derived(day.date.getDay() === 0 || day.date.getDay() === 6)}
        <CalendarDayButton {day} {modifiers} {...props}>
          {text}
          {#if !modifiers.outside}
            <span>{isWeekend ? '$120' : '$100'}</span>
          {/if}
        </CalendarDayButton>
      {/snippet}
    </Calendar>
  </CardContent>
</Card>
