import { branchAt, dayBranchIndex } from './canChi';
import type {
  AuspiciousHour,
  DayDeity,
  DayQuality,
  JulianDay,
  MonthNumber,
} from './types';

/**
 * Giờ hoàng đạo: mỗi chuỗi ứng với một cặp địa chi của ngày (Tý/Ngọ, Sửu/Mùi, …),
 * ký tự thứ i = '1' nghĩa là giờ thứ i (bắt đầu từ Tý) là giờ hoàng đạo.
 */
const AUSPICIOUS_HOUR_PATTERNS = [
  '110100101100',
  '001101001011',
  '110011010010',
  '101100110100',
  '001011001101',
  '010010110011',
] as const;

export function auspiciousHoursOf(jd: JulianDay): readonly AuspiciousHour[] {
  const pattern = AUSPICIOUS_HOUR_PATTERNS[dayBranchIndex(jd) % 6] ?? '';
  const hours: AuspiciousHour[] = [];
  for (let i = 0; i < 12; i++) {
    if (pattern[i] === '1') {
      hours.push({
        branch: branchAt(i),
        startHour: (i * 2 + 23) % 24,
        endHour: (i * 2 + 1) % 24,
      });
    }
  }
  return hours;
}

/** 12 vị thần trực ngày theo thứ tự, bắt đầu từ Thanh Long. */
const DEITIES: readonly DayDeity[] = [
  'Thanh Long',
  'Minh Đường',
  'Thiên Hình',
  'Chu Tước',
  'Kim Quỹ',
  'Kim Đường',
  'Bạch Hổ',
  'Ngọc Đường',
  'Thiên Lao',
  'Huyền Vũ',
  'Tư Mệnh',
  'Câu Trần',
];

const AUSPICIOUS_DEITIES: ReadonlySet<DayDeity> = new Set([
  'Thanh Long',
  'Minh Đường',
  'Kim Quỹ',
  'Kim Đường',
  'Ngọc Đường',
  'Tư Mệnh',
]);

/**
 * Ngày hoàng đạo / hắc đạo. Thanh Long khởi tại ngày Tý ở tháng Giêng & tháng 7,
 * lùi 2 chi mỗi tháng tiếp theo (Dần ở tháng 2 & 8, Thìn ở tháng 3 & 9, …).
 */
export function dayQualityOf(
  jd: JulianDay,
  lunarMonth: MonthNumber,
): DayQuality {
  const startBranch = ((lunarMonth - 1) % 6) * 2;
  const deity = DEITIES[
    (dayBranchIndex(jd) - startBranch + 12) % 12
  ] as DayDeity;
  return { deity, isAuspicious: AUSPICIOUS_DEITIES.has(deity) };
}
