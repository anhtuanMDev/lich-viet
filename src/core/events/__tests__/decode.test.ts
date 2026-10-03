import { decodeEvent, decodeEvents } from '../decode';

const valid = {
  id: 'a',
  title: 'Giỗ ông nội',
  note: '',
  origin: {
    calendar: 'lunar',
    date: { year: 2020, month: 3, day: 10, isLeapMonth: false },
  },
  repeat: 'yearly',
  remindDaysBefore: 1,
  createdAt: 1,
  updatedAt: 1,
};

describe('decodeEvent', () => {
  it('chấp nhận bản ghi hợp lệ', () => {
    expect(decodeEvent(valid)).toEqual(valid);
  });

  it('đặt giá trị mặc định cho trường tuỳ chọn bị thiếu / sai', () => {
    expect(
      decodeEvent({ ...valid, note: undefined, remindDaysBefore: 5 }),
    ).toMatchObject({
      note: '',
      remindDaysBefore: null,
    });
  });

  it.each([
    [
      'ngày âm không tồn tại',
      {
        ...valid,
        origin: {
          calendar: 'lunar',
          date: { year: 2024, month: 2, day: 1, isLeapMonth: true },
        },
      },
    ],
    [
      'ngày dương không tồn tại',
      {
        ...valid,
        origin: { calendar: 'solar', date: { year: 2023, month: 2, day: 29 } },
      },
    ],
    [
      'lịch không xác định',
      { ...valid, origin: { calendar: 'julian', date: {} } },
    ],
    ['thiếu id', { ...valid, id: 1 }],
    ['kiểu lặp lạ', { ...valid, repeat: 'weekly' }],
  ])('từ chối %s', (_, value) => {
    expect(decodeEvent(value)).toBeNull();
  });
});

describe('decodeEvents', () => {
  it('giữ bản ghi tốt, bỏ bản ghi hỏng', () => {
    const result = decodeEvents([valid, { broken: true }, null]);
    expect(result.events).toHaveLength(1);
    expect(result.dropped).toBe(2);
  });

  it('dữ liệu không phải mảng → danh sách rỗng', () => {
    expect(decodeEvents('oops')).toEqual({ events: [], dropped: 0 });
  });
});
