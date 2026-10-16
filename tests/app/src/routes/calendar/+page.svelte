<script lang="ts">
  import { format } from 'date-fns';
  import { Calendar, type DateRange } from '@sveltery/components/calendar';
  const today = new Date(2025, 5, 18);
  let single = $state<Date | undefined>(new Date(2025, 5, 18));
  let range = $state<DateRange | undefined>();
  const day = (date: Date | undefined) => (date ? format(date, 'yyyy-MM-dd') : '');
</script>
<section aria-label="Single">
  <Calendar mode="single" {today} bind:selected={single} disabled={[new Date(2025, 5, 19), { dayOfWeek: [0] }]} />
  <output data-testid="single">{day(single)}</output>
</section>
<section aria-label="Range">
  <Calendar mode="range" {today} defaultMonth={new Date(2025, 5, 1)} numberOfMonths={2} bind:selected={range} disabled={{ before: new Date(2025, 5, 5) }} />
  <output data-testid="range">{day(range?.from)} to {day(range?.to)}</output>
</section>
