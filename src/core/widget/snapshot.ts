import {
  formatMonthTitle,
  lunarMonthName,
  toIsoDate,
  weekdayName,
} from '@core/date/format';
import { eventsByDay, upcomingEvents } from '@core/events';
import type { CalendarEvent } from '@core/events';
import {
  addDays,
  formatCanChi,
  getDayDetail,
  fromJulianDay,
} from '@core/lunar';
import type { JulianDay } from '@core/lunar';

/**
 * Dữ liệu hiển thị cho widget, đã tính sẵn thành chuỗi – widget (SwiftUI / Android RemoteViews)
 * chỉ việc hiển thị, không cần biết gì về âm lịch.
 * Đổi cấu trúc → tăng WIDGET_SNAPSHOT_VERSION và cập nhật phía Swift (LichVietWidget.swift).
 */
export const WIDGET_SNAPSHOT_VERSION = 2;

export interface WidgetUpcoming {
  readonly title: string;
  /** "Ngày mai", "Còn 3 ngày" */
  readonly when: string;
  /** "10/10" */
  readonly date: string;
}

export interface WidgetHighlight {
  readonly text: string;
  /** Ngày lễ tô đỏ, sự kiện cá nhân tô xanh – giống trong app. */
  readonly kind: 'holiday' | 'event';
}

export interface WidgetDay {
  /** YYYY-MM-DD – khoá để widget chọn đúng ngày. */
  readonly date: string;
  readonly weekday: string;
  readonly day: number;
  /** "Tháng 10, 2026" */
  readonly monthTitle: string;
  /** "23 tháng Tám" */
  readonly lunar: string;
  /** "Ngày Canh Tuất · Năm Bính Ngọ" */
  readonly canChi: string;
  /** Chủ nhật hoặc ngày nghỉ lễ – tô đỏ. */
  readonly isRedDay: boolean;
  /** Ngày lễ và sự kiện cá nhân của chính ngày này. */
  readonly highlights: readonly WidgetHighlight[];
  /** Tối đa 3 sự kiện cá nhân sắp tới (không gồm hôm nay). */
  readonly upcoming: readonly WidgetUpcoming[];
}

export interface WidgetSnapshot {
  readonly version: number;
  readonly generatedAt: string;
  readonly days: readonly WidgetDay[];
}

const MAX_UPCOMING = 3;

const describeWhen = (daysAway: number): string =>
  daysAway === 1 ? 'Ngày mai' : `Còn ${daysAway} ngày`;

function buildDay(
  jd: JulianDay,
  events: readonly CalendarEvent[],
  todayEvents: readonly CalendarEvent[],
): WidgetDay {
  const detail = getDayDetail(fromJulianDay(jd));
  const { solar, lunar, weekday, holidays, canChi } = detail;

  const upcoming = upcomingEvents(events, addDays(jd, 1))
    .slice(0, MAX_UPCOMING)
    .map(({ event, date, daysAway }) => {
      const target = fromJulianDay(date);
      return {
        title: event.title,
        when: describeWhen(daysAway + 1),
        date: `${target.day}/${target.month}`,
      };
    });

  return {
    date: toIsoDate(solar),
    weekday: weekdayName(weekday),
    day: solar.day,
    monthTitle: formatMonthTitle(solar.year, solar.month),
    lunar: `${lunar.day} ${lunarMonthName(lunar.month, lunar.isLeapMonth)}`,
    canChi: `Ngày ${formatCanChi(canChi.day)} · Năm ${formatCanChi(
      canChi.year,
    )}`,
    isRedDay: weekday === 0 || holidays.some(h => h.kind === 'public'),
    highlights: [
      ...holidays.map(h => ({ text: h.name, kind: 'holiday' as const })),
      ...todayEvents.map(e => ({ text: e.title, kind: 'event' as const })),
    ],
    upcoming,
  };
}

/** Dữ liệu cho `days` ngày liên tiếp bắt đầu từ `from`. */
export function buildWidgetSnapshot(
  events: readonly CalendarEvent[],
  from: JulianDay,
  days: number,
  now: Date = new Date(),
): WidgetSnapshot {
  const last = addDays(from, days - 1);
  const byDay = eventsByDay(events, from, last);
  const result: WidgetDay[] = [];
  for (let jd = from; jd <= last; jd = addDays(jd, 1)) {
    result.push(buildDay(jd, events, byDay.get(jd) ?? []));
  }
  return {
    version: WIDGET_SNAPSHOT_VERSION,
    generatedAt: now.toISOString(),
    days: result,
  };
}
