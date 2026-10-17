---
title: Calendar
description: A calendar component that allows users to select a date or a range of dates.
---

<ComponentPreview name="base/CalendarDemoExample" />

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
npm install cn class-variance-authority date-fns @date-fns/tz @sveltery/base @sveltery/day-picker @lucide/svelte
```

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
  import { Calendar } from '#lib/components/ui/calendar';

  let date = $state<Date | undefined>(new Date());
</script>

<Calendar mode="single" bind:selected={date} class="rounded-lg border" />
```

See the [React DayPicker](https://react-day-picker.js.org) documentation for more information.

`bind:selected` holds a `Date` in `single` mode, a `Date[]` in `multiple` mode and a `{ from, to }` range in `range` mode. `bind:month` holds the first displayed month. Both work without a binding too, and `onSelect` and `onMonthChange` report each change.

## About

The `Calendar` component is built on `@sveltery/day-picker`, a Svelte port of [React DayPicker](https://daypicker.dev) v9.8.1, the version shadcn/ui uses. It takes the same props, with three Svelte changes:

- `selected` and `month` are bindable, so there is no controlled `selected` plus `onSelect` pair to keep in sync.
- The `components` prop becomes snippet props: `dayButton`, `chevron`, `weekNumber`, `root` and `footer`. Each snippet gets the attributes to spread on its element, and `dayButton` and `weekNumber` also get the formatted `text`.
- `locale` takes a [date-fns locale](https://date-fns.org/docs/I18n), such as `es` from `date-fns/locale`.

The date math runs on [date-fns](https://date-fns.org), and `timeZone` on [@date-fns/tz](https://github.com/date-fns/tz).

## Date Picker

You can use the `<Calendar>` component to build a date picker. See the [Date Picker](/docs/components/date-picker) page for more information.

## Persian / Hijri / Jalali Calendar

The Persian calendar is not available in Sveltery UI yet. `@sveltery/day-picker` ports only the Gregorian calendar of React DayPicker, so there is no `react-day-picker/persian` equivalent to swap in.

## Selected Date (With TimeZone)

The Calendar component accepts a `timeZone` prop to ensure dates are displayed and selected in the user's local timezone.

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let date = $state<Date | undefined>();
  let timeZone = $state<string | undefined>();

  onMount(() => {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
</script>

<Calendar mode="single" bind:selected={date} {timeZone} />
```

**Note:** If you notice a selected date offset (for example, selecting the 20th highlights the 19th), make sure the `timeZone` prop is set to the user's local timezone.

**Why client-side?** The timezone is detected using `Intl.DateTimeFormat().resolvedOptions().timeZone` inside `onMount` to ensure compatibility with server-side rendering. Detecting the timezone during render would cause hydration mismatches, as the server and client may be in different timezones.

## Basic

A basic calendar component. We used `class="rounded-lg border"` to style the calendar.

<ComponentPreview name="base/CalendarBasicExample" />

## Range Calendar

Use the `mode="range"` prop to enable range selection.

<ComponentPreview name="base/CalendarRangeExample" />

`min` and `max` limit the length of the range in nights, and `excludeDisabled` restarts a range that would include a disabled day.

## Month and Year Selector

Use `captionLayout="dropdown"` to show month and year dropdowns. `dropdown-months` and `dropdown-years` show only one of them.

<ComponentPreview name="base/CalendarCaptionExample" />

`startMonth` and `endMonth` set the years the dropdown lists. Without them it lists the last 100 years.

## Presets

<ComponentPreview name="base/CalendarPresetsExample" />

## Date and Time Picker

<ComponentPreview name="base/CalendarTimeExample" />

## Booked dates

<ComponentPreview name="base/CalendarBookedDatesExample" />

`disabled` and `hidden` take a matcher or an array of matchers: a `Date`, an array of dates, a `{ from, to }` range, `{ before }`, `{ after }`, `{ before, after }`, `{ dayOfWeek }` or a function that receives the date. `modifiers` adds named matchers, and `modifiersClassNames` styles them.

## Custom Cell Size

<ComponentPreview name="base/CalendarCustomDaysExample" />

You can customize the size of calendar cells using the `--cell-size` CSS variable. You can also make it responsive by using breakpoint-specific values:

```svelte
<Calendar
  mode="single"
  bind:selected={date}
  class="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
/>
```

Or use fixed values:

```svelte
<Calendar
  mode="single"
  bind:selected={date}
  class="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"
/>
```

## Week Numbers

Use `showWeekNumber` to show week numbers.

<ComponentPreview name="base/CalendarWeekNumbersExample" />

`ISOWeek` uses ISO weeks, and `weekStartsOn` sets the first day of the week.

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the calendar in a [DirectionProvider](/docs/components/direction) and pass `dir`. Use the language selector to switch the language.

<ComponentPreview name="base/CalendarRtlExample" direction="rtl" />

When using RTL, import the locale from `date-fns/locale` and pass both the `locale` and `dir` props to the Calendar component:

```svelte
<script lang="ts">
  import { arSA } from 'date-fns/locale';
</script>

<Calendar mode="single" bind:selected={date} locale={arSA} dir="rtl" />
```

## API Reference

See the [React DayPicker](https://react-day-picker.js.org) documentation for more information on the `Calendar` component.

The props it lists work the same here, except the three Svelte changes in [About](#about). `animate`, `broadcastCalendar`, `numerals`, the non-Gregorian calendars and the deprecated `fromYear`, `toYear`, `fromMonth` and `toMonth` are not ported. Neither are props added after v9.8.1, such as `reverseYears` and `resetOnSelect`.

## Changelog

### RTL Support

If you're upgrading from a previous version of the `Calendar` component, you'll need to apply the following updates to add locale support:

<Steps>

### Import the `Locale` type.

In `types.ts`, import `Locale` from `date-fns` and add a `locale` prop to `CalendarDayButtonProps`:

```diff
  import type { CalendarDay, DayPickerProps, Modifiers } from '@sveltery/day-picker';
+ import type { Locale } from 'date-fns';
  import type { ButtonProps, ButtonVariants } from '../button/index.js';

  export type CalendarDayButtonProps = ButtonProps & {
    day: CalendarDay;
    modifiers: Modifiers;
+   locale?: Partial<Locale>;
  };
```

### Add `locale` prop to the Calendar component.

Take `locale` out of the props, so you can use it in the steps below:

```diff
  let {
    month = $bindable(),
    selected = $bindable(),
    class: classProp,
    classNames,
    showOutsideDays = true,
    captionLayout = 'label',
    buttonVariant = 'ghost',
+   locale,
    formatters,
    ...props
  }: CalendarProps = $props();
```

### Pass `locale` to DayPicker.

Pass the `locale` prop to the `DayPicker` component:

```diff
  <DayPicker
    {showOutsideDays}
    {captionLayout}
+   {locale}
    formatters={{
      formatMonthDropdown: (date) =>
-       date.toLocaleString('default', { month: 'short' }),
+       date.toLocaleString(locale?.code, { month: 'short' }),
      ...formatters,
    }}
```

### Update CalendarDayButton to accept locale.

Add `locale` to the `CalendarDayButton` props:

```diff
- let { class: classProp, day, modifiers, ...props }: CalendarDayButtonProps = $props();
+ let { class: classProp, day, modifiers, locale, ...props }: CalendarDayButtonProps = $props();
```

### Update date formatting in CalendarDayButton.

Use `locale?.code` in the date formatting:

```diff
  <Button
    variant="ghost"
    size="icon"
-   data-day={day.date.toLocaleDateString()}
+   data-day={day.date.toLocaleDateString(locale?.code)}
    ...
  />
```

### Pass locale to DayButton component.

Update the `CalendarDayButton` usage in the `dayButton` snippet to pass the `locale` prop:

```diff
  {#snippet calendarDayButton({ day, modifiers, props: buttonProps, text })}
-   <CalendarDayButton {day} {modifiers} {...buttonProps}>{text}</CalendarDayButton>
+   <CalendarDayButton {day} {modifiers} {locale} {...buttonProps}>{text}</CalendarDayButton>
  {/snippet}
```

### Update RTL-aware CSS classes.

Replace directional classes with logical properties for better RTL support:

```diff
  // In the day classNames:
- [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)
+ [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)
- [&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)
+ [&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)
- [&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)
+ [&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)

  // In range_start classNames:
- rounded-l-(--cell-radius) ... after:right-0
+ rounded-s-(--cell-radius) ... after:end-0

  // In range_end classNames:
- rounded-r-(--cell-radius) ... after:left-0
+ rounded-e-(--cell-radius) ... after:start-0

  // In CalendarDayButton class:
- data-[range-end=true]:rounded-r-(--cell-radius)
+ data-[range-end=true]:rounded-e-(--cell-radius)
- data-[range-start=true]:rounded-l-(--cell-radius)
+ data-[range-start=true]:rounded-s-(--cell-radius)
```

</Steps>

After applying these changes, you can use the `locale` prop to provide locale-specific formatting:

```svelte
<script lang="ts">
  import { enUS } from 'date-fns/locale';
</script>

<Calendar mode="single" bind:selected={date} locale={enUS} />
```
