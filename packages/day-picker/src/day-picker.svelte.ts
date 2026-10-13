import { DateLib } from './date-lib.js';
import { calculateFocusTarget, getNextFocus } from './focus.js';
import { clampMonth, getInitialMonth, getMonths, getNavMonths, getNextMonth, getPreviousMonth, isSameCalendarDay } from './grid.js';
import { isDateRange, rangeIncludesDate, toZoneMatchers } from './matchers.js';
import { getDayModifiers } from './modifiers.js';
import type { DayPickerProps } from './props.js';
import { isSelected, selectMultiple, selectRange, selectSingle } from './selection.js';
import type { CalendarDay, DateRange, GridOptions, Modifiers, MoveFocusBy, MoveFocusDir } from './types.js';

type Selected = Date | Date[] | DateRange | undefined;

/** What the state reads from the component: its props, and the two values the component binds. */
export interface DayPickerInput {
  readonly props: DayPickerProps;
  month: Date | undefined;
  selected: Selected;
}

const dayKey = (day: CalendarDay) => `${day.isoDate}_${day.displayMonthId}`;

/** The calendar's displayed months, focus and selection, derived from the component's props. */
export class DayPickerState {
  focused = $state.raw<CalendarDay | undefined>();
  #lastFocused = $state.raw<CalendarDay | undefined>();

  constructor(private readonly input: DayPickerInput) {}

  readonly lib = $derived.by(() => {
    const { locale, weekStartsOn, firstWeekContainsDate, timeZone } = this.input.props;
    return new DateLib({ locale, weekStartsOn, firstWeekContainsDate, timeZone });
  });

  readonly today = $derived.by(() => (this.input.props.today ? this.lib.toZone(this.input.props.today) : this.lib.today()));

  readonly grid: GridOptions = $derived.by(() => {
    const p = this.input.props;
    return {
      numberOfMonths: p.numberOfMonths,
      fixedWeeks: p.fixedWeeks,
      ISOWeek: p.ISOWeek,
      startMonth: p.startMonth && this.lib.toZone(p.startMonth),
      endMonth: p.endMonth && this.lib.toZone(p.endMonth),
      captionLayout: p.captionLayout,
      pagedNavigation: p.pagedNavigation,
      reverseMonths: p.reverseMonths,
      disableNavigation: p.disableNavigation,
      today: this.today,
    };
  });

  readonly #nav = $derived(getNavMonths(this.grid, this.lib));
  get navStart() {
    return this.#nav[0];
  }
  get navEnd() {
    return this.#nav[1];
  }

  readonly firstMonth = $derived.by(() => {
    const { month } = this.input;
    const { defaultMonth } = this.input.props;
    return getInitialMonth(month && this.lib.toZone(month), defaultMonth && this.lib.toZone(defaultMonth), this.grid, this.navStart, this.navEnd, this.lib);
  });

  readonly months = $derived(getMonths(this.firstMonth, this.navEnd, this.grid, this.lib));
  readonly days = $derived(this.months.flatMap((month) => month.weeks.flatMap((week) => week.days)));
  readonly previousMonth = $derived(getPreviousMonth(this.firstMonth, this.navStart, this.grid, this.lib));
  readonly nextMonth = $derived(getNextMonth(this.firstMonth, this.navEnd, this.grid, this.lib));

  readonly disabled = $derived.by(() => toZoneMatchers(this.input.props.disabled, this.lib));
  readonly hidden = $derived.by(() => toZoneMatchers(this.input.props.hidden, this.lib));

  readonly selected: Selected = $derived.by(() => {
    const { selected } = this.input;
    const zone = this.lib.toZone;
    if (selected instanceof Date) return zone(selected);
    if (Array.isArray(selected)) return selected.map(zone);
    if (selected) return { from: selected.from && zone(selected.from), to: selected.to && zone(selected.to) };
    return undefined;
  });

  isSelected = (date: Date) => isSelected(this.input.props.mode, this.selected, date, this.lib);

