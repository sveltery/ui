<script lang="ts">
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Card, CardContent } from '$registry/bases/base/ui/card';

  let date = $state<Date | undefined>(new Date(new Date().getFullYear(), 0, 12));
</script>

<Card class="mx-auto w-fit p-0">
  <CardContent class="p-0">
    <Calendar mode="single" defaultMonth={date} bind:selected={date} showWeekNumber />
  </CardContent>
</Card>
