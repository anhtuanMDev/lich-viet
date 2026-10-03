import type { CalendarEvent, ReminderOffset } from '@core/events';
import type { JulianDay } from '@core/lunar';

export interface ReminderTime {
  readonly hour: number;
  readonly minute: number;
}

/** Nhắc mùng 1 và rằm: tắt, đúng ngày, hoặc trước 1 ngày (để chuẩn bị đồ cúng). */
export type LunarPhaseReminder = 'off' | 'sameDay' | 'dayBefore';

export interface ReminderSettings {
  readonly time: ReminderTime;
  readonly lunarPhase: LunarPhaseReminder;
}

export type ReminderItem =
  | {
      readonly kind: 'event';
      readonly event: CalendarEvent;
      /** Ngày sự kiện diễn ra (không phải ngày nhắc). */
      readonly occurrence: JulianDay;
      readonly daysBefore: ReminderOffset;
    }
  | {
      readonly kind: 'lunarPhase';
      readonly phase: 'firstDay' | 'fullMoon';
      readonly occurrence: JulianDay;
      readonly daysBefore: 0 | 1;
    };

/** Mọi lời nhắc của cùng một ngày được gộp vào một thông báo. */
export interface DailyReminder {
  /** Ổn định theo ngày → đặt lại lịch không tạo thông báo trùng. */
  readonly id: string;
  readonly fireDay: JulianDay;
  readonly items: readonly ReminderItem[];
}

export interface NotificationContent {
  readonly title: string;
  readonly body: string;
  /** Mở app tới ngày diễn ra của mục đầu tiên. */
  readonly url: string;
}
