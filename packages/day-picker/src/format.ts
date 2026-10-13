import type { Formatters, Labels } from './types.js';

export const defaultFormatters: Formatters = {
  formatCaption: (month, lib) => lib.formatMonthYear(month),
  formatDay: (date, lib) => lib.format(date, 'd'),
  formatMonthDropdown: (month, lib) => lib.format(month, 'LLLL'),
  formatYearDropdown: (year, lib) => lib.format(year, 'yyyy'),
  formatWeekdayName: (weekday, lib) => lib.format(weekday, 'cccccc'),
  formatWeekNumber: (weekNumber) => String(weekNumber).padStart(2, '0'),
  formatWeekNumberHeader: () => '',
};

export const defaultLabels: Labels = {
  labelDayButton: (date, modifiers, lib) => {
    const label = lib.format(date, 'PPPP');
    const withToday = modifiers.today ? `Today, ${label}` : label;
    return modifiers.selected ? `${withToday}, selected` : withToday;
  },
  labelGridcell: (date, modifiers, lib) => {
    const label = lib.format(date, 'PPPP');
    return modifiers.today ? `Today, ${label}` : label;
  },
  labelGrid: (month, lib) => lib.formatMonthYear(month),
  labelMonthDropdown: () => 'Choose the Month',
  labelYearDropdown: () => 'Choose the Year',
  labelNav: () => '',
  labelNext: () => 'Go to the Next Month',
  labelPrevious: () => 'Go to the Previous Month',
  labelWeekday: (weekday, lib) => lib.format(weekday, 'cccc'),
  labelWeekNumber: (weekNumber) => `Week ${weekNumber}`,
  labelWeekNumberHeader: () => 'Week Number',
};
