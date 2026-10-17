import type { Locale } from 'date-fns';

/** A range of dates. `to` is unset while the user has picked only the start. */
export type DateRange = { from: Date | undefined; to?: Date | undefined };

/** Matches the days before `before`. */
export type DateBefore = { before: Date };
/** Matches the days after `after`. */
export type DateAfter = { after: Date };
/** Matches the days between `after` and `before`, both excluded. When `after` is later than `before`, matches the days outside them. */
export type DateInterval = { before: Date; after: Date };
/** Matches the days of the week, `0` for Sunday to `6` for Saturday. */
export type DayOfWeek = { dayOfWeek: number | number[] };

/** Describes a set of days, as in react-day-picker's `disabled`, `hidden` and `modifiers` props. */
export type Matcher = boolean | ((date: Date) => boolean) | Date | Date[] | DateRange | DateBefore | DateAfter | DateInterval | DayOfWeek;

export type Mode = 'single' | 'multiple' | 'range';

export type CaptionLayout = 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';

export type DayFlag = 'disabled' | 'hidden' | 'outside' | 'focused' | 'today';
export type SelectionState = 'selected' | 'range_start' | 'range_middle' | 'range_end';

/**
 * What applies to a day: the built-in flags, the selection states and the custom `modifiers`.
 * `selected` is set only on a selected day, and the range states only while `selected` is a range.
 */
export type Modifiers = Record<DayFlag, boolean> & Partial<Record<string, boolean>>;

/** A day in the grid. An outside day belongs to the month before or after `displayMonth`. */
export interface CalendarDay {
  readonly date: Date;
  readonly displayMonth: Date;
  readonly outside: boolean;
  /** `yyyy-MM-dd`. */
  readonly isoDate: string;
  /** `yyyy-MM` of `displayMonth`. */
  readonly displayMonthId: string;
  /** `yyyy-MM` of `date`. */
  readonly dateMonthId: string;
}

export interface CalendarWeek {
  readonly weekNumber: number;
  readonly days: CalendarDay[];
}

export interface CalendarMonth {
  /** The first day of the month. */
  readonly date: Date;
  readonly weeks: CalendarWeek[];
}

export type MoveFocusBy = 'day' | 'week' | 'month' | 'year' | 'startOfWeek' | 'endOfWeek';
export type MoveFocusDir = 'before' | 'after';

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateLibOptions {
  /** A date-fns locale. Defaults to `enUS`. */
  locale?: Locale;
  weekStartsOn?: WeekStartsOn;
  firstWeekContainsDate?: 1 | 4;
  /** An IANA time zone. Dates are created and compared in it. */
  timeZone?: string;
}

/** The options that shape the grid and its navigation. */
export interface GridOptions {
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  ISOWeek?: boolean;
  /** The earliest month the user can navigate to. */
  startMonth?: Date;
  /** The latest month the user can navigate to. */
  endMonth?: Date;
  captionLayout?: CaptionLayout;
  pagedNavigation?: boolean;
  reverseMonths?: boolean;
  disableNavigation?: boolean;
  today?: Date;
}

/** The element keys of `classNames`, with react-day-picker's names. */
export type UI =
  | 'root'
  | 'chevron'
  | 'day'
  | 'day_button'
  | 'caption_label'
  | 'dropdowns'
  | 'dropdown'
  | 'dropdown_root'
  | 'footer'
  | 'month_grid'
  | 'month_caption'
  | 'months_dropdown'
  | 'month'
  | 'months'
  | 'nav'
  | 'button_next'
  | 'button_previous'
  | 'week'
  | 'weeks'
  | 'weekday'
  | 'weekdays'
  | 'week_number'
  | 'week_number_header'
  | 'years_dropdown';

export type ClassNames = Record<UI | DayFlag | SelectionState, string>;

export interface DropdownOption {
  value: number;
  label: string;
  disabled: boolean;
}

export interface Formatters {
  formatCaption: (month: Date, lib: DateLibLike) => string;
  formatDay: (date: Date, lib: DateLibLike) => string;
  formatMonthDropdown: (month: Date, lib: DateLibLike) => string;
  formatYearDropdown: (year: Date, lib: DateLibLike) => string;
  formatWeekdayName: (weekday: Date, lib: DateLibLike) => string;
  formatWeekNumber: (weekNumber: number, lib: DateLibLike) => string;
  formatWeekNumberHeader: () => string;
}

export interface Labels {
  labelDayButton: (date: Date, modifiers: Modifiers, lib: DateLibLike) => string;
  labelGridcell: (date: Date, modifiers: Modifiers, lib: DateLibLike) => string;
  labelGrid: (month: Date, lib: DateLibLike) => string;
  labelMonthDropdown: () => string;
  labelYearDropdown: () => string;
  labelNav: () => string;
  labelNext: (month: Date | undefined) => string;
  labelPrevious: (month: Date | undefined) => string;
  labelWeekday: (weekday: Date, lib: DateLibLike) => string;
  labelWeekNumber: (weekNumber: number) => string;
  labelWeekNumberHeader: () => string;
}

/** The formatting surface formatters and labels receive. `DateLib` implements it. */
export interface DateLibLike {
  readonly options: DateLibOptions;
  format: (date: Date, pattern: string) => string;
  formatMonthYear: (date: Date) => string;
}
