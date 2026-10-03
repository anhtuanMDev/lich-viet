import { toIsoDate } from '../format';
import { parseIsoDate } from '../parse';

describe('parseIsoDate', () => {
  it('đọc ngày hợp lệ và đổi ngược lại được', () => {
    const date = parseIsoDate('2024-02-29');
    expect(date).toEqual({ year: 2024, month: 2, day: 29 });
    expect(date && toIsoDate(date)).toBe('2024-02-29');
  });

  it.each(['2023-02-29', '2024-13-01', '2024-1-1', 'abc', ''])(
    'từ chối "%s"',
    value => {
      expect(parseIsoDate(value)).toBeNull();
    },
  );
});
