import { toJulianDay } from '@core/lunar';

import { upcomingItems, upcomingMarkOf } from '../upcomingItems';

import type { CalendarEvent } from '../types';

const TODAY = toJulianDay({ year: 2026, month: 11, day: 22 }); // 14 tháng Mười âm

const gio: CalendarEvent = {
  id: 'gio-ong-noi',
  title: 'Giỗ ông nội',
  note: '',
  origin: {
    calendar: 'lunar',
    date: { year: 2014, month: 10, day: 20, isLeapMonth: false },
  },
  repeat: 'yearly',
  remindDaysBefore: 1,
  createdAt: 0,
  updatedAt: 0,
} as unknown as CalendarEvent;

describe('Sắp tới', () => {
  it('không có sự kiện: mỗi loại ngày chỉ hiện lần gần nhất', () => {
    const items = upcomingItems([], TODAY);
    expect(items.map(i => [i.kind, i.title, i.daysAway])).toEqual([
      ['fullMoon', 'Rằm tháng Mười', 1],
      ['newMoon', 'Mùng 1 tháng Mười một', 17],
      ['holiday', 'Tết Dương lịch', 40],
    ]);
  });

  it('sự kiện âm lịch xếp đúng vị trí theo ngày', () => {
    const items = upcomingItems([gio], TODAY);
    expect(items.map(i => i.title)).toEqual([
      'Rằm tháng Mười',
      'Giỗ ông nội',
      'Mùng 1 tháng Mười một',
    ]);
    expect(items[1]?.daysAway).toBe(6);
    expect(items[1]?.eventId).toBe('gio-ong-noi');
  });

  it('ngày lễ trùng rằm chỉ hiện tên ngày lễ', () => {
    const from = toJulianDay({ year: 2027, month: 2, day: 10 });
    const items = upcomingItems([], from, 5);
    const titles = items.map(i => i.title);
    expect(titles).toContain('Rằm tháng Giêng');
    expect(titles.filter(t => t.startsWith('Rằm tháng Giêng'))).toHaveLength(1);
  });

  it('ký hiệu: sự kiện, rằm, mùng 1, ngày lễ; ngày lễ rơi vào rằm mang ký hiệu trăng', () => {
    expect(upcomingItems([gio], TODAY).map(upcomingMarkOf)).toEqual([
      'fullMoon',
      'event',
      'newMoon',
    ]);
    const from = toJulianDay({ year: 2027, month: 2, day: 10 });
    const fullMoonHoliday = upcomingItems([], from, 5).find(
      item => item.title === 'Rằm tháng Giêng',
    );
    expect(fullMoonHoliday?.kind).toBe('holiday');
    expect(fullMoonHoliday && upcomingMarkOf(fullMoonHoliday)).toBe('fullMoon');
  });
});
