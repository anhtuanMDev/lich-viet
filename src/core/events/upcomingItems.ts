import { lunarMonthName } from '@core/date/format';
import { addDays, getDaySummary, lunarMarkOf } from '@core/lunar';

import { upcomingEvents } from './schedule';

import type { CalendarEvent } from './types';
import type { DaySummary, JulianDay, LunarMark } from '@core/lunar';

export type UpcomingKind = 'event' | 'newMoon' | 'fullMoon' | 'holiday';

export interface UpcomingItem {
  readonly key: string;
  readonly kind: UpcomingKind;
  readonly title: string;
  readonly date: JulianDay;
  readonly daysAway: number;
  /** Ngày âm của lần diễn ra - cho dòng phụ. */
  readonly day: DaySummary;
  readonly eventId?: string;
}

/** Tìm mùng 1, rằm, ngày lễ trong chừng này ngày tới (đủ để luôn có ít nhất một mùng 1 và một rằm). */
const SCAN_DAYS = 45;

/** Số mục mặc định ở "Sắp tới". */
const DEFAULT_LIMIT = 3;

const KIND_ORDER: Readonly<Record<UpcomingKind, number>> = {
  event: 0,
  holiday: 1,
  fullMoon: 2,
  newMoon: 3,
};

const MARK_KIND: Readonly<Record<LunarMark, UpcomingKind>> = {
  new: 'newMoon',
  full: 'fullMoon',
};

/** Sự kiện cá nhân từ ngày mai trở đi (sự kiện hôm nay có mục riêng). */
function eventItems(
  events: readonly CalendarEvent[],
  todayJd: JulianDay,
): UpcomingItem[] {
  return upcomingEvents(events, todayJd)
    .filter(({ daysAway }) => daysAway >= 1)
    .map(({ event, date, daysAway }) => ({
      key: `event-${event.id}`,
      kind: 'event',
      title: event.title,
      date,
      daysAway,
      day: getDaySummary(date),
      eventId: event.id,
    }));
}

/** Ngày lễ truyền thống / nghỉ lễ, hoặc mùng 1 / rằm; null nếu ngày bình thường. */
function calendarItemOf(
  day: DaySummary,
  daysAway: number,
): UpcomingItem | null {
  const holiday = day.holidays.find(entry => entry.kind !== 'observance');
  const base = { date: day.jd, daysAway, day };
  if (holiday) {
    return {
      ...base,
      key: `holiday-${String(day.jd)}`,
      kind: 'holiday',
      title: holiday.name,
    };
  }
  const mark = lunarMarkOf(day.lunar);
  if (!mark) {
    return null;
  }
  const month = lunarMonthName(day.lunar.month, day.lunar.isLeapMonth);
  return {
    ...base,
    key: `${mark}-${String(day.jd)}`,
    kind: MARK_KIND[mark],
    title: mark === 'full' ? `Rằm ${month}` : `Mùng 1 ${month}`,
  };
}

/** Lần gần nhất của mỗi loại: một ngày lễ, một mùng 1, một rằm. */
function calendarItems(todayJd: JulianDay): UpcomingItem[] {
  const firstOfKind = new Map<UpcomingKind, UpcomingItem>();
  for (let offset = 1; offset <= SCAN_DAYS; offset++) {
    const item = calendarItemOf(
      getDaySummary(addDays(todayJd, offset)),
      offset,
    );
    if (item && !firstOfKind.has(item.kind)) {
      firstOfKind.set(item.kind, item);
    }
  }
  return [...firstOfKind.values()];
}

/**
 * Những ngày sắp tới cần để ý, gần nhất trước: sự kiện cá nhân, ngày lễ truyền thống / nghỉ lễ,
 * mùng 1 và rằm. Không gồm hôm nay (hôm nay có mục riêng). Dùng chung cho mục "Sắp tới"
 * trong app và trên widget.
 *
 * Mùng 1 / rằm trùng ngày lễ (VD Rằm tháng Giêng) thì chỉ hiện tên ngày lễ.
 */
export function upcomingItems(
  events: readonly CalendarEvent[],
  todayJd: JulianDay,
  limit = DEFAULT_LIMIT,
): UpcomingItem[] {
  return [...eventItems(events, todayJd), ...calendarItems(todayJd)]
    .sort(
      (first, second) =>
        first.date - second.date ||
        KIND_ORDER[first.kind] - KIND_ORDER[second.kind],
    )
    .slice(0, limit);
}

/**
 * Ký hiệu đầu hàng, cùng bộ với lưới lịch: chấm đặc = sự kiện, đĩa trăng = rằm, vòng màu
 * trăng = mùng 1, vòng đỏ = ngày lễ. Ngày lễ rơi vào rằm / mùng 1 mang ký hiệu trăng.
 */
export function upcomingMarkOf({ kind, day }: UpcomingItem): UpcomingKind {
  if (kind === 'event') {
    return kind;
  }
  const mark = lunarMarkOf(day.lunar);
  return mark ? MARK_KIND[mark] : 'holiday';
}
