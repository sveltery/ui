<script lang="ts">
  import { addDays, format } from 'date-fns';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
  import { Calendar, type DateRange } from '$registry/bases/base/ui/calendar';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Input } from '$registry/bases/base/ui/input';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '$registry/bases/base/ui/input-group';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';

  const year = new Date().getFullYear();

  let demo = $state<Date | undefined>();
  let range = $state<DateRange | undefined>({ from: new Date(year, 0, 20), to: addDays(new Date(year, 0, 20), 20) });
  let preset = $state<Date | undefined>();
  let presetMonth = $state<Date | undefined>();
  let dob = $state<Date | undefined>();
  let dobOpen = $state(false);
  let time = $state<Date | undefined>();
  let timeOpen = $state(false);

  function formatInputDate(date: Date | undefined) {
    return date ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '';
  }
  let inputDate = $state<Date | undefined>(new Date('2025-06-01'));
  let inputMonth = $state<Date | undefined>(new Date('2025-06-01'));
  let inputValue = $state(formatInputDate(new Date('2025-06-01')));
  let inputOpen = $state(false);

  let booking = $state<Date | undefined>();
  let bookingOpen = $state(false);
  let bookingInvalid = $state(false);
  let submitted = $state<Record<string, unknown> | null>(null);

  const presets = [
    { label: 'Today', value: 0 },
    { label: 'Tomorrow', value: 1 },
    { label: 'In 3 days', value: 3 },
    { label: 'In a week', value: 7 },
    { label: 'In 2 weeks', value: 14 },
  ];
</script>

