<script lang="ts">
  import { addDays } from 'date-fns';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar } from '$registry/bases/base/ui/calendar';
  import { Card, CardContent, CardFooter } from '$registry/bases/base/ui/card';

  let date = $state<Date | undefined>(new Date(new Date().getFullYear(), 1, 12));
  let currentMonth = $state<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const presets = [
    { label: 'Today', value: 0 },
    { label: 'Tomorrow', value: 1 },
    { label: 'In 3 days', value: 3 },
    { label: 'In a week', value: 7 },
    { label: 'In 2 weeks', value: 14 }
  ];
</script>

<Card class="mx-auto w-fit max-w-[300px]" size="sm">
  <CardContent>
    <Calendar mode="single" bind:selected={date} bind:month={currentMonth} fixedWeeks class="p-0 [--cell-size:--spacing(9.5)]" />
  </CardContent>
  <CardFooter class="flex flex-wrap gap-2 border-t">
    {#each presets as preset (preset.value)}
      <Button
        variant="outline"
        size="sm"
        class="flex-1"
        onclick={() => {
          const newDate = addDays(new Date(), preset.value);
          date = newDate;
          currentMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        }}
      >
        {preset.label}
      </Button>
    {/each}
  </CardFooter>
</Card>
