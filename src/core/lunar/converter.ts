import {
  NEW_MOON_EPOCH,
  SYNODIC_MONTH,
  newMoonDay,
  sunSector,
} from './astronomy';
import { fromJulianDay, toJulianDay } from './julian';
import type { JulianDay, LunarDate, MonthNumber, SolarDate } from './types';

/** Âm lịch Việt Nam tính theo giờ chuẩn UTC+7 (khác Trung Quốc UTC+8). */
export const VIETNAM_TIMEZONE = 7;

/** Khoảng năm đã được kiểm chứng bằng golden tests. */
export const SUPPORTED_YEAR_RANGE = { min: 1900, max: 2100 } as const;

const tz = VIETNAM_TIMEZONE;

// Kết quả chỉ phụ thuộc vào năm nên được memo hoá: một lưới tháng 42 ô
// chỉ tốn vài phép tính thiên văn thay vì vài trăm.
const month11Cache = new Map<number, JulianDay>();
const leapOffsetCache = new Map<number, number>();

/** Ngày bắt đầu tháng 11 âm lịch (tháng chứa Đông chí) của năm dương lịch `year`. */
function lunarMonth11(year: number): JulianDay {
  const cached = month11Cache.get(year);
  if (cached !== undefined) {
    return cached;
  }
  const offset = toJulianDay({ year, month: 12, day: 31 }) - 2415021;
  const k = Math.floor(offset / SYNODIC_MONTH);
  let start = newMoonDay(k, tz);
  if (sunSector(start, tz, 12) >= 9) {
    start = newMoonDay(k - 1, tz);
  }
  month11Cache.set(year, start);
  return start;
}

const monthIndexOf = (jd: JulianDay): number =>
  Math.floor((jd - NEW_MOON_EPOCH) / SYNODIC_MONTH + 0.5);

/** Vị trí (tính từ tháng 11) của tháng nhuận trong năm có 13 tháng bắt đầu từ `a11`. */
function leapMonthOffset(a11: JulianDay): number {
  const cached = leapOffsetCache.get(a11);
  if (cached !== undefined) {
    return cached;
  }
  const k = monthIndexOf(a11);
  let i = 1;
  let arc = sunSector(newMoonDay(k + i, tz), tz, 12);
  let last: number;
  do {
    last = arc;
    i++;
    arc = sunSector(newMoonDay(k + i, tz), tz, 12);
  } while (arc !== last && i < 14);
  leapOffsetCache.set(a11, i - 1);
  return i - 1;
}

/** Đổi vị trí tháng nhuận (tính từ tháng 11) sang số tháng: offset 1 → nhuận 11, 2 → nhuận 12, 3 → nhuận 1… */
const leapMonthNumber = (leapOffset: number): MonthNumber =>
  ((leapOffset + 10) % 12 || 12) as MonthNumber;

const isThirteenMonthSpan = (a11: JulianDay, b11: JulianDay): boolean =>
  b11 - a11 > 365;

/** Số tháng nhuận (1..12) trong chu kỳ từ tháng 11 năm `year` đến tháng 11 năm sau, nếu có. */
function leapMonthInSpan(year: number): MonthNumber | null {
  const a11 = lunarMonth11(year);
  if (!isThirteenMonthSpan(a11, lunarMonth11(year + 1))) {
    return null;
  }
  return leapMonthNumber(leapMonthOffset(a11));
}

/** Tháng nhuận của năm âm lịch `lunarYear`, hoặc null nếu năm đó không nhuận. */
export function leapMonthOf(lunarYear: number): MonthNumber | null {
  // Tháng 1..10 của năm âm `lunarYear` nằm trong chu kỳ bắt đầu từ tháng 11 năm trước;
  // tháng 11, 12 nằm trong chu kỳ bắt đầu từ tháng 11 của chính năm đó.
  const early = leapMonthInSpan(lunarYear - 1);
  if (early !== null && early < 11) {
    return early;
  }
  const late = leapMonthInSpan(lunarYear);
  return late !== null && late >= 11 ? late : null;
}

export function jdToLunar(jd: JulianDay): LunarDate {
  const { year } = fromJulianDay(jd);
  // Bản gốc chỉ lùi một tháng; khi sóc thực đến muộn hơn sóc trung bình (VD 7/5/2054,
  // 9/4/2062) ngày đầu tháng vẫn nằm sau `jd` và kết quả thành "mùng 0". Lùi tới khi đúng.
  let k = Math.floor((jd - NEW_MOON_EPOCH) / SYNODIC_MONTH) + 1;
  let monthStart = newMoonDay(k, tz);
  while (monthStart > jd) {
    k--;
    monthStart = newMoonDay(k, tz);
  }

  let a11 = lunarMonth11(year);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = lunarMonth11(year - 1);
  } else {
    lunarYear = year + 1;
    b11 = lunarMonth11(year + 1);
  }

  const diff = Math.floor((monthStart - a11) / 29);
  let month = diff + 11;
  let isLeapMonth = false;
  if (isThirteenMonthSpan(a11, b11)) {
    const leapOffset = leapMonthOffset(a11);
    if (diff >= leapOffset) {
      month = diff + 10;
      isLeapMonth = diff === leapOffset;
    }
  }
  if (month > 12) {
    month -= 12;
  }
  if (month >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    year: lunarYear,
    month: month as MonthNumber,
    day: jd - monthStart + 1,
    isLeapMonth,
  };
}

export const solarToLunar = (date: SolarDate): LunarDate =>
  jdToLunar(toJulianDay(date));

/** Ngày đầu tháng âm lịch (số ngày Julius), hoặc null nếu tháng (nhuận) đó không tồn tại. */
function lunarMonthStart(
  year: number,
  month: MonthNumber,
  isLeapMonth: boolean,
): JulianDay | null {
  const [a11, b11] =
    month < 11
      ? [lunarMonth11(year - 1), lunarMonth11(year)]
      : [lunarMonth11(year), lunarMonth11(year + 1)];

  let offset = month - 11;
  if (offset < 0) {
    offset += 12;
  }
  if (isThirteenMonthSpan(a11, b11)) {
    const leapOffset = leapMonthOffset(a11);
    if (isLeapMonth && month !== leapMonthNumber(leapOffset)) {
      return null;
    }
    if (isLeapMonth || offset >= leapOffset) {
      offset += 1;
    }
  } else if (isLeapMonth) {
    return null;
  }
  return newMoonDay(monthIndexOf(a11) + offset, tz);
}

/** Số ngày (29 hoặc 30) của tháng âm lịch, hoặc null nếu tháng đó không tồn tại. */
export function lunarMonthLength(
  year: number,
  month: MonthNumber,
  isLeapMonth: boolean,
): number | null {
  const start = lunarMonthStart(year, month, isLeapMonth);
  if (start === null) {
    return null;
  }
  return newMoonDay(monthIndexOf(start) + 1, tz) - start;
}

/** Đổi ngày âm sang ngày dương. Trả về null nếu ngày âm không tồn tại (VD: 30 của tháng thiếu). */
export function lunarToJd({
  year,
  month,
  day,
  isLeapMonth,
}: LunarDate): JulianDay | null {
  const start = lunarMonthStart(year, month, isLeapMonth);
  if (start === null || !Number.isInteger(day) || day < 1) {
    return null;
  }
  const length = newMoonDay(monthIndexOf(start) + 1, tz) - start;
  return day <= length ? ((start + day - 1) as JulianDay) : null;
}

export function lunarToSolar(date: LunarDate): SolarDate | null {
  const jd = lunarToJd(date);
  return jd === null ? null : fromJulianDay(jd);
}
