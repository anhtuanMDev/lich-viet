import type { LunarDate, SolarDate } from '@core/lunar';

/** Ngày gốc của sự kiện – theo dương lịch hoặc âm lịch, không bao giờ lẫn lộn. */
export type EventDate =
  | { readonly calendar: 'solar'; readonly date: SolarDate }
  | { readonly calendar: 'lunar'; readonly date: LunarDate };

export type EventCalendar = EventDate['calendar'];

export type EventRepeat = 'once' | 'yearly';

/** Nhắc trước bao nhiêu ngày (0 = đúng ngày). */
export const REMINDER_OFFSETS = [0, 1, 3, 7] as const;
export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

export interface CalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly note: string;
  readonly origin: EventDate;
  readonly repeat: EventRepeat;
  /** null = không nhắc. */
  readonly remindDaysBefore: ReminderOffset | null;
  readonly createdAt: number;
  readonly updatedAt: number;
}
