import { occurrencesBetween } from '@core/events';
import type { CalendarEvent } from '@core/events';
import { addDays, fromJulianDay, jdToLunar } from '@core/lunar';
import type { JulianDay } from '@core/lunar';
import type {
  DailyReminder,
  ReminderItem,
  ReminderSettings,
  ReminderTime,
} from './types';

export interface PlanOptions {
  readonly events: readonly CalendarEvent[];
  readonly settings: ReminderSettings;
  /** Ngày đầu tiên được phép nhắc (thường là hôm nay). */
  readonly from: JulianDay;
  /** Số ngày tính từ `from` cần lên lịch. */
  readonly horizonDays: number;
  /** Số thông báo tối đa - iOS chỉ giữ 64 thông báo chờ. */
  readonly limit: number;
}

function eventItems(
  events: readonly CalendarEvent[],
  from: JulianDay,
  to: JulianDay,
): { fireDay: JulianDay; item: ReminderItem }[] {
  const result: { fireDay: JulianDay; item: ReminderItem }[] = [];
  for (const event of events) {
    const daysBefore = event.remindDaysBefore;
    if (daysBefore === null) {
      continue;
    }
    // Sự kiện ngay sau cửa sổ vẫn có thể có ngày nhắc nằm trong cửa sổ.
    for (const occurrence of occurrencesBetween(
      event,
      from,
      addDays(to, daysBefore),
    )) {
      const fireDay = addDays(occurrence, -daysBefore);
      if (fireDay >= from && fireDay <= to) {
        result.push({
          fireDay,
          item: { kind: 'event', event, occurrence, daysBefore },
        });
      }
    }
  }
  return result;
}

function lunarPhaseItems(
  settings: ReminderSettings,
  from: JulianDay,
  to: JulianDay,
): { fireDay: JulianDay; item: ReminderItem }[] {
  if (settings.lunarPhase === 'off') {
    return [];
  }
  const daysBefore = settings.lunarPhase === 'dayBefore' ? 1 : 0;
  const result: { fireDay: JulianDay; item: ReminderItem }[] = [];
  for (
    let occurrence = addDays(from, daysBefore);
    occurrence <= addDays(to, daysBefore);
    occurrence = addDays(occurrence, 1)
  ) {
    const { day } = jdToLunar(occurrence);
    if (day === 1 || day === 15) {
      result.push({
        fireDay: addDays(occurrence, -daysBefore),
        item: {
          kind: 'lunarPhase',
          phase: day === 1 ? 'firstDay' : 'fullMoon',
          occurrence,
          daysBefore,
        },
      });
    }
  }
  return result;
}

/** Thứ tự trong một thông báo: sự kiện diễn ra sớm trước, cùng ngày thì sự kiện cá nhân trước. */
const compareItems = (a: ReminderItem, b: ReminderItem): number =>
  a.occurrence - b.occurrence ||
  (a.kind === b.kind ? 0 : a.kind === 'event' ? -1 : 1);

export function planDailyReminders({
  events,
  settings,
  from,
  horizonDays,
  limit,
}: PlanOptions): DailyReminder[] {
  const to = addDays(from, Math.max(0, horizonDays - 1));
  const byDay = new Map<JulianDay, ReminderItem[]>();
  for (const { fireDay, item } of [
    ...eventItems(events, from, to),
    ...lunarPhaseItems(settings, from, to),
  ]) {
    const list = byDay.get(fireDay);
    if (list) {
      list.push(item);
    } else {
      byDay.set(fireDay, [item]);
    }
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .slice(0, limit)
    .map(([fireDay, items]) => ({
      id: `daily-${fireDay}`,
      fireDay,
      items: items.sort(compareItems),
    }));
}

/** Mốc thời gian (ms) của giờ nhắc theo giờ địa phương của máy vào ngày `day`. */
export function fireTimestamp(
  day: JulianDay,
  { hour, minute }: ReminderTime,
): number {
  const { year, month, day: date } = fromJulianDay(day);
  return new Date(year, month - 1, date, hour, minute, 0, 0).getTime();
}
