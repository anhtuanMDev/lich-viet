import type { CalendarEvent, EventDate, ReminderOffset } from '@core/events';
import { addDays, fromJulianDay, toJulianDay } from '@core/lunar';
import { notificationContent } from '../content';
import { fireTimestamp, planDailyReminders } from '../plan';
import type { ReminderSettings } from '../types';

const jd = (year: number, month: number, day: number) =>
  toJulianDay({ year, month: month as 1, day });

const event = (
  title: string,
  origin: EventDate,
  remindDaysBefore: ReminderOffset | null,
): CalendarEvent => ({
  id: title,
  title,
  note: '',
  origin,
  repeat: 'yearly',
  remindDaysBefore,
  createdAt: 0,
  updatedAt: 0,
});

const OFF: ReminderSettings = {
  time: { hour: 7, minute: 0 },
  lunarPhase: 'off',
};
// 3/10/2026 = 23/8 âm; rằm tháng 8 đã qua, mùng 1 tháng 9 = 10/10/2026, rằm tháng 9 = 24/10/2026.
const TODAY = jd(2026, 10, 3);

const fireDates = (list: ReturnType<typeof planDailyReminders>) =>
  list.map(r => fromJulianDay(r.fireDay));

describe('planDailyReminders', () => {
  const gio = event(
    'Giỗ ông nội',
    {
      calendar: 'lunar',
      date: { year: 2020, month: 9, day: 1, isLeapMonth: false },
    },
    3,
  );

  it('nhắc trước N ngày so với ngày diễn ra', () => {
    const plan = planDailyReminders({
      events: [gio],
      settings: OFF,
      from: TODAY,
      horizonDays: 30,
      limit: 60,
    });
    expect(fireDates(plan)).toEqual([{ year: 2026, month: 10, day: 7 }]);
    expect(plan[0]?.items[0]).toMatchObject({
      kind: 'event',
      daysBefore: 3,
      occurrence: jd(2026, 10, 10),
    });
  });

  it('bắt được sự kiện nằm ngay sau cửa sổ nhưng có ngày nhắc trong cửa sổ', () => {
    // Cửa sổ chỉ 5 ngày (3-7/10); sự kiện 10/10, nhắc trước 3 ngày → 7/10.
    const plan = planDailyReminders({
      events: [gio],
      settings: OFF,
      from: TODAY,
      horizonDays: 5,
      limit: 60,
    });
    expect(fireDates(plan)).toEqual([{ year: 2026, month: 10, day: 7 }]);
  });

  it('bỏ qua sự kiện không bật nhắc', () => {
    const silent = { ...gio, remindDaysBefore: null };
    expect(
      planDailyReminders({
        events: [silent],
        settings: OFF,
        from: TODAY,
        horizonDays: 30,
        limit: 60,
      }),
    ).toEqual([]);
  });

  it('nhắc mùng 1 và rằm trước 1 ngày, gộp với sự kiện cùng ngày', () => {
    const sameDay = { ...gio, remindDaysBefore: 1 as const };
    const plan = planDailyReminders({
      events: [sameDay],
      settings: { ...OFF, lunarPhase: 'dayBefore' },
      from: TODAY,
      horizonDays: 30,
      limit: 60,
    });
    expect(fireDates(plan)).toEqual([
      { year: 2026, month: 10, day: 9 },
      { year: 2026, month: 10, day: 23 },
    ]);
    expect(plan[0]?.items.map(i => i.kind)).toEqual(['event', 'lunarPhase']);
  });

  it('giới hạn số thông báo, giữ những ngày gần nhất', () => {
    const plan = planDailyReminders({
      events: [],
      settings: { ...OFF, lunarPhase: 'sameDay' },
      from: TODAY,
      horizonDays: 365,
      limit: 3,
    });
    expect(plan).toHaveLength(3);
    expect(plan[0]?.fireDay).toBe(jd(2026, 10, 10));
    expect(new Set(plan.map(r => r.id)).size).toBe(3);
  });
});

describe('fireTimestamp', () => {
  it('đúng giờ địa phương đã chọn', () => {
    const ts = fireTimestamp(jd(2026, 10, 7), { hour: 7, minute: 30 });
    const date = new Date(ts);
    expect([
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ]).toEqual([2026, 10, 7, 7, 30]);
  });
});

describe('notificationContent', () => {
  const gio = event(
    'Giỗ ông nội',
    {
      calendar: 'lunar',
      date: { year: 2020, month: 9, day: 1, isLeapMonth: false },
    },
    1,
  );

  it('một mục: tiêu đề có thời điểm và lần thứ, nội dung có ngày dương/âm, link tới ngày diễn ra', () => {
    const [reminder] = planDailyReminders({
      events: [gio],
      settings: OFF,
      from: TODAY,
      horizonDays: 30,
      limit: 1,
    });
    expect(reminder && notificationContent(reminder)).toEqual({
      title: 'Ngày mai: Giỗ ông nội (lần thứ 6)',
      body: 'Thứ bảy 10/10 (1/9 âm)',
      url: 'lichviet://day/2026-10-10',
    });
  });

  it('nhiều mục: gộp vào một thông báo', () => {
    const [reminder] = planDailyReminders({
      events: [gio],
      settings: { ...OFF, lunarPhase: 'dayBefore' },
      from: TODAY,
      horizonDays: 30,
      limit: 1,
    });
    expect(reminder && notificationContent(reminder)).toMatchObject({
      title: 'Ngày mai: Giỗ ông nội (lần thứ 6) và 1 việc khác',
      body: 'Ngày mai: Giỗ ông nội (lần thứ 6)\nNgày mai: Mùng 1 tháng Chín',
    });
  });

  it('không bao giờ lên lịch trước ngày bắt đầu', () => {
    const plan = planDailyReminders({
      events: [],
      settings: { ...OFF, lunarPhase: 'dayBefore' },
      from: addDays(jd(2026, 10, 10), 0),
      horizonDays: 2,
      limit: 60,
    });
    expect(plan.every(r => r.fireDay >= jd(2026, 10, 10))).toBe(true);
  });
});
