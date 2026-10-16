import type { CalendarDay, DayPickerProps, Modifiers } from '@sveltery/day-picker';
import type { Locale } from 'date-fns';
import type { ButtonProps, ButtonVariants } from '../button/index.js';

export type CalendarProps = DayPickerProps & {
  /** The variant of the previous and next month buttons. */
  buttonVariant?: ButtonVariants['variant'];
};

export type CalendarDayButtonProps = ButtonProps & {
  day: CalendarDay;
  modifiers: Modifiers;
  locale?: Partial<Locale>;
};
