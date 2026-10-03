import {
  fromJulianDay,
  lunarMonthLength,
  lunarToJd,
  toJulianDay,
} from '@core/lunar';
import type { LunarDate, SolarDate } from '@core/lunar';
import {
  anniversaryAt,
  eventsByDay,
  nextOccurrence,
  occurrencesBetween,
  upcomingEvents,
} from '../schedule';
import type { CalendarEvent, EventDate, EventRepeat } from '../types';

const makeEvent = (
  origin: EventDate,
  repeat: EventRepeat = 'yearly',
  title = 'Sự kiện',
): CalendarEvent => ({
  id: title,
  title,
  note: '',
  origin,
  repeat,
  remindDaysBefore: null,
  createdAt: 0,
  updatedAt: 0,
});

const lunar = (date: LunarDate, repeat?: EventRepeat, title?: string) =>
  makeEvent({ calendar: 'lunar', date }, repeat, title);
const solar = (date: SolarDate, repeat?: EventRepeat, title?: string) =>
  makeEvent({ calendar: 'solar', date }, repeat, title);

const jd = (year: number, month: number, day: number) =>
  toJulianDay({ year, month: month as 1, day });
const asDates = (list: readonly number[]) =>
  list.map(d => fromJulianDay(d as ReturnType<typeof jd>));

describe('sự kiện âm lịch lặp hằng năm', () => {
  const gio = lunar({ year: 2020, month: 3, day: 10, isLeapMonth: false });

  it('rơi đúng ngày dương tương ứng mỗi năm', () => {
    expect(
      asDates(occurrencesBetween(gio, jd(2024, 1, 1), jd(2026, 12, 31))),
    ).toEqual([
      { year: 2024, month: 4, day: 18 },
      { year: 2025, month: 4, day: 7 },
      { year: 2026, month: 4, day: 26 },
    ]);
  });

  it('không có lần nào trước năm gốc', () => {
    expect(occurrencesBetween(gio, jd(2015, 1, 1), jd(2019, 12, 31))).toEqual(
      [],
    );
  });

  it('ngày gốc ở tháng nhuận → các năm sau theo tháng thường', () => {
    // 2/2 nhuận 2023 = 23/3/2023; năm 2024 tính theo 2/2 thường = 11/3/2024
    const event = lunar({ year: 2023, month: 2, day: 2, isLeapMonth: true });
    expect(
      asDates(occurrencesBetween(event, jd(2023, 1, 1), jd(2024, 12, 31))),
    ).toEqual([
      { year: 2023, month: 3, day: 23 },
      { year: 2024, month: 3, day: 11 },
    ]);
  });

  it('ngày 30 gặp tháng thiếu → lấy ngày cuối tháng', () => {
    const month = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).find(
      m =>
        lunarMonthLength(2024, m, false) === 30 &&
        lunarMonthLength(2025, m, false) === 29,
    );
    if (month === undefined) {
      throw new Error('Cần một tháng đủ năm 2024 nhưng thiếu năm 2025');
    }
    const event = lunar({ year: 2024, month, day: 30, isLeapMonth: false });
    const in2025 = occurrencesBetween(event, jd(2025, 1, 1), jd(2026, 3, 1))[0];
    expect(in2025).toBe(
      lunarToJd({ year: 2025, month, day: 29, isLeapMonth: false }),
    );
  });

  it('đếm đúng lần giỗ thứ N', () => {
    const [occurrence] = occurrencesBetween(
      gio,
      jd(2026, 1, 1),
      jd(2026, 12, 31),
    );
    expect(occurrence).toBeDefined();
    expect(occurrence && anniversaryAt(gio, occurrence)).toBe(6);
  });
});

describe('sự kiện dương lịch', () => {
  it('29/2 → 28/2 ở năm không nhuận', () => {
    const birthday = solar({ year: 2024, month: 2, day: 29 });
    expect(
      asDates(occurrencesBetween(birthday, jd(2025, 1, 1), jd(2025, 12, 31))),
    ).toEqual([{ year: 2025, month: 2, day: 28 }]);
  });

  it('sự kiện một lần chỉ xuất hiện đúng ngày gốc', () => {
    const meeting = solar({ year: 2026, month: 10, day: 20 }, 'once');
    expect(
      occurrencesBetween(meeting, jd(2026, 1, 1), jd(2027, 12, 31)),
    ).toEqual([jd(2026, 10, 20)]);
    expect(nextOccurrence(meeting, jd(2026, 10, 21))).toBeNull();
  });
});

describe('tổng hợp', () => {
  it('nextOccurrence tìm được lần kế tiếp kể cả khi phải sang năm sau', () => {
    const tet = lunar({ year: 2000, month: 1, day: 1, isLeapMonth: false });
    expect(nextOccurrence(tet, jd(2026, 10, 3))).toBe(jd(2027, 2, 6));
  });

  it('eventsByDay gom nhiều sự kiện cùng ngày', () => {
    const a = solar({ year: 2020, month: 10, day: 20 }, 'yearly', 'A');
    const b = solar({ year: 2026, month: 10, day: 20 }, 'once', 'B');
    const map = eventsByDay([a, b], jd(2026, 10, 1), jd(2026, 10, 31));
    expect(map.get(jd(2026, 10, 20))?.map(e => e.title)).toEqual(['A', 'B']);
    expect(map.size).toBe(1);
  });

  it('upcomingEvents sắp xếp theo ngày gần nhất và bỏ sự kiện đã qua', () => {
    const today = jd(2026, 10, 3);
    const list = upcomingEvents(
      [
        solar({ year: 2026, month: 12, day: 25 }, 'once', 'Xa'),
        solar({ year: 2026, month: 10, day: 5 }, 'once', 'Gần'),
        solar({ year: 2026, month: 9, day: 1 }, 'once', 'Đã qua'),
      ],
      today,
    );
    expect(list.map(u => [u.event.title, u.daysAway])).toEqual([
      ['Gần', 2],
      ['Xa', 83],
    ]);
  });
});
