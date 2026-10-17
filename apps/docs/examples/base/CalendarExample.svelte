<script lang="ts">
  import { addDays, format } from 'date-fns';
  import { es } from 'date-fns/locale';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar, CalendarDayButton, type DateRange } from '$registry/bases/base/ui/calendar';
  import { Card, CardContent, CardFooter } from '$registry/bases/base/ui/card';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  const year = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  let single = $state<Date | undefined>(new Date(year, thisMonth, 12));
  let range = $state<DateRange | undefined>({ from: new Date(year, 0, 12), to: addDays(new Date(year, 0, 12), 30) });
  let rangeMonths = $state<DateRange | undefined>({ from: new Date(year, 3, 12), to: addDays(new Date(year, 3, 12), 60) });
  let booked = $state<Date | undefined>(new Date(year, 1, 3));
  const bookedDates = Array.from({ length: 15 }, (_, i) => new Date(year, 1, 12 + i));
  let withTime = $state<Date | undefined>(new Date(year, thisMonth, 12));
  let customDays = $state<DateRange | undefined>({ from: new Date(year, 11, 8), to: addDays(new Date(year, 11, 8), 10) });
  let preset = $state<Date | undefined>(new Date(year, 1, 12));
  let presetMonth = $state(new Date(year, thisMonth, 1));
  let simple = $state<Date | undefined>();
  let pickerRange = $state<DateRange | undefined>({ from: new Date(year, 0, 20), to: addDays(new Date(year, 0, 20), 20) });
  let dropdowns = $state<Date | undefined>();
  let dropdownsOpen = $state(false);
  let weekNumbers = $state<Date | undefined>(new Date(year, 1, 3));

  const presets = [
    { label: 'Today', value: 0 },
    { label: 'Tomorrow', value: 1 },
    { label: 'In 3 days', value: 3 },
    { label: 'In a week', value: 7 },
    { label: 'In 2 weeks', value: 14 },
  ];
  const timeInputClass = 'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none';
</script>

