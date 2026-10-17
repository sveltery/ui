<script lang="ts">
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Card, CardContent } from '$registry/bases/base/ui/card';

  let date = $state<Date | undefined>(new Date(new Date().getFullYear(), 0, 6));
  const bookedDates = Array.from({ length: 15 }, (_, i) => new Date(new Date().getFullYear(), 0, 12 + i));
</script>

<Card class="mx-auto w-fit p-0">
  <CardContent class="p-0">
    <Calendar
      mode="single"
      defaultMonth={date}
      bind:selected={date}
      disabled={bookedDates}
      modifiers={{ booked: bookedDates }}
      modifiersClassNames={{ booked: '[&>button]:line-through opacity-100' }}
    />
  </CardContent>
</Card>
