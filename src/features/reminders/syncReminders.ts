import { Platform } from 'react-native';
import { toJulianDay } from '@core/lunar';
import {
  fireTimestamp,
  notificationContent,
  planDailyReminders,
} from '@core/reminders';
import { todayInVietnam } from '@core/date/vietnamTime';
import { eventRepository } from '@features/events/eventRepository';
import { settingsStore } from '@features/settings/settingsStore';
import { notifier as defaultNotifier } from './notifier';
import type { Notifier, ScheduledNotification } from './notifier';

/**
 * iOS chỉ giữ 64 thông báo chờ → để dư vài chỗ cho thông báo thử / hệ thống.
 * Android dùng AlarmManager (giới hạn ~500/app) → đặt xa hơn để ít phụ thuộc chạy nền.
 */
const LIMITS = Platform.select({
  ios: { horizonDays: 120, limit: 60 },
  default: { horizonDays: 180, limit: 150 },
});

export type SyncResult =
  | { readonly status: 'scheduled'; readonly count: number }
  | { readonly status: 'noPermission' };

export function buildSchedule(
  now: number = Date.now(),
): ScheduledNotification[] {
  const { reminders } = settingsStore.get();
  const plan = planDailyReminders({
    events: eventRepository.list(),
    settings: reminders,
    from: toJulianDay(todayInVietnam(now)),
    ...LIMITS,
  });
  return plan
    .map(reminder => ({
      id: reminder.id,
      timestamp: fireTimestamp(reminder.fireDay, reminders.time),
      ...notificationContent(reminder),
    }))
    .filter(item => item.timestamp > now); // giờ nhắc hôm nay đã qua
}

async function run(notifier: Notifier): Promise<SyncResult> {
  if ((await notifier.permission()) !== 'granted') {
    return { status: 'noPermission' };
  }
  const schedule = buildSchedule();
  await notifier.replaceScheduled(schedule);
  return { status: 'scheduled', count: schedule.length };
}

/*
 * Các lần gọi liên tiếp (sửa nhiều sự kiện, mở app, chạy nền…) được xếp hàng: không bao giờ
 * có hai lần đồng bộ chạy song song, và nhiều yêu cầu trong lúc chờ gộp thành một lần chạy.
 */
let running: Promise<SyncResult> | null = null;
let queued: Promise<SyncResult> | null = null;

export function syncReminders(
  notifier: Notifier = defaultNotifier,
): Promise<SyncResult> {
  if (!running) {
    running = run(notifier).finally(() => {
      running = null;
    });
    return running;
  }
  queued ??= running
    .catch(() => undefined)
    .then(() => {
      queued = null;
      return syncReminders(notifier);
    });
  return queued;
}
