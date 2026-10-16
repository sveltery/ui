---
title: Calendar
description: A calendar component that allows users to select a date or a range of dates.
---

<ComponentPreview name="base/CalendarExample" />

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add calendar
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority date-fns @date-fns/tz @sveltery/base @lucide/svelte
```

<Callout title="Not on npm yet">

The calendar runs on `@sveltery/day-picker`, the Svelte port of React DayPicker in the Sveltery UI repository. It is not published yet, so copy `packages/day-picker/src` into your app as `$lib/day-picker` and import it from there.

</Callout>

### Add the Button component

The `Calendar` component uses the [Button](/docs/components/button) component. Make sure you have it in your project.

### Copy the component

Copy the following files into `src/lib/components/ui/calendar`.

<ComponentSource name="calendar" />

### Update the import paths

The component folders import each other with relative paths, so keep them side by side. If you place them elsewhere, change the imports to match your project setup.

</Steps>

</InstallTab>

</InstallTabs>

## Usage

```svelte
<script lang="ts">
  import { Calendar } from '$lib/components/ui/calendar';

  let date = $state<Date | undefined>(new Date());
</script>

<Calendar mode="single" bind:selected={date} class="rounded-lg border" />
```

`bind:selected` holds a `Date` in `single` mode, a `Date[]` in `multiple` mode and a `{ from, to }` range in `range` mode. `bind:month` holds the first displayed month. Both work without a binding too, and `onSelect` and `onMonthChange` report each change.

## About

The `Calendar` component is built on `@sveltery/day-picker`, a Svelte port of [React DayPicker](https://daypicker.dev) v9. It takes the same props, with three Svelte changes:

- `selected` and `month` are bindable, so there is no controlled `selected` plus `onSelect` pair to keep in sync.
- The `components` prop becomes snippet props: `dayButton`, `chevron`, `weekNumber`, `root` and `footer`. Each snippet gets the attributes to spread on its element, and `dayButton` and `weekNumber` also get the formatted `text`.
- `locale` takes a [date-fns locale](https://date-fns.org/docs/I18n), such as `es` from `date-fns/locale`.

The date math runs on [date-fns](https://date-fns.org), and `timeZone` on [@date-fns/tz](https://github.com/date-fns/tz).

## Range Calendar

Use `mode="range"` to select a range. `min` and `max` limit its length in nights, and `excludeDisabled` restarts a range that would include a disabled day.

```svelte
<Calendar mode="range" bind:selected={range} numberOfMonths={2} />
```

## Month and Year Selector

Use `captionLayout="dropdown"` to show month and year dropdowns. `dropdown-months` and `dropdown-years` show only one of them. `startMonth` and `endMonth` set the years the dropdown lists; without them it lists the last 100 years.

## Disabled and Booked Dates

`disabled` and `hidden` take a matcher or an array of matchers: a `Date`, an array of dates, a `{ from, to }` range, `{ before }`, `{ after }`, `{ before, after }`, `{ dayOfWeek }` or a function that receives the date. `modifiers` adds named matchers, and `modifiersClassNames` styles them.

```svelte
<Calendar
  mode="single"
  disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
  modifiers={{ booked: bookedDates }}
  modifiersClassNames={{ booked: '[&>button]:line-through opacity-100' }}
/>
```

## Custom Days

Pass a `dayButton` snippet to render each day. Spread `props` on the button so it keeps its handlers, ARIA and focus.

```svelte
<Calendar mode="range" bind:selected={range}>
  {#snippet dayButton({ day, modifiers, props, text })}
    <CalendarDayButton {day} {modifiers} {...props}>
      {text}
      {#if !modifiers.outside}<span>$100</span>{/if}
    </CalendarDayButton>
  {/snippet}
</Calendar>
```

## Custom Cell Size

Set the cell size with the `--cell-size` CSS variable. It can change at a breakpoint:

```svelte
<Calendar mode="single" bind:selected={date} class="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]" />
```

## Selected Date (With TimeZone)

`timeZone` takes an IANA time zone and computes days in it, so a selected day does not shift when the browser is in another zone. Read the user's zone once the page runs in the browser, because the server may be in a different zone:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let date = $state<Date | undefined>();
  let timeZone = $state<string | undefined>();
  onMount(() => (timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone));
</script>

<Calendar mode="single" bind:selected={date} {timeZone} />
```

## Keyboard

The grid follows the [WAI-ARIA date picker pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/). One day takes Tab focus: the selected day, else today, else the first day that can be focused.

| Key | Moves focus to |
| --- | --- |
| Arrow Left and Arrow Right | The previous or next day. `dir="rtl"` swaps them |
| Arrow Up and Arrow Down | The same day in the previous or next week |
| Page Up and Page Down | The same day in the previous or next month |
| Shift with Page Up or Page Down | The same day in the previous or next year |
| Shift with an arrow key | The same day in the previous or next month (left and right) or year (up and down) |
| Home and End | The first or last day of the week |
| Enter and Space | Selects the focused day |

Focus skips disabled and hidden days and changes month when it leaves the displayed months.

## Week Numbers

Use `showWeekNumber` to show week numbers. `ISOWeek` uses ISO weeks, and `weekStartsOn` sets the first day of the week.

## RTL

Pass `dir="rtl"` and a right-to-left locale, such as `arSA` from `date-fns/locale`.

```svelte
<Calendar mode="single" bind:selected={date} locale={arSA} dir="rtl" />
```

## Date Picker

You can use the `Calendar` component to build a date picker. See the [Date Picker](/docs/components/date-picker) page.

## API Reference

See the [React DayPicker documentation](https://daypicker.dev) for every prop. The props it lists work the same here, except the three Svelte changes in [About](#about). `animate`, `broadcastCalendar`, `numerals`, the non-Gregorian calendars and the deprecated `fromYear`, `toYear`, `fromMonth` and `toMonth` are not ported.
