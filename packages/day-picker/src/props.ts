import type { Locale } from 'date-fns';
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLThAttributes } from 'svelte/elements';
import type {
  CalendarDay,
  CalendarWeek,
  CaptionLayout,
  ClassNames,
  DateRange,
  Formatters,
  Labels,
  Matcher,
  Modifiers,
  WeekStartsOn,
} from './types.js';

export type DayEventHandler<E extends Event> = (date: Date, modifiers: Modifiers, event: E) => void;

export interface DayButtonSnippetProps {
  day: CalendarDay;
  modifiers: Modifiers;
  /** Spread onto the button. Holds the handlers, ARIA, `tabindex` and the attachment that moves focus to it. */
  props: Omit<HTMLButtonAttributes, 'disabled'> & { disabled: true | undefined };
  /** The formatted day, such as `12`. */
  text: string;
}

export interface WeekNumberSnippetProps {
  week: CalendarWeek;
  /** Spread onto the cell. */
  props: HTMLThAttributes;
  /** The formatted week number, such as `07`. */
  text: string;
}

export interface ChevronSnippetProps {
  orientation: 'left' | 'right' | 'up' | 'down';
  class: string;
  disabled: boolean;
}

export interface RootSnippetProps {
  /** Spread onto the root element. `children` renders the months and the footer. */
  props: HTMLAttributes<HTMLDivElement> & { children: Snippet };
}

interface CommonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dir' | 'hidden' | 'autofocus'> {
  /** The first displayed month. Use `bind:month` to read or drive it. */
  month?: Date;
  /** The month shown first when `month` is unset. Defaults to the month of `today`. */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** The earliest month the user can navigate to. */
  startMonth?: Date;
  /** The latest month the user can navigate to. */
  endMonth?: Date;
  numberOfMonths?: number;
  /** Move by `numberOfMonths` instead of one month. */
  pagedNavigation?: boolean;
  reverseMonths?: boolean;
  disableNavigation?: boolean;
  hideNavigation?: boolean;
  /** `around` puts the buttons around the caption instead of in a shared nav. */
  navLayout?: 'around' | 'after';
  captionLayout?: CaptionLayout;
  reverseYears?: boolean;
  /** Always render six weeks per month. */
  fixedWeeks?: boolean;
  /** Use ISO weeks: Monday first, ISO week numbers. */
  ISOWeek?: boolean;
  showOutsideDays?: boolean;
  showWeekNumber?: boolean;
  hideWeekdays?: boolean;
  /** Days that can't be selected. */
  disabled?: Matcher | Matcher[];
  /** Days that are not rendered. */
  hidden?: Matcher | Matcher[];
  /** Custom modifiers. Each name becomes a `Modifiers` key and a `data-*`-free class from `modifiersClassNames`. */
  modifiers?: Record<string, Matcher | Matcher[] | undefined>;
  modifiersClassNames?: Record<string, string>;
  today?: Date;
  /** A date-fns locale. */
  locale?: Locale;
  weekStartsOn?: WeekStartsOn;
  firstWeekContainsDate?: 1 | 4;
  /** An IANA time zone, such as `America/New_York`. Days are computed in it. */
  timeZone?: string;
  dir?: 'ltr' | 'rtl';
  /** Focus the focus target when the calendar mounts. */
  autofocus?: boolean;
  classNames?: Partial<ClassNames>;
  formatters?: Partial<Formatters>;
  labels?: Partial<Labels>;
  onDayClick?: DayEventHandler<MouseEvent>;
  onDayFocus?: DayEventHandler<FocusEvent>;
  onDayBlur?: DayEventHandler<FocusEvent>;
  onDayKeyDown?: DayEventHandler<KeyboardEvent>;
  onDayMouseEnter?: DayEventHandler<MouseEvent>;
  onDayMouseLeave?: DayEventHandler<MouseEvent>;
  onNextClick?: (month: Date) => void;
  onPrevClick?: (month: Date) => void;
  root?: Snippet<[RootSnippetProps]>;
  chevron?: Snippet<[ChevronSnippetProps]>;
  dayButton?: Snippet<[DayButtonSnippetProps]>;
  weekNumber?: Snippet<[WeekNumberSnippetProps]>;
  footer?: Snippet;
}

type SelectHandler<T> = (selected: T, triggerDate: Date, modifiers: Modifiers, event: MouseEvent) => void;

interface NoSelection {
  required?: never;
  min?: never;
  max?: never;
  excludeDisabled?: never;
  resetOnSelect?: never;
}

export interface SingleProps extends Omit<NoSelection, 'required'> {
  mode: 'single';
  /** Use `bind:selected` to read or drive it. */
  selected?: Date;
  /** Keep a date selected: clicking the selected day does not clear it. */
  required?: boolean;
  onSelect?: SelectHandler<Date | undefined>;
}

export interface MultipleProps extends Omit<NoSelection, 'required' | 'min' | 'max'> {
  mode: 'multiple';
  selected?: Date[];
  required?: boolean;
  /** The fewest days that can stay selected. */
  min?: number;
  /** The most days that can be selected. */
  max?: number;
  onSelect?: SelectHandler<Date[] | undefined>;
}

export interface RangeProps {
  mode: 'range';
  selected?: DateRange;
  required?: boolean;
  /** The fewest nights a range spans. */
  min?: number;
  /** The most nights a range spans. */
  max?: number;
  /** Restart the range when it would include a disabled day. */
  excludeDisabled?: boolean;
  /** Start a new range on the next click once a range is complete. */
  resetOnSelect?: boolean;
  onSelect?: SelectHandler<DateRange | undefined>;
}

export interface NoModeProps extends NoSelection {
  mode?: undefined;
  selected?: undefined;
  onSelect?: undefined;
}

export type DayPickerProps = CommonProps & (SingleProps | MultipleProps | RangeProps | NoModeProps);

type OwnKey = Exclude<keyof CommonProps | keyof SingleProps | keyof MultipleProps | keyof RangeProps, keyof Omit<HTMLAttributes<HTMLDivElement>, 'dir' | 'hidden' | 'autofocus'>>;

/** The props DayPicker reads itself. The rest are attributes of the root element. */
export const ownProps: Record<OwnKey, true> = {
  month: true,
  defaultMonth: true,
  onMonthChange: true,
  startMonth: true,
  endMonth: true,
  numberOfMonths: true,
  pagedNavigation: true,
  reverseMonths: true,
  disableNavigation: true,
  hideNavigation: true,
  navLayout: true,
  captionLayout: true,
  reverseYears: true,
  fixedWeeks: true,
  ISOWeek: true,
  showOutsideDays: true,
  showWeekNumber: true,
  hideWeekdays: true,
  disabled: true,
  hidden: true,
  modifiers: true,
  modifiersClassNames: true,
  today: true,
  locale: true,
  weekStartsOn: true,
  firstWeekContainsDate: true,
  timeZone: true,
  dir: true,
  autofocus: true,
  classNames: true,
  formatters: true,
  labels: true,
  onDayClick: true,
  onDayFocus: true,
  onDayBlur: true,
  onDayKeyDown: true,
  onDayMouseEnter: true,
  onDayMouseLeave: true,
  onNextClick: true,
  onPrevClick: true,
  root: true,
  chevron: true,
  dayButton: true,
  weekNumber: true,
  footer: true,
  mode: true,
  selected: true,
  required: true,
  min: true,
  max: true,
  excludeDisabled: true,
  resetOnSelect: true,
  onSelect: true,
};
