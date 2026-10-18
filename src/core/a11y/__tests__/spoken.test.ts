import type { CalendarEvent } from '@core/events';
import { getDayDetail, getDaySummary, toJulianDay } from '@core/lunar';
import {
  speakable,
  spokenDayCell,
  spokenDayHero,
  spokenEvent,
  spokenHour,
  spokenLunarDate,
} from '../spoken';

const jd18Oct2026 = toJulianDay({ year: 2026, month: 10, day: 18 });

const event: CalendarEvent = {
  id: 'e1',
  title: 'Giỗ ông nội',
  note: '',
  origin: {
    calendar: 'lunar',
    date: { year: 2020, month: 9, day: 9, isLeapMonth: false },
  },
  repeat: 'yearly',
  remindDaysBefore: null,
  createdAt: 0,
  updatedAt: 0,
};

describe('câu đọc cho trình đọc màn hình', () => {
  it('bỏ ký tự trang trí', () => {
    expect(speakable('+ Thêm sự kiện')).toBe('Thêm sự kiện');
    expect(speakable('Xem chi tiết ngày →')).toBe('Xem chi tiết ngày');
    expect(speakable('Cài đặt máy → Google → Sao lưu')).toBe(
      'Cài đặt máy, Google, Sao lưu',
    );
    expect(speakable('Năm 2026 ▾')).toBe('Năm 2026');
    expect(speakable('Bình thường')).toBe('Bình thường');
  });

  it('ngày âm: "mùng" cho 10 ngày đầu, tháng nhuận đọc rõ', () => {
    expect(
      spokenLunarDate({ year: 2026, month: 9, day: 9, isLeapMonth: false }),
    ).toBe('mùng 9 tháng Chín âm lịch');
    expect(
      spokenLunarDate({ year: 2025, month: 6, day: 15, isLeapMonth: true }),
    ).toBe('ngày 15 tháng Sáu nhuận âm lịch');
  });

  it('giờ hoàng đạo đọc thành câu, không phải "3h-5h"', () => {
    expect(spokenHour({ branch: 'Dần', startHour: 3, endHour: 5 })).toBe(
      'Giờ Dần, từ 3 giờ đến 5 giờ',
    );
  });

  it('ô lịch: hôm nay, thứ, ngày âm, ngày lễ, có sự kiện', () => {
    expect(
      spokenDayCell(getDaySummary(jd18Oct2026), {
        isToday: true,
        hasEvent: true,
      }),
    ).toBe(
      'Hôm nay, Chủ nhật, ngày 18 tháng 10 năm 2026. ' +
        'mùng 9 tháng Chín âm lịch. Tết Trùng cửu. Có sự kiện',
    );
  });

  it('khối tờ lịch đọc thành một câu', () => {
    expect(
      spokenDayHero(getDayDetail({ year: 2026, month: 10, day: 18 })),
    ).toBe(
      'Chủ nhật, ngày 18 tháng 10 năm 2026. mùng 9 tháng Chín âm lịch. ' +
        'Năm Bính Ngọ, ngày Ất Sửu. Tết Trùng cửu',
    );
  });

  it('thẻ sự kiện: tên, ngày gốc, lần thứ, lần tới', () => {
    expect(
      spokenEvent({
        event,
        anniversary: 6,
        next: {
          date: { year: 2026, month: 10, day: 18 },
          weekday: 0,
          daysAway: 'Hôm nay',
        },
      }),
    ).toBe(
      'Giỗ ông nội. mùng 9 tháng Chín âm lịch, lặp lại hằng năm, lần thứ 6. ' +
        'Chủ nhật, ngày 18 tháng 10 năm 2026, hôm nay',
    );
    expect(spokenEvent({ event, anniversary: 0, next: null })).toBe(
      'Giỗ ông nội. mùng 9 tháng Chín âm lịch, lặp lại hằng năm',
    );
  });
});
