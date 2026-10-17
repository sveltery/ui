<script lang="ts">
  import { addDays } from 'date-fns';
  import { Calendar, type DateRange } from '$registry/bases/base/ui/calendar';

  let dateRange = $state<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30)
  });
</script>

<Calendar mode="range" defaultMonth={dateRange?.from} bind:selected={dateRange} numberOfMonths={2} class="rounded-lg border" />