  readonly #baseModifiers = $derived.by(() => {
    const p = this.input.props;
    const custom = p.modifiers && Object.fromEntries(Object.entries(p.modifiers).map(([name, matcher]) => [name, toZoneMatchers(matcher, this.lib)]));
    const context = { disabled: this.disabled, hidden: this.hidden, modifiers: custom, showOutsideDays: p.showOutsideDays, today: this.today, navStart: this.navStart, navEnd: this.navEnd };
    return Object.fromEntries(this.days.map((day) => [dayKey(day), getDayModifiers(day, context, this.lib)]));
  });

  #base = (day: CalendarDay) => this.#baseModifiers[dayKey(day)] ?? getDayModifiers(day, { today: this.today }, this.lib);

  /** The day that takes Tab focus when focus enters the grid. */
  readonly focusTarget = $derived(calculateFocusTarget(this.days, this.#base, this.isSelected, this.#lastFocused, this.lib));

  modifiers = (day: CalendarDay): Modifiers => {
    const base = this.#base(day);
    const { date } = day;
    const range = this.selected;
    const isRange = isDateRange(range);
    return {
      ...base,
      focused: !base.hidden && !!this.focused && isSameCalendarDay(this.focused, day, this.lib),
      selected: this.isSelected(date) || base.selected,
      range_start: isRange && !!range.from && !!range.to && this.lib.isSameDay(date, range.from),
      range_end: isRange && !!range.from && !!range.to && this.lib.isSameDay(date, range.to),
      range_middle: isRange && rangeIncludesDate(range, date, true, this.lib),
    };
  };

  isFocusTarget = (day: CalendarDay) => !!this.focusTarget && isSameCalendarDay(this.focusTarget, day, this.lib);

  goToMonth = (date: Date) => {
    if (this.input.props.disableNavigation) return;
    const month = clampMonth(date, this.navStart, this.navEnd, this.lib);
    this.input.month = month;
    this.input.props.onMonthChange?.(month);
  };

  goToPrevious = () => {
    const month = this.previousMonth;
    if (!month) return;
    this.goToMonth(month);
    this.input.props.onPrevClick?.(month);
  };

  goToNext = () => {
    const month = this.nextMonth;
    if (!month) return;
    this.goToMonth(month);
    this.input.props.onNextClick?.(month);
  };

  focus = (day: CalendarDay) => {
    this.focused = day;
  };

  blur = () => {
    this.#lastFocused = this.focused;
    this.focused = undefined;
  };

  moveFocus = (moveBy: MoveFocusBy, moveDir: MoveFocusDir) => {
    const from = this.focused;
    if (!from) return;
    const p = this.input.props;
    const next = getNextFocus(moveBy, moveDir, from, this.navStart, this.navEnd, { disabled: this.disabled, hidden: this.hidden, ISOWeek: p.ISOWeek }, this.lib);
    if (!next) return;
    const inCalendar = this.days.some((day) => isSameCalendarDay(day, next, this.lib));
    if (p.disableNavigation && !inCalendar) return;
    if (!inCalendar) this.goToMonth(next.date);
    this.focused = next;
  };

  select = (day: CalendarDay, modifiers: Modifiers, event: MouseEvent) => {
    const p = this.input.props;
    const date = day.date;
    let next: Selected;
    if (p.mode === 'single') {
      next = selectSingle(this.selected as Date | undefined, date, { required: p.required }, this.lib);
    } else if (p.mode === 'multiple') {
      const current = this.selected as Date[] | undefined;
      next = selectMultiple(current, date, { required: p.required, min: p.min, max: p.max }, this.lib);
      if (next === current) return;
    } else if (p.mode === 'range') {
      const { required, min, max, excludeDisabled, resetOnSelect } = p;
      next = selectRange(this.selected as DateRange | undefined, date, { required, min, max, disabled: this.disabled, excludeDisabled, resetOnSelect }, this.lib);
    } else {
      return;
    }
    this.input.selected = next;
    (p.onSelect as ((value: Selected, date: Date, modifiers: Modifiers, event: MouseEvent) => void) | undefined)?.(next, date, modifiers, event);
  };
}
