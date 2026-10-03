import { msUntilNextVietnamMidnight, todayInVietnam } from '../vietnamTime';

describe('todayInVietnam', () => {
  it('đã sang ngày mới ở Việt Nam dù UTC vẫn là hôm trước', () => {
    // 2026-10-03 17:30 UTC = 2026-10-04 00:30 giờ Việt Nam
    expect(todayInVietnam(Date.UTC(2026, 9, 3, 17, 30))).toEqual({
      year: 2026,
      month: 10,
      day: 4,
    });
  });

  it('vẫn là hôm trước lúc 16:59 UTC', () => {
    expect(todayInVietnam(Date.UTC(2026, 9, 3, 16, 59))).toEqual({
      year: 2026,
      month: 10,
      day: 3,
    });
  });
});

describe('msUntilNextVietnamMidnight', () => {
  it('tính đúng khoảng cách tới 0h giờ Việt Nam', () => {
    // 23:00 giờ Việt Nam → còn 1 giờ
    expect(msUntilNextVietnamMidnight(Date.UTC(2026, 9, 3, 16, 0))).toBe(
      3_600_000,
    );
  });
});
