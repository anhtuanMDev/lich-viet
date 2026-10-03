import {
  getDayDetail,
  leapMonthOf,
  lunarMonthLength,
  lunarToSolar,
  solarToLunar,
} from '../index';

describe('các mốc đã biết', () => {
  it.each`
    solar                                 | lunar                                                    | note
    ${{ year: 1985, month: 1, day: 21 }}  | ${{ year: 1985, month: 1, day: 1, isLeapMonth: false }}  | ${'Tết 1985 VN sớm hơn TQ 1 tháng (UTC+7 vs UTC+8)'}
    ${{ year: 2007, month: 2, day: 17 }}  | ${{ year: 2007, month: 1, day: 1, isLeapMonth: false }}  | ${'Tết 2007 VN sớm hơn TQ 1 ngày'}
    ${{ year: 2024, month: 2, day: 10 }}  | ${{ year: 2024, month: 1, day: 1, isLeapMonth: false }}  | ${'Tết Giáp Thìn'}
    ${{ year: 2025, month: 1, day: 29 }}  | ${{ year: 2025, month: 1, day: 1, isLeapMonth: false }}  | ${'Tết Ất Tỵ'}
    ${{ year: 2023, month: 3, day: 23 }}  | ${{ year: 2023, month: 2, day: 2, isLeapMonth: true }}   | ${'tháng 2 nhuận 2023'}
    ${{ year: 2033, month: 12, day: 22 }} | ${{ year: 2033, month: 11, day: 1, isLeapMonth: true }}  | ${'"vấn đề năm 2033": nhuận tháng 11'}
    ${{ year: 2054, month: 5, day: 7 }}   | ${{ year: 2054, month: 3, day: 30, isLeapMonth: false }} | ${'hồi quy lỗi "mùng 0" của thuật toán gốc'}
    ${{ year: 2062, month: 4, day: 9 }}   | ${{ year: 2062, month: 2, day: 30, isLeapMonth: false }} | ${'hồi quy lỗi "mùng 0" của thuật toán gốc (2062)'}
  `('$note', ({ solar, lunar }) => {
    expect(solarToLunar(solar)).toEqual(lunar);
    expect(lunarToSolar(lunar)).toEqual(solar);
  });

  it('nhận diện năm nhuận', () => {
    expect(leapMonthOf(2023)).toBe(2);
    expect(leapMonthOf(2025)).toBe(6);
    expect(leapMonthOf(2033)).toBe(11);
    expect(leapMonthOf(2024)).toBeNull();
  });
});

describe('ngày âm không tồn tại', () => {
  it('trả về null cho tháng nhuận sai', () => {
    expect(
      lunarToSolar({ year: 2023, month: 5, day: 1, isLeapMonth: true }),
    ).toBeNull();
    expect(
      lunarToSolar({ year: 2024, month: 2, day: 1, isLeapMonth: true }),
    ).toBeNull();
  });

  it('trả về null cho ngày 30 của tháng thiếu và ngày không hợp lệ', () => {
    const shortMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find(
      m => lunarMonthLength(2024, m as 1, false) === 29,
    );
    expect(shortMonth).toBeDefined();
    expect(
      lunarToSolar({
        year: 2024,
        month: shortMonth as 1,
        day: 30,
        isLeapMonth: false,
      }),
    ).toBeNull();
    expect(
      lunarToSolar({ year: 2024, month: 1, day: 0, isLeapMonth: false }),
    ).toBeNull();
  });
});

describe('getDayDetail', () => {
  it('tổng hợp đúng thông tin ngày Tết Giáp Thìn', () => {
    const detail = getDayDetail({ year: 2024, month: 2, day: 10 });
    expect(detail.weekday).toBe(6);
    expect(detail.canChi.year).toEqual({ stem: 'Giáp', branch: 'Thìn' });
    expect(detail.holidays.map(h => h.name)).toContain('Tết Nguyên Đán');
    expect(detail.auspiciousHours).toHaveLength(6);
  });

  it('đánh dấu Giao thừa vào ngày cuối tháng Chạp', () => {
    const detail = getDayDetail({ year: 2024, month: 2, day: 9 });
    expect(detail.holidays.map(h => h.name)).toContain('Giao thừa');
  });
});
