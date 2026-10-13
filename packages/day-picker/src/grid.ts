import type { DateLib } from './date-lib.js';
import type { CalendarDay, CalendarMonth, CalendarWeek, DropdownOption, GridOptions } from './types.js';

const DAYS_PER_WEEK = 7;
const FIXED_WEEKS_DAYS = 6 * DAYS_PER_WEEK;

export function createDay(date: Date, displayMonth: Date, lib: DateLib): CalendarDay {
  return {
    date,
    displayMonth,
    outside: !lib.isSameMonth(date, displayMonth),
    isoDate: lib.format(date, 'yyyy-MM-dd'),
    displayMonthId: lib.format(displayMonth, 'yyyy-MM'),
    dateMonthId: lib.format(date, 'yyyy-MM'),
  };
}

/** The same date shown in the same month. An outside day appears once per month that shows it. */
export function isSameCalendarDay(a: CalendarDay, b: CalendarDay, lib: DateLib): boolean {
  return lib.isSameDay(a.date, b.date) && lib.isSameMonth(a.displayMonth, b.displayMonth);
}

/** The first and last day the user can navigate to. The year dropdowns need a range, so they default to 100 years back through this year. */
export function getNavMonths(options: GridOptions, lib: DateLib): [start: Date | undefined, end: Date | undefined] {
  const { startMonth, endMonth, captionLayout } = options;
  const hasYearDropdown = captionLayout === 'dropdown' || captionLayout === 'dropdown-years';
  const today = options.today ?? lib.today();

  const start = startMonth ? lib.startOfMonth(startMonth) : hasYearDropdown ? lib.startOfYear(lib.addYears(today, -100)) : undefined;
  const end = endMonth ? lib.endOfMonth(endMonth) : hasYearDropdown ? lib.endOfYear(today) : undefined;
  return [start && lib.startOfDay(start), end && lib.startOfDay(end)];
}

/** The first displayed month, shifted so that `numberOfMonths` months fit in the nav range. */
export function getInitialMonth(
  month: Date | undefined,
  defaultMonth: Date | undefined,
  options: GridOptions,
  navStart: Date | undefined,
  navEnd: Date | undefined,
  lib: DateLib,
): Date {
  const { numberOfMonths = 1 } = options;
  let initial = month ?? defaultMonth ?? options.today ?? lib.today();
  if (navEnd && lib.differenceInCalendarMonths(navEnd, initial) < numberOfMonths - 1) {
    initial = lib.addMonths(navEnd, -(numberOfMonths - 1));
  }
  if (navStart && lib.differenceInCalendarMonths(initial, navStart) < 0) {
    initial = navStart;
  }
  return lib.startOfMonth(initial);
}

function createMonth(month: Date, options: GridOptions, lib: DateLib): CalendarMonth {
  const { ISOWeek, fixedWeeks } = options;
  const first = ISOWeek ? lib.startOfISOWeek(month) : lib.startOfWeek(month);
  const lastOfMonth = lib.endOfMonth(month);
  const last = ISOWeek ? lib.endOfISOWeek(lastOfMonth) : lib.endOfWeek(lastOfMonth);
  const length = lib.differenceInCalendarDays(last, first) + 1;
  const dayCount = fixedWeeks ? Math.max(length, FIXED_WEEKS_DAYS) : length;
  const days = Array.from({ length: dayCount }, (_, offset) => createDay(lib.addDays(first, offset), month, lib));

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    const weekDays = days.slice(i, i + DAYS_PER_WEEK);
    const { date } = weekDays[0];
    weeks.push({ weekNumber: ISOWeek ? lib.getISOWeek(date) : lib.getWeek(date), days: weekDays });
  }
  return { date: month, weeks };
}

/** The months to show from `firstMonth`, cut off after `navEnd`. */
export function getMonths(firstMonth: Date, navEnd: Date | undefined, options: GridOptions, lib: DateLib): CalendarMonth[] {
  const { numberOfMonths = 1, reverseMonths } = options;
  const months: CalendarMonth[] = [];
  for (let i = 0; i < numberOfMonths; i++) {
    const month = lib.addMonths(firstMonth, i);
    if (navEnd && lib.isAfter(month, navEnd)) break;
    months.push(createMonth(month, options, lib));
  }
  return reverseMonths ? months.reverse() : months;
}

export function getPreviousMonth(firstMonth: Date, navStart: Date | undefined, options: GridOptions, lib: DateLib): Date | undefined {
  if (options.disableNavigation) return undefined;
  const offset = options.pagedNavigation ? (options.numberOfMonths ?? 1) : 1;
  const month = lib.startOfMonth(firstMonth);
  if (navStart && lib.differenceInCalendarMonths(month, navStart) <= 0) return undefined;
  return lib.addMonths(month, -offset);
}

export function getNextMonth(firstMonth: Date, navEnd: Date | undefined, options: GridOptions, lib: DateLib): Date | undefined {
  if (options.disableNavigation) return undefined;
  const { numberOfMonths = 1 } = options;
  if (navEnd && lib.differenceInCalendarMonths(navEnd, firstMonth) < numberOfMonths) return undefined;
  return lib.addMonths(lib.startOfMonth(firstMonth), options.pagedNavigation ? numberOfMonths : 1);
}

/** The month that navigating to `month` lands on. */
export function clampMonth(month: Date, navStart: Date | undefined, navEnd: Date | undefined, lib: DateLib): Date {
  let clamped = lib.startOfMonth(month);
  if (navStart && clamped < lib.startOfMonth(navStart)) clamped = lib.startOfMonth(navStart);
  if (navEnd && clamped > lib.startOfMonth(navEnd)) clamped = lib.startOfMonth(navEnd);
  return clamped;
}

/** The seven days of the week that contains `today`. */
export function getWeekdays(lib: DateLib, ISOWeek: boolean | undefined, today: Date): Date[] {
  const start = ISOWeek ? lib.startOfISOWeek(today) : lib.startOfWeek(today);
  return Array.from({ length: DAYS_PER_WEEK }, (_, offset) => lib.addDays(start, offset));
}

export function getMonthOptions(
  displayMonth: Date,
  navStart: Date | undefined,
  navEnd: Date | undefined,
  format: (month: Date) => string,
  lib: DateLib,
): DropdownOption[] {
  const months = lib.eachMonthOfInterval({ start: lib.startOfYear(displayMonth), end: lib.endOfYear(displayMonth) });
  return months.map((month) => ({
    value: lib.getMonth(month),
    label: format(month),
    disabled: Boolean((navStart && month < lib.startOfMonth(navStart)) || (navEnd && month > lib.startOfMonth(navEnd))),
  }));
}

/** One option per year in the nav range, or `undefined` when the range is open. */
export function getYearOptions(
  navStart: Date | undefined,
  navEnd: Date | undefined,
  format: (year: Date) => string,
  lib: DateLib,
  reverse = false,
): DropdownOption[] | undefined {
  if (!navStart || !navEnd) return undefined;
  const years = lib.eachYearOfInterval({ start: lib.startOfYear(navStart), end: lib.endOfYear(navEnd) });
  if (reverse) years.reverse();
  return years.map((year) => ({ value: lib.getYear(year), label: format(year), disabled: false }));
}
