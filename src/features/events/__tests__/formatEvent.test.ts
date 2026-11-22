import { shortDaysAway } from '../formatEvent';

describe('chữ ngắn số ngày còn lại', () => {
  it('ngày mai và số ngày', () => {
    expect(shortDaysAway(1)).toBe('Mai');
    expect(shortDaysAway(6)).toBe('6 ngày');
  });
});