{#snippet calendarIcon()}
  <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="CalendarIcon" phosphor="CalendarBlankIcon" remixicon="RiCalendarLine" data-icon="inline-start" />
{/snippet}

{#snippet clockIcon()}
  <IconPlaceholder lucide="Clock2Icon" tabler="IconClockHour2" hugeicons="Clock03Icon" phosphor="ClockIcon" remixicon="RiTimeLine" class="text-muted-foreground" />
{/snippet}

<ExampleWrapper>
  <Example title="Single">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar mode="single" bind:selected={single} captionLayout="dropdown" />
      </CardContent>
    </Card>
  </Example>

  <Example title="Multiple">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar mode="multiple" />
      </CardContent>
    </Card>
  </Example>

  <Example title="Week Numbers" class="justify-center">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar mode="single" defaultMonth={weekNumbers} bind:selected={weekNumbers} showWeekNumber />
      </CardContent>
    </Card>
  </Example>

  <Example title="Booked Dates">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="single"
          defaultMonth={booked}
          bind:selected={booked}
          disabled={bookedDates}
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{ booked: '[&>button]:line-through opacity-100' }}
        />
      </CardContent>
    </Card>
  </Example>

  <Example title="Range" containerClass="lg:col-span-full 2xl:col-span-full" class="p-12">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          bind:selected={range}
          numberOfMonths={2}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
        />
      </CardContent>
    </Card>
  </Example>

  <Example title="Range Multiple Months" containerClass="lg:col-span-full 2xl:col-span-full" class="p-12">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar mode="range" defaultMonth={rangeMonths?.from} bind:selected={rangeMonths} numberOfMonths={3} locale={es} fixedWeeks />
      </CardContent>
    </Card>
  </Example>

  <Example title="With Time">
    <Card size="sm" class="mx-auto w-fit">
      <CardContent>
        <Calendar mode="single" bind:selected={withTime} class="p-0" />
      </CardContent>
      <CardFooter class="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel for="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput id="time-from" type="time" step="1" defaultValue="10:30:00" class={timeInputClass} />
              <InputGroupAddon>{@render clockIcon()}</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel for="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput id="time-to" type="time" step="1" defaultValue="12:30:00" class={timeInputClass} />
              <InputGroupAddon>{@render clockIcon()}</InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  </Example>

  <Example title="With Presets">
    <Card class="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent>
        <Calendar mode="single" bind:selected={preset} bind:month={presetMonth} fixedWeeks class="p-0 [--cell-size:--spacing(9.5)]" />
      </CardContent>
      <CardFooter class="flex flex-wrap gap-2 border-t">
        {#each presets as item (item.value)}
          <Button
            variant="outline"
            size="sm"
            class="flex-1"
            onclick={() => {
              const next = addDays(new Date(), item.value);
              preset = next;
              presetMonth = new Date(next.getFullYear(), next.getMonth(), 1);
            }}
          >
            {item.label}
          </Button>
        {/each}
      </CardFooter>
    </Card>
  </Example>

  <Example title="Custom Days">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          mode="range"
          defaultMonth={customDays?.from}
          bind:selected={customDays}
          numberOfMonths={1}
          captionLayout="dropdown"
          class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{ formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'long' }) }}
        >
          {#snippet dayButton({ day, modifiers, props, text })}
            {const isWeekend = $derived(day.date.getDay() === 0 || day.date.getDay() === 6)}
            <CalendarDayButton {day} {modifiers} {...props}>
              {text}
              {#if !modifiers.outside}<span>{isWeekend ? '$120' : '$100'}</span>{/if}
            </CalendarDayButton>
          {/snippet}
        </Calendar>
      </CardContent>
    </Card>
  </Example>

  <Example title="Date Picker Simple">
    <Field class="mx-auto w-72">
      <FieldLabel for="date-picker-simple">Date</FieldLabel>
      <Popover>
        <PopoverTrigger id="date-picker-simple">
          {#snippet render(props, _state, content)}<Button variant="outline" class="justify-start px-2.5 font-normal" {...props}>{@render content?.()}</Button>{/snippet}
          {@render calendarIcon()}
          {#if simple}{format(simple, 'PPP')}{:else}<span>Pick a date</span>{/if}
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
          <Calendar mode="single" bind:selected={simple} />
        </PopoverContent>
      </Popover>
    </Field>
  </Example>

  <Example title="Date Picker with Dropdowns">
    <Field class="mx-auto w-72">
      <Popover bind:open={dropdownsOpen}>
        <FieldLabel for="date-picker-with-dropdowns-desktop">Date</FieldLabel>
        <PopoverTrigger id="date-picker-with-dropdowns-desktop">
          {#snippet render(props, _state, content)}<Button variant="outline" class="justify-start px-2.5 font-normal" {...props}>{@render content?.()}</Button>{/snippet}
          {#if dropdowns}{format(dropdowns, 'PPP')}{:else}<span>Pick a date</span>{/if}
          <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDownIcon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" data-icon="inline-start" class="ml-auto" />
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
          <Calendar mode="single" bind:selected={dropdowns} captionLayout="dropdown" />
          <div class="flex gap-2 border-t p-2">
            <Button variant="outline" size="sm" class="w-full" onclick={() => (dropdownsOpen = false)}>Done</Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  </Example>

  <Example title="Date Picker Range">
    <Field class="mx-auto w-72">
      <FieldLabel for="date-picker-range">Date Picker Range</FieldLabel>
      <Popover>
        <PopoverTrigger id="date-picker-range">
          {#snippet render(props, _state, content)}<Button variant="outline" class="justify-start px-2.5 font-normal" {...props}>{@render content?.()}</Button>{/snippet}
          {@render calendarIcon()}
          {#if pickerRange?.from}
            {#if pickerRange.to}
              {format(pickerRange.from, 'LLL dd, y')} - {format(pickerRange.to, 'LLL dd, y')}
            {:else}
              {format(pickerRange.from, 'LLL dd, y')}
            {/if}
          {:else}
            <span>Pick a date</span>
          {/if}
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
          <Calendar mode="range" defaultMonth={pickerRange?.from} bind:selected={pickerRange} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </Field>
  </Example>

  <Example title="In Card">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar mode="single" />
      </CardContent>
    </Card>
  </Example>

  <Example title="In Popover">
    <Popover>
      <PopoverTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" class="px-2.5 font-normal" {...props}>{@render content?.()}</Button>{/snippet}
        {@render calendarIcon()}
        Open Calendar
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar mode="single" />
      </PopoverContent>
    </Popover>
  </Example>
</ExampleWrapper>
