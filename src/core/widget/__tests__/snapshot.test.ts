import type { CalendarEvent } from '@core/events';
import { toJulianDay } from '@core/lunar';
import { WIDGET_SNAPSHOT_VERSION, buildWidgetSnapshot } from '../snapshot';

const gio: CalendarEvent = {
  id: 'gio',
  title: 'Giỗ ông nội',
  note: '',
  origin: {
    calendar: 'lunar',
    date: { year: 2020, month: 9, day: 1, isLeapMonth: false },
  },
  repeat: 'yearly',
  remindDaysBefore: null,
  createdAt: 0,
  updatedAt: 0,
};

const TODAY = toJulianDay({ year: 2026, month: 10, day: 3 });

describe('buildWidgetSnapshot', () => {
  const snapshot = buildWidgetSnapshot(
    [gio],
    TODAY,
    10,
    new Date('2026-10-03T00:00:00Z'),
  );

  it('có đủ số ngày liên tiếp kèm phiên bản', () => {
    expect(snapshot.version).toBe(WIDGET_SNAPSHOT_VERSION);
    expect(snapshot.days.map(d => d.date).slice(0, 2)).toEqual([
      '2026-10-03',
      '2026-10-04',
    ]);
    expect(snapshot.days).toHaveLength(10);
  });

  it('chuỗi hiển thị đã định dạng sẵn', () => {
    expect(snapshot.days[0]).toMatchObject({
      weekday: 'Thứ bảy',
      day: 3,
      monthTitle: 'Tháng 10, 2026',
      lunar: '23 tháng Tám',
      canChi: 'Ngày Canh Tuất · Năm Bính Ngọ',
      isRedDay: false,
      highlights: [],
      upcoming: [{ title: 'Giỗ ông nội', when: 'Còn 7 ngày', date: '10/10' }],
    });
  });

  it('ngày diễn ra: sự kiện nằm trong highlights, Chủ nhật tô đỏ', () => {
    const eventDay = snapshot.days.find(d => d.date === '2026-10-10');
    expect(eventDay?.highlights).toEqual([
      { text: 'Giải phóng Thủ đô', kind: 'holiday' },
      { text: 'Giỗ ông nội', kind: 'event' },
    ]);
    expect(snapshot.days.find(d => d.date === '2026-10-04')?.isRedDay).toBe(
      true,
    );
  });

  it('upcoming không lặp lại sự kiện của chính ngày đó', () => {
    const eventDay = snapshot.days.find(d => d.date === '2026-10-10');
    expect(eventDay?.upcoming[0]?.date).not.toBe('10/10');
  });
});
