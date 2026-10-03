import { eventRepository } from '@features/events/eventRepository';
import { updateReminderSettings } from '@features/settings/settingsStore';
import type {
  Notifier,
  PermissionState,
  ScheduledNotification,
} from '../notifier';
import { buildSchedule, syncReminders } from '../syncReminders';

function fakeNotifier(permission: PermissionState = 'granted') {
  const calls: (readonly ScheduledNotification[])[] = [];
  const notifier: Notifier = {
    permission: jest.fn(async () => permission),
    requestPermission: jest.fn(async () => permission),
    replaceScheduled: jest.fn(async items => {
      calls.push(items);
    }),
    showNow: jest.fn(async () => {}),
  };
  return { notifier, calls };
}

// 3/10/2026 08:00 giờ Việt Nam.
const NOW = Date.UTC(2026, 9, 3, 1, 0);

describe('syncReminders', () => {
  beforeAll(() => {
    eventRepository.create({
      title: 'Giỗ ông nội',
      note: '',
      origin: {
        calendar: 'lunar',
        date: { year: 2020, month: 9, day: 1, isLeapMonth: false },
      },
      repeat: 'yearly',
      remindDaysBefore: 1,
    });
    updateReminderSettings({ lunarPhase: 'off' });
  });

  it('lập lịch theo sự kiện, bỏ các mốc đã qua', () => {
    const schedule = buildSchedule(NOW);
    expect(schedule.length).toBeGreaterThan(0);
    expect(schedule[0]).toMatchObject({
      title: 'Ngày mai: Giỗ ông nội (lần thứ 6)',
      url: 'lichviet://day/2026-10-10',
    });
    expect(schedule.every(item => item.timestamp > NOW)).toBe(true);
  });

  it('không đặt lịch khi chưa có quyền thông báo', async () => {
    const { notifier, calls } = fakeNotifier('denied');
    await expect(syncReminders(notifier)).resolves.toEqual({
      status: 'noPermission',
    });
    expect(calls).toHaveLength(0);
  });

  it('gộp các lần gọi dồn dập, không chạy song song', async () => {
    const { notifier, calls } = fakeNotifier();
    const results = await Promise.all([
      syncReminders(notifier),
      syncReminders(notifier),
      syncReminders(notifier),
      syncReminders(notifier),
    ]);
    // Lần đầu chạy ngay, ba lần sau gộp thành đúng một lần chạy tiếp theo.
    expect(calls).toHaveLength(2);
    expect(results.every(r => r.status === 'scheduled')).toBe(true);
  });
});
