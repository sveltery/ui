import { TZDate } from '@date-fns/tz';
import { es, ja, ko, zhCN } from 'date-fns/locale';
import { describe, expect, it } from 'vitest';
import { DateLib } from './date-lib.js';

const march = new Date(2024, 2, 10);

describe('DateLib', () => {
  it('defaults to the en-US locale', () => {
    const lib = new DateLib();
    expect(lib.options.locale?.code).toBe('en-US');
    expect(lib.format(march, 'PPPP')).toBe('Sunday, March 10th, 2024');
  });

  it('keeps a given locale', () => {
    expect(new DateLib({ locale: es }).options.locale?.code).toBe('es');
  });

  it('formats the month and year in the locale', () => {
    expect(new DateLib().formatMonthYear(march)).toBe('March 2024');
    expect(new DateLib({ locale: es }).formatMonthYear(march)).toBe('marzo 2024');
  });

  it('puts the year first for year-first locales', () => {
    expect(new DateLib({ locale: ja }).getMonthYearOrder()).toBe('year-first');
    expect(new DateLib({ locale: ja }).formatMonthYear(march)).toBe('2024年3月');
    expect(new DateLib({ locale: ko }).formatMonthYear(march)).toBe('2024년 3월');
    expect(new DateLib({ locale: zhCN }).formatMonthYear(march)).toBe('2024年3月');
    expect(new DateLib().getMonthYearOrder()).toBe('month-first');
  });

  it('formats a year-first caption in the time zone', () => {
    const instant = new Date('2024-02-29T16:00:00Z');
    expect(new DateLib({ locale: ja, timeZone: 'Asia/Tokyo' }).formatMonthYear(instant)).toBe('2024年3月');
    expect(new DateLib({ locale: ja, timeZone: 'America/Los_Angeles' }).formatMonthYear(instant)).toBe('2024年2月');
  });

  it('starts weeks on the configured day', () => {
    expect(new DateLib().format(new DateLib().startOfWeek(march), 'yyyy-MM-dd')).toBe('2024-03-10');
    const monday = new DateLib({ weekStartsOn: 1 });
    expect(monday.format(monday.startOfWeek(march), 'yyyy-MM-dd')).toBe('2024-03-04');
    expect(monday.format(monday.endOfWeek(march), 'yyyy-MM-dd')).toBe('2024-03-10');
  });

  it('numbers weeks by the week settings', () => {
    expect(new DateLib().getWeek(new Date(2024, 0, 1))).toBe(1);
    expect(new DateLib({ weekStartsOn: 1, firstWeekContainsDate: 4 }).getWeek(new Date(2024, 0, 1))).toBe(1);
    expect(new DateLib({ weekStartsOn: 1, firstWeekContainsDate: 4 }).getWeek(new Date(2023, 0, 1))).toBe(52);
    expect(new DateLib().getISOWeek(new Date(2024, 2, 4))).toBe(10);
  });

  it('exposes members that work when destructured', () => {
    const { addMonths, startOfMonth, getYear, getMonth, format } = new DateLib();
    expect(format(startOfMonth(addMonths(new Date(2024, 0, 31), 1)), 'yyyy-MM-dd')).toBe('2024-02-01');
    expect(getYear(march)).toBe(2024);
    expect(getMonth(march)).toBe(2);
  });

  it('lists the years of an interval once each', () => {
    const lib = new DateLib();
    const years = lib.eachYearOfInterval({ start: new Date(2022, 5, 1), end: new Date(2024, 5, 1) });
    expect(years.map((year) => lib.format(year, 'yyyy'))).toEqual(['2022', '2023', '2024']);
  });

  describe('time zone', () => {
    const tokyo = new DateLib({ timeZone: 'Asia/Tokyo' });

    it('moves a date into the zone', () => {
      const zoned = tokyo.toZone(new Date('2024-03-10T20:00:00Z'));
      expect(tokyo.format(zoned, 'yyyy-MM-dd')).toBe('2024-03-11');
      expect(zoned).toBeInstanceOf(TZDate);
    });

    it('returns a date already in the zone as it is', () => {
      const zoned = tokyo.toZone(new Date('2024-03-10T20:00:00Z'));
      expect(tokyo.toZone(zoned)).toBe(zoned);
    });

    it('returns the date unchanged without a zone', () => {
      expect(new DateLib().toZone(march)).toBe(march);
    });

    it('moves a date from another zone', () => {
      const sydney = new TZDate(2024, 2, 10, 23, 0, 0, 'Australia/Sydney');
      const zoned = tokyo.toZone(sydney);
      expect((zoned as TZDate).timeZone).toBe('Asia/Tokyo');
      expect(tokyo.format(zoned, 'yyyy-MM-dd HH:mm')).toBe('2024-03-10 21:00');
    });

    it('creates dates in the zone', () => {
      const date = tokyo.newDate(2024, 2, 11) as TZDate;
      expect(date.timeZone).toBe('Asia/Tokyo');
      expect(date.toISOString()).toBe('2024-03-11T00:00:00.000+09:00');
      expect(tokyo.today()).toBeInstanceOf(TZDate);
    });

    it('creates local dates without a zone', () => {
      const date = new DateLib().newDate(2024, 2, 11);
      expect(date).not.toBeInstanceOf(TZDate);
      expect(date.getDate()).toBe(11);
    });

    it('keeps the zone through date arithmetic', () => {
      const next = tokyo.addDays(tokyo.newDate(2024, 2, 31), 1);
      expect(tokyo.format(next, 'yyyy-MM-dd')).toBe('2024-04-01');
      expect(next).toBeInstanceOf(TZDate);
    });
  });
});
