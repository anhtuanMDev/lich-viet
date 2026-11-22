import { hourStripFooter, nextGoodHour, positionOf } from '../hourStrip';

import type { AuspiciousHour } from '@core/lunar';

// Giờ hoàng đạo ngày Canh Tý (22/11/2026).
const HOURS: readonly AuspiciousHour[] = [
  { branch: 'Tý', startHour: 23, endHour: 1 },
  { branch: 'Sửu', startHour: 1, endHour: 3 },
  { branch: 'Mão', startHour: 5, endHour: 7 },
  { branch: 'Ngọ', startHour: 11, endHour: 13 },
  { branch: 'Thân', startHour: 15, endHour: 17 },
  { branch: 'Dậu', startHour: 17, endHour: 19 },
];

describe('dải giờ hoàng đạo', () => {
  it('dải bắt đầu từ giờ Tý (23h)', () => {
    expect(positionOf(23)).toBe(0);
    expect(positionOf(11)).toBe(0.5);
  });

  it('đang trong giờ tốt', () => {
    expect(nextGoodHour(HOURS, 12.5)).toEqual({
      isCurrent: true,
      hour: HOURS[3],
    });
  });

  it('giờ tốt kế tiếp, kể cả vòng sang sau nửa đêm', () => {
    expect(nextGoodHour(HOURS, 9.7)?.hour.branch).toBe('Ngọ');
    expect(nextGoodHour(HOURS, 20)?.hour.branch).toBe('Tý');
  });

  it('dòng chú thích: hôm nay nói giờ kế tiếp, ngày khác liệt kê', () => {
    // Khoảng trắng trong mỗi mục là khoảng trắng không ngắt: chỉ xuống dòng ở " · ".
    const nbsp = '\u00A0';
    expect(hourStripFooter(HOURS, 9.7)).toBe(
      `Giờ tốt kế tiếp: Ngọ,${nbsp}11h-13h`,
    );
    expect(hourStripFooter(HOURS.slice(0, 2), null)).toBe(
      `Tý${nbsp}23h-1h · Sửu${nbsp}1h-3h`,
    );
  });
});
