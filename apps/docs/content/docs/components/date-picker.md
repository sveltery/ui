---
title: Date Picker
description: A date picker component with range and presets.
---

<ComponentPreview name="base/DatePickerExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add popover calendar
```

</InstallTab>

<InstallTab value="manual">

The Date Picker is built from the [Popover](/docs/components/popover#installation) and [Calendar](/docs/components/calendar#installation) components. Install both.

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { format } from 'date-fns';
  import { buttonVariants } from '#lib/components/ui/button';
  import { Calendar } from '#lib/components/ui/calendar';
  import { Popover, PopoverContent, PopoverTrigger } from '#lib/components/ui/popover';

  let date = $state<Date | undefined>();
</script>

<Popover>
  <PopoverTrigger data-empty={!date} class={buttonVariants({ variant: 'outline', class: 'w-[212px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground' })}>
    {date ? format(date, 'PPP') : 'Pick a date'}
  </PopoverTrigger>
  <PopoverContent class="w-auto p-0">
    <Calendar mode="single" bind:selected={date} />
  </PopoverContent>
</Popover>
```

## Composition

There is no `DatePicker` root component. A date picker is a `Popover` with a `Calendar` inside:

```text
Popover
├── PopoverTrigger
└── PopoverContent
    └── Calendar
```

To close the popover once a day is picked, bind its `open` and set it to `false` in the calendar's `onSelect`:

```svelte
<Popover bind:open>
  …
  <Calendar mode="single" bind:selected={date} onSelect={() => (open = false)} />
</Popover>
```

## Range Picker

Use `mode="range"` and two months. The trigger shows `from` and `to`.

## With Presets

Put buttons under the calendar that set `selected` and `month`. `fixedWeeks` keeps the popover the same height in every month.

## Date of Birth

`captionLayout="dropdown"` adds month and year dropdowns, so a date far in the past is a few clicks away.

## Time Picker

A native time input sits next to the date picker. Combine the two values when you submit.

## In a Form

A popover trigger is a button, so it submits nothing. Put a hidden input with the date as `yyyy-MM-dd` next to it. Check the date in the form's `onsubmit`. Set `data-invalid` on the `Field` and `aria-invalid` on the trigger, and render a `FieldError` while the date is missing.

```svelte
<form onsubmit={save}>
  <Field data-invalid={invalid}>
    <FieldLabel for="booking-date">Booking date</FieldLabel>
    <Popover bind:open>
      <PopoverTrigger id="booking-date" aria-invalid={invalid}>…</PopoverTrigger>
      …
    </Popover>
    <input type="hidden" name="booking" value={date ? format(date, 'yyyy-MM-dd') : ''} />
    {#if invalid}
      <FieldError>Pick a booking date.</FieldError>
    {/if}
  </Field>
  <Button type="submit">Book</Button>
</form>
```

## Native date input

The date picker needs JavaScript to open its calendar. For a form that must work without it, use [Input](/docs/components/input#input-types) with `type="date"`, or a remote form field's `as('date')`. Sveltery UI has no separate date component.
