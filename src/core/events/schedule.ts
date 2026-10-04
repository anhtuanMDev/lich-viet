import {
  SUPPORTED_YEAR_RANGE,
  addDays,
  daysInSolarMonth,
  fromJulianDay,
  jdToLunar,
  lunarMonthLength,
  lunarToJd,
  toJulianDay,
} from '@core/lunar';
import type { JulianDay, LunarDate, SolarDate } from '@core/lunar';
import type { CalendarEvent } from './types';

const clampYears = (from: number, to: number): [number, number] => [
  Math.max(from, SUPPORTED_YEAR_RANGE.min),
  Math.min(to, SUPPORTED_YEAR_RANGE.max),
];

/** 29/2 rơi vào năm không nhuận → 28/2. */
function solarInYear({ month, day }: SolarDate, year: number): JulianDay {
  return toJulianDay({
    year,
    month,
    day: Math.min(day, daysInSolarMonth(year, month)),
  });
}

/**
 * Quy ước cúng giỗ / sự kiện âm lịch lặp hằng năm:
 * - Ngày gốc ở tháng nhuận → các năm sau tính theo tháng thường cùng số.
 * - Ngày 30 mà tháng năm đó chỉ có 29 ngày → lấy ngày 29 (ngày cuối tháng).
 */
function lunarInYear(
  { month, day }: LunarDate,
  year: number,
): JulianDay | null {
  const length = lunarMonthLength(year, month, false);
  if (length === null) {
    return null;
  }
  return lunarToJd({
    year,
    month,
    day: Math.min(day, length),
    isLeapMonth: false,
  });
}

/** Ngày gốc (lần đầu tiên) của sự kiện. */
export function originJulianDay(event: CalendarEvent): JulianDay | null {
  const { origin } = event;
  return origin.calendar === 'solar'
    ? toJulianDay(origin.date)
    : lunarToJd(origin.date);
}

/** Mọi lần sự kiện diễn ra trong đoạn [from, to] (tính cả hai đầu), theo thứ tự tăng dần. */
export function occurrencesBetween(
  event: CalendarEvent,
  from: JulianDay,
  to: JulianDay,
): JulianDay[] {
  if (to < from) {
    return [];
  }
  if (event.repeat === 'once') {
    const jd = originJulianDay(event);
    return jd !== null && jd >= from && jd <= to ? [jd] : [];
  }

  const { origin } = event;
  const result: JulianDay[] = [];
  if (origin.calendar === 'solar') {
    const [start, end] = clampYears(
      Math.max(fromJulianDay(from).year, origin.date.year),
      fromJulianDay(to).year,
    );
    for (let year = start; year <= end; year++) {
      const jd = solarInYear(origin.date, year);
      if (jd >= from && jd <= to) {
        result.push(jd);
      }
    }
    return result;
  }

  const [start, end] = clampYears(
    Math.max(jdToLunar(from).year, origin.date.year),
    jdToLunar(to).year,
  );
  for (let year = start; year <= end; year++) {
    const jd =
      year === origin.date.year
        ? lunarToJd(origin.date)
        : lunarInYear(origin.date, year);
    if (jd !== null && jd >= from && jd <= to) {
      result.push(jd);
    }
  }
  return result;
}

/** Một năm âm dài tối đa 385 ngày nên cửa sổ 400 ngày luôn chứa lần kế tiếp của sự kiện lặp năm. */
const NEXT_OCCURRENCE_WINDOW = 400;

export function nextOccurrence(
  event: CalendarEvent,
  from: JulianDay,
): JulianDay | null {
  return (
    occurrencesBetween(event, from, addDays(from, NEXT_OCCURRENCE_WINDOW))[0] ??
    null
  );
}

/** Lần thứ mấy kể từ ngày gốc (0 = chính ngày gốc) - dùng cho "giỗ lần thứ N". */
export function anniversaryAt(
  event: CalendarEvent,
  occurrence: JulianDay,
): number {
  const { origin } = event;
  return origin.calendar === 'solar'
    ? fromJulianDay(occurrence).year - origin.date.year
    : jdToLunar(occurrence).year - origin.date.year;
}

/** Gom sự kiện theo ngày trong một khoảng - dùng cho lưới tháng (tra cứu O(1) mỗi ô). */
export function eventsByDay(
  events: readonly CalendarEvent[],
  from: JulianDay,
  to: JulianDay,
): ReadonlyMap<JulianDay, readonly CalendarEvent[]> {
  const map = new Map<JulianDay, CalendarEvent[]>();
  for (const event of events) {
    for (const jd of occurrencesBetween(event, from, to)) {
      const list = map.get(jd);
      if (list) {
        list.push(event);
      } else {
        map.set(jd, [event]);
      }
    }
  }
  return map;
}

export interface UpcomingEvent {
  readonly event: CalendarEvent;
  readonly date: JulianDay;
  readonly daysAway: number;
}

/** Các sự kiện sắp tới tính từ `from`, gần nhất trước. Sự kiện một lần đã qua bị loại. */
export function upcomingEvents(
  events: readonly CalendarEvent[],
  from: JulianDay,
): UpcomingEvent[] {
  const result: UpcomingEvent[] = [];
  for (const event of events) {
    const date = nextOccurrence(event, from);
    if (date !== null) {
      result.push({ event, date, daysAway: date - from });
    }
  }
  return result.sort(
    (a, b) =>
      a.date - b.date || a.event.title.localeCompare(b.event.title, 'vi'),
  );
}
