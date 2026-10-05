import { clampYear, yearPageStart, yearsOfPage } from '../monthPicker';

describe('bảng chọn năm', () => {
  it('trang tính từ 1900, mỗi trang 12 năm', () => {
    expect(yearPageStart(1900)).toBe(1900);
    expect(yearPageStart(1911)).toBe(1900);
    expect(yearPageStart(1912)).toBe(1912);
    expect(yearPageStart(2026)).toBe(2020);
  });

  it('năm ngoài phạm vi được kẹp về 1900-2100', () => {
    expect(clampYear(1800)).toBe(1900);
    expect(clampYear(2500)).toBe(2100);
    expect(yearPageStart(2500)).toBe(2092);
  });

  it('trang cuối dừng ở 2100', () => {
    expect(yearsOfPage(2092)).toEqual([
      2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100,
    ]);
    expect(yearsOfPage(2020)).toHaveLength(12);
  });
});