{#snippet chevronDown()}
  <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDownIcon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" data-icon="inline-end" />
{/snippet}

{#snippet calendarIcon()}
  <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="CalendarIcon" phosphor="CalendarBlankIcon" remixicon="RiCalendarLine" data-icon="inline-start" />
{/snippet}

<ExampleWrapper>
  <Example title="Date Picker">
    <Popover>
      <PopoverTrigger data-empty={!demo}>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground" {...props}>{@render content?.()}</Button>{/snippet}
        {#if demo}{format(demo, 'PPP')}{:else}<span>Pick a date</span>{/if}
        {@render chevronDown()}
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar mode="single" bind:selected={demo} defaultMonth={demo} />
      </PopoverContent>
    </Popover>
  </Example>

  <Example title="Range Picker">
    <Field class="mx-auto w-60">
      <FieldLabel for="date-picker-range">Date Picker Range</FieldLabel>
      <Popover>
        <PopoverTrigger id="date-picker-range">
          {#snippet render(props, _state, content)}<Button variant="outline" class="justify-start px-2.5 font-normal" {...props}>{@render content?.()}</Button>{/snippet}
          {@render calendarIcon()}
          {#if range?.from}
            {#if range.to}
              {format(range.from, 'LLL dd, y')} - {format(range.to, 'LLL dd, y')}
            {:else}
              {format(range.from, 'LLL dd, y')}
            {/if}
          {:else}
            <span>Pick a date</span>
          {/if}
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
          <Calendar mode="range" defaultMonth={range?.from} bind:selected={range} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </Field>
  </Example>

  <Example title="With Presets">
    <Popover>
      <PopoverTrigger data-empty={!preset}>
        {#snippet render(props, _state, content)}<Button variant="outline" class="w-[240px] justify-start px-2.5 text-left font-normal data-[empty=true]:text-muted-foreground" {...props}>{@render content?.()}</Button>{/snippet}
        {@render calendarIcon()}
        {#if preset}{format(preset, 'PPP')}{:else}<span>Pick a date</span>{/if}
      </PopoverTrigger>
      <PopoverContent class="flex w-auto flex-col gap-0 p-0" align="start">
        <Calendar mode="single" bind:selected={preset} bind:month={presetMonth} fixedWeeks />
        <div class="flex flex-wrap gap-2 border-t p-2">
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
        </div>
      </PopoverContent>
    </Popover>
  </Example>

  <Example title="Date of Birth">
    <Field class="mx-auto w-44">
      <FieldLabel for="date">Date of birth</FieldLabel>
      <Popover bind:open={dobOpen}>
        <PopoverTrigger id="date">
          {#snippet render(props, _state, content)}<Button variant="outline" class="justify-start font-normal" {...props}>{@render content?.()}</Button>{/snippet}
          {dob ? dob.toLocaleDateString() : 'Select date'}
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="single" bind:selected={dob} defaultMonth={dob} captionLayout="dropdown" onSelect={() => (dobOpen = false)} />
        </PopoverContent>
      </Popover>
    </Field>
  </Example>

  <Example title="Time Picker">
    <FieldGroup class="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel for="date-picker-optional">Date</FieldLabel>
        <Popover bind:open={timeOpen}>
          <PopoverTrigger id="date-picker-optional">
            {#snippet render(props, _state, content)}<Button variant="outline" class="w-32 justify-between font-normal" {...props}>{@render content?.()}</Button>{/snippet}
            {time ? format(time, 'PPP') : 'Select date'}
            {@render chevronDown()}
          </PopoverTrigger>
          <PopoverContent class="w-auto overflow-hidden p-0" align="start">
            <Calendar mode="single" bind:selected={time} captionLayout="dropdown" defaultMonth={time} onSelect={() => (timeOpen = false)} />
          </PopoverContent>
        </Popover>
      </Field>
      <Field class="w-32">
        <FieldLabel for="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          step="1"
          defaultValue="10:30:00"
          class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  </Example>

  <Example title="Input">
    <Field class="mx-auto w-48">
      <FieldLabel for="date-required">Subscription Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          bind:value={inputValue}
          placeholder="June 01, 2025"
          oninput={(event) => {
            const date = new Date(event.currentTarget.value);
            if (!isNaN(date.getTime())) {
              inputDate = date;
              inputMonth = date;
            }
          }}
          onkeydown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              inputOpen = true;
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover bind:open={inputOpen}>
            <PopoverTrigger id="date-picker" aria-label="Select date">
              {#snippet render(props, _state, content)}<InputGroupButton variant="ghost" size="icon-xs" {...props}>{@render content?.()}</InputGroupButton>{/snippet}
              <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="CalendarIcon" phosphor="CalendarBlankIcon" remixicon="RiCalendarLine" />
              <span class="sr-only">Select date</span>
            </PopoverTrigger>
            <PopoverContent class="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
              <Calendar
                mode="single"
                bind:selected={inputDate}
                bind:month={inputMonth}
                onSelect={(date) => {
                  inputValue = formatInputDate(date);
                  inputOpen = false;
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  </Example>

  <Example title="In a Form">
    <form
      class="mx-auto flex w-60 flex-col gap-4"
      onsubmit={(event) => {
        event.preventDefault();
        bookingInvalid = !booking;
        submitted = booking ? Object.fromEntries(new FormData(event.currentTarget)) : null;
      }}
    >
      <Field invalid={bookingInvalid}>
        <FieldLabel for="booking-date">Booking date</FieldLabel>
        <Popover bind:open={bookingOpen}>
          <PopoverTrigger id="booking-date" aria-invalid={bookingInvalid} data-empty={!booking}>
            {#snippet render(props, _state, content)}<Button variant="outline" class="justify-start px-2.5 font-normal data-[empty=true]:text-muted-foreground" {...props}>{@render content?.()}</Button>{/snippet}
            {@render calendarIcon()}
            {#if booking}{format(booking, 'PPP')}{:else}<span>Pick a date</span>{/if}
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="start">
            <Calendar
              mode="single"
              bind:selected={booking}
              defaultMonth={booking}
              disabled={{ before: new Date() }}
              onSelect={() => {
                bookingOpen = false;
                bookingInvalid = false;
              }}
            />
          </PopoverContent>
        </Popover>
        <input type="hidden" name="booking" value={booking ? format(booking, 'yyyy-MM-dd') : ''} />
        <FieldDescription>Bookings open from today.</FieldDescription>
        {#if bookingInvalid}
          <FieldError match>Pick a booking date.</FieldError>
        {/if}
      </Field>
      <Button type="submit">Book</Button>
      {#if submitted}
        <pre class="text-xs">{JSON.stringify(submitted)}</pre>
      {/if}
    </form>
  </Example>
</ExampleWrapper>
