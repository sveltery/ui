import { describe, expect, it } from 'vitest';
import { DateLib } from './date-lib.js';
import { createDay } from './grid.js';
import { getDayModifiers, type ModifierContext } from './modifiers.js';

const lib = new DateLib();
const d = (month: number, day: number) => new Date(2024, month - 1, day);
const march = d(3, 1);
const context: ModifierContext = { today: d(3, 13), showOutsideDays: true };
const modifiersOf = (date: Date, overrides: Partial<ModifierContext> = {}, displayMonth = march) =>
  getDayModifiers(createDay(date, displayMonth, lib), { ...context, ...overrides }, lib);

describe('getDayModifiers', () => {
  it('starts with every flag off and no selection', () => {
    expect(modifiersOf(d(3, 5))).toEqual({
      disabled: false,
      hidden: false,
      outside: false,
      today: false,
      focused: false,
      selected: false,
      range_start: false,
      range_middle: false,
      range_end: false,
    });
  });

  it('flags today by calendar day', () => {
    expect(modifiersOf(d(3, 13)).today).toBe(true);
    expect(modifiersOf(d(3, 14)).today).toBe(false);
    expect(modifiersOf(new Date(2024, 2, 13, 23, 59)).today).toBe(true);
  });

  it('flags the days of other months as outside', () => {
    expect(modifiersOf(d(2, 29)).outside).toBe(true);
    expect(modifiersOf(d(3, 31)).outside).toBe(false);
  });

  it('flags disabled days with any matcher', () => {
    const disabled = [{ dayOfWeek: 0 }, d(3, 13)];
    expect(modifiersOf(d(3, 10), { disabled }).disabled).toBe(true);
    expect(modifiersOf(d(3, 13), { disabled }).disabled).toBe(true);
    expect(modifiersOf(d(3, 12), { disabled }).disabled).toBe(false);
  });

  it('flags hidden days', () => {
    expect(modifiersOf(d(3, 12), { hidden: { before: d(3, 15) } }).hidden).toBe(true);
    expect(modifiersOf(d(3, 16), { hidden: { before: d(3, 15) } }).hidden).toBe(false);
  });

  it('hides outside days unless showOutsideDays is on', () => {
    expect(modifiersOf(d(2, 29), { showOutsideDays: false }).hidden).toBe(true);
    expect(modifiersOf(d(2, 29), { showOutsideDays: undefined }).hidden).toBe(true);
    expect(modifiersOf(d(2, 29), { showOutsideDays: true }).hidden).toBe(false);
    expect(modifiersOf(d(3, 5), { showOutsideDays: false }).hidden).toBe(false);
  });

  it('hides the days before the month of navStart and after the month of navEnd', () => {
    const navStart = d(3, 15);
    const navEnd = d(3, 20);
    expect(modifiersOf(d(2, 29), { navStart, navEnd }).hidden).toBe(true);
    expect(modifiersOf(d(3, 1), { navStart, navEnd }).hidden).toBe(false);
    expect(modifiersOf(d(3, 31), { navStart, navEnd }).hidden).toBe(false);
    expect(modifiersOf(d(4, 1), { navStart, navEnd }, d(4, 1)).hidden).toBe(true);
  });

  it('adds the custom modifiers by name', () => {
    const modifiers = { weekend: { dayOfWeek: [0, 6] }, booked: [d(3, 5)], unused: undefined };
    expect(modifiersOf(d(3, 10), { modifiers })).toMatchObject({ weekend: true, booked: false, unused: false });
    expect(modifiersOf(d(3, 5), { modifiers })).toMatchObject({ weekend: false, booked: true });
  });

  it('lets custom modifiers override the built-in ones', () => {
    const modifiers = { disabled: d(3, 5), today: d(3, 6), focused: d(3, 7) };
    expect(modifiersOf(d(3, 5), { modifiers }).disabled).toBe(true);
    expect(modifiersOf(d(3, 13), { modifiers }).today).toBe(false);
    expect(modifiersOf(d(3, 6), { modifiers }).today).toBe(true);
    expect(modifiersOf(d(3, 7), { modifiers }).focused).toBe(true);
  });
});
