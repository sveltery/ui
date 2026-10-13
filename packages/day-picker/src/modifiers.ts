import type { DateLib } from './date-lib.js';
import { dateMatchModifiers } from './matchers.js';
import type { CalendarDay, Matcher, Modifiers } from './types.js';

export interface ModifierContext {
  disabled?: Matcher | Matcher[];
  hidden?: Matcher | Matcher[];
  modifiers?: Record<string, Matcher | Matcher[] | undefined>;
  showOutsideDays?: boolean;
  today: Date;
  navStart?: Date;
  navEnd?: Date;
}

/** The selection states and `focused` come from the caller's state, so they start false. */
export function getDayModifiers(day: CalendarDay, context: ModifierContext, lib: DateLib): Modifiers {
  const { date } = day;
  const { disabled, hidden, modifiers, navStart, navEnd } = context;
  const matches = (matcher: Matcher | Matcher[] | undefined) => (matcher === undefined ? false : dateMatchModifiers(date, matcher, lib));

  const isBeforeNav = navStart !== undefined && lib.isBefore(date, lib.startOfMonth(navStart));
  const isAfterNav = navEnd !== undefined && lib.isAfter(date, lib.endOfMonth(navEnd));

  const result: Modifiers = {
    disabled: matches(disabled),
    hidden: matches(hidden) || isBeforeNav || isAfterNav || (!context.showOutsideDays && day.outside),
    outside: day.outside,
    today: lib.isSameDay(date, context.today),
    focused: false,
    selected: false,
    range_start: false,
    range_middle: false,
    range_end: false,
  };
  for (const [name, matcher] of Object.entries(modifiers ?? {})) {
    result[name] = matches(matcher);
  }
  return result;
}
