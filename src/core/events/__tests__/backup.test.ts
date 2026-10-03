import { mergeEvents, parseBackup, serializeBackup } from '../backup';
import type { CalendarEvent } from '../types';

const event = (id: string, updatedAt: number, title = id): CalendarEvent => ({
  id,
  title,
  note: '',
  origin: {
    calendar: 'lunar',
    date: { year: 2020, month: 3, day: 10, isLeapMonth: false },
  },
  repeat: 'yearly',
  remindDaysBefore: 1,
  createdAt: 0,
  updatedAt,
});

describe('serializeBackup / parseBackup', () => {
  it('xuất rồi nhập lại được nguyên vẹn', () => {
    const events = [event('a', 1), event('b', 2)];
    const result = parseBackup(serializeBackup(events));
    expect(result).toEqual({ ok: true, events, dropped: 0 });
  });

  it('bỏ qua bản ghi hỏng nhưng vẫn nhập phần còn lại', () => {
    const text = JSON.stringify({
      app: 'lich-viet',
      format: 1,
      events: [event('a', 1), { broken: true }],
    });
    expect(parseBackup(text)).toMatchObject({ ok: true, dropped: 1 });
  });

  it.each([
    ['không phải JSON', 'oops'],
    ['không phải object', '42'],
    ['app khác', JSON.stringify({ app: 'other', format: 1, events: [] })],
    [
      'định dạng mới hơn',
      JSON.stringify({ app: 'lich-viet', format: 99, events: [] }),
    ],
  ])('báo lỗi khi %s', (_, text) => {
    expect(parseBackup(text).ok).toBe(false);
  });
});

describe('mergeEvents', () => {
  it('thêm mới, cập nhật bản mới hơn, giữ nguyên bản cũ hơn, không xoá gì', () => {
    const existing = [
      event('a', 5, 'A cũ'),
      event('b', 5, 'B hiện tại'),
      event('c', 1),
    ];
    const incoming = [
      event('a', 9, 'A mới'),
      event('b', 1, 'B cũ hơn'),
      event('d', 1),
    ];
    const result = mergeEvents(existing, incoming);

    expect(result).toMatchObject({ added: 1, updated: 1, unchanged: 1 });
    expect(Object.fromEntries(result.events.map(e => [e.id, e.title]))).toEqual(
      {
        a: 'A mới',
        b: 'B hiện tại',
        c: 'c',
        d: 'd',
      },
    );
  });
});
