import type { JulianDay, MonthNumber, SolarDate, Weekday } from './types';

/** Ngày áp dụng lịch Gregory (15/10/1582); trước đó dùng lịch Julius. */
const GREGORIAN_START_JD = 2299161;

export const asJulianDay = (value: number): JulianDay => value as JulianDay;

export function toJulianDay({ year, month, day }: SolarDate): JulianDay {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const base =
    day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);
  const jd = base - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return asJulianDay(jd < GREGORIAN_START_JD ? base - 32083 : jd);
}

export function fromJulianDay(jd: JulianDay): SolarDate {
  let b: number;
  let c: number;
  if (jd > GREGORIAN_START_JD - 1) {
    const a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: (m + 3 - 12 * Math.floor(m / 10)) as MonthNumber,
    year: b * 100 + d - 4800 + Math.floor(m / 10),
  };
}

export const addDays = (jd: JulianDay, days: number): JulianDay =>
  asJulianDay(jd + days);

export const weekdayOf = (jd: JulianDay): Weekday => ((jd + 1) % 7) as Weekday;

export function daysInSolarMonth(year: number, month: MonthNumber): number {
  const next: SolarDate =
    month === 12
      ? { year: year + 1, month: 1, day: 1 }
      : { year, month: (month + 1) as MonthNumber, day: 1 };
  return toJulianDay(next) - toJulianDay({ year, month, day: 1 });
}

export function isValidSolarDate(
  year: number,
  month: number,
  day: number,
): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInSolarMonth(year, month as MonthNumber)
  );
}

export const isSameSolarDate = (a: SolarDate, b: SolarDate): boolean =>
  a.year === b.year && a.month === b.month && a.day === b.day;
