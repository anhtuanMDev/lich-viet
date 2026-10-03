import { lunarSubtitle } from '../lunarSubtitle';

describe('lunarSubtitle', () => {
  it('liệt kê các tháng âm trong cùng năm', () => {
    expect(lunarSubtitle({ year: 2026, month: 10 }, 1)).toBe(
      'Tháng 8 – 9 năm Bính Ngọ',
    );
  });

  it('ghi rõ hai năm khi tháng dương đi qua Tết', () => {
    expect(lunarSubtitle({ year: 2024, month: 2 }, 1)).toBe(
      'Tháng 12 Quý Mão – tháng 1 Giáp Thìn',
    );
  });

  it('ghi chú tháng nhuận', () => {
    expect(lunarSubtitle({ year: 2023, month: 4 }, 1)).toBe(
      'Tháng 2 nhuận – 3 năm Quý Mão',
    );
  });
});
