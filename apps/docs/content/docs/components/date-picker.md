---
title: Date Picker
description: A date picker component with range and presets.
---

<ComponentPreview name="base/DatePickerDemoExample" />

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

See the [Calendar](/docs/components/calendar) documentation for more information.

## Composition

A date picker is built from `Popover` and `Calendar` (there is no `DatePicker` root component):

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

## Basic

A basic date picker component.

<ComponentPreview name="base/DatePickerBasicExample" />

## Range Picker

A date picker component for selecting a range of dates.

<ComponentPreview name="base/DatePickerRangeExample" />

## Date of Birth

A date picker component for selecting a date of birth. This component includes a dropdown caption layout for date and month selection.

<ComponentPreview name="base/DatePickerDobExample" />

## Input

A date picker component with an input field for selecting a date.

<ComponentPreview name="base/DatePickerInputExample" />

## Time Picker

A date picker component with a time input field for selecting a time.

<ComponentPreview name="base/DatePickerTimeExample" />

## Natural Language Picker

This component uses the `chrono-node` library to parse natural language dates.

```bash
npm install chrono-node
```

<ComponentPreview name="base/DatePickerNaturalLanguageExample" />

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the date picker in a [DirectionProvider](/docs/components/direction) and set `dir` on `PopoverTrigger`, `PopoverContent` and `Calendar`. Pass a `locale` to `Calendar` to translate the month and weekday names. Use the language selector to switch the language.

<ComponentPreview name="base/DatePickerRtlExample" direction="rtl" align="start" />

## In a Form

A popover trigger is a button, so it submits nothing. Put a hidden input with the date as `yyyy-MM-dd` next to it. Check the date in the form's `onsubmit`. Set `invalid` on the `Field` and `aria-invalid` on the trigger, and render a `FieldError` while the date is missing.

```svelte
<form onsubmit={save}>
  <Field invalid={invalid}>
    <FieldLabel for="booking-date">Booking date</FieldLabel>
    <Popover bind:open>
      <PopoverTrigger id="booking-date" aria-invalid={invalid}>…</PopoverTrigger>
      …
    </Popover>
    <input type="hidden" name="booking" value={date ? format(date, 'yyyy-MM-dd') : ''} />
    {#if invalid}
      <FieldError match>Pick a booking date.</FieldError>
    {/if}
  </Field>
  <Button type="submit">Book</Button>
</form>
```

## Native date input

The date picker needs JavaScript to open its calendar. For a form that must work without it, use [Input](/docs/components/input#input-types) with `type="date"`, or a remote form field's `as('date')`. Sveltery UI has no separate date component.
