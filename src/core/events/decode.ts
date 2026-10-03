import { isValidSolarDate, lunarToJd } from '@core/lunar';
import type { LunarDate, MonthNumber, SolarDate } from '@core/lunar';
import { REMINDER_OFFSETS } from './types';
import type {
  CalendarEvent,
  EventDate,
  EventRepeat,
  ReminderOffset,
} from './types';

/*
 * Dữ liệu đọc từ bộ nhớ máy là `unknown`: có thể do phiên bản app cũ ghi, hoặc bị hỏng.
 * Mỗi bản ghi được kiểm tra riêng – một bản ghi lỗi không làm mất cả danh sách.
 */

type UnknownRecord = Readonly<Record<string, unknown>>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isInt = (value: unknown): value is number => Number.isInteger(value);

function decodeSolar(value: unknown): SolarDate | null {
  if (
    !isRecord(value) ||
    !isInt(value.year) ||
    !isInt(value.month) ||
    !isInt(value.day)
  ) {
    return null;
  }
  return isValidSolarDate(value.year, value.month, value.day)
    ? { year: value.year, month: value.month as MonthNumber, day: value.day }
    : null;
}

function decodeLunar(value: unknown): LunarDate | null {
  if (
    !isRecord(value) ||
    !isInt(value.year) ||
    !isInt(value.month) ||
    !isInt(value.day) ||
    typeof value.isLeapMonth !== 'boolean' ||
    value.month < 1 ||
    value.month > 12
  ) {
    return null;
  }
  const date: LunarDate = {
    year: value.year,
    month: value.month as MonthNumber,
    day: value.day,
    isLeapMonth: value.isLeapMonth,
  };
  return lunarToJd(date) === null ? null : date;
}

function decodeOrigin(value: unknown): EventDate | null {
  if (!isRecord(value)) {
    return null;
  }
  if (value.calendar === 'solar') {
    const date = decodeSolar(value.date);
    return date && { calendar: 'solar', date };
  }
  if (value.calendar === 'lunar') {
    const date = decodeLunar(value.date);
    return date && { calendar: 'lunar', date };
  }
  return null;
}

const isRepeat = (value: unknown): value is EventRepeat =>
  value === 'once' || value === 'yearly';

const isReminderOffset = (value: unknown): value is ReminderOffset =>
  (REMINDER_OFFSETS as readonly unknown[]).includes(value);

export function decodeEvent(value: unknown): CalendarEvent | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    !isRepeat(value.repeat) ||
    !isInt(value.createdAt) ||
    !isInt(value.updatedAt)
  ) {
    return null;
  }
  const origin = decodeOrigin(value.origin);
  if (!origin) {
    return null;
  }
  return {
    id: value.id,
    title: value.title,
    note: typeof value.note === 'string' ? value.note : '',
    origin,
    repeat: value.repeat,
    remindDaysBefore: isReminderOffset(value.remindDaysBefore)
      ? value.remindDaysBefore
      : null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

/** Trả về các sự kiện hợp lệ và số bản ghi bị bỏ qua (để ghi log). */
export function decodeEvents(value: unknown): {
  readonly events: CalendarEvent[];
  readonly dropped: number;
} {
  if (!Array.isArray(value)) {
    return { events: [], dropped: 0 };
  }
  const events: CalendarEvent[] = [];
  for (const item of value) {
    const event = decodeEvent(item);
    if (event) {
      events.push(event);
    }
  }
  return { events, dropped: value.length - events.length };
}
