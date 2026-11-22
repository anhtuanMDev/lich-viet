import { SUPPORTED_YEAR_RANGE, monthDistance, shiftMonth } from '@core/lunar';
import type { MonthKey } from '@core/lunar';
import { fontScaleLimit } from '@shared/theme';

export const FIRST_MONTH: MonthKey = {
  year: SUPPORTED_YEAR_RANGE.min,
  month: 1,
};
const LAST_MONTH: MonthKey = { year: SUPPORTED_YEAR_RANGE.max, month: 12 };

export const MONTH_COUNT = monthDistance(FIRST_MONTH, LAST_MONTH) + 1;

export const monthAtIndex = (index: number): MonthKey =>
  shiftMonth(FIRST_MONTH, index);

export const indexOfMonth = (key: MonthKey): number =>
  Math.min(MONTH_COUNT - 1, Math.max(0, monthDistance(FIRST_MONTH, key)));

/** Số dương lịch trong ô: nhỏ hơn cỡ chữ nội dung để lưới tháng gọn - xem CellSolarDay. */
export const SOLAR_DAY_TEXT = { fontSize: 13, lineHeight: 16 } as const;
/** Vòng tròn đánh dấu hôm nay quanh số ngày dương - xem CellSolarDay. */
export const TODAY_CIRCLE = 20;
/** Ngày âm dưới số dương (chữ số, không dấu nên dòng sát được) - xem CellLunarLabel. */
export const LUNAR_DAY_TEXT = { fontSize: 10, lineHeight: 12 } as const;
/** Hàng ký hiệu (4) + khoảng cách phía trên (1) - xem CellMarks. */
const CELL_MARKS_HEIGHT = 5;
/** Khoảng hở trên (2) + dưới (1) trong ô - xem DayCell. */
const CELL_PADDING = 3;

/**
 * Chiều cao ô ngày: vừa đủ phần chữ bên trong (gọn như lịch tháng của Apple / Google).
 * Chữ to (cỡ chữ máy) thì ô cao theo, nếu không số ngày / ngày âm tràn sang ô bên dưới.
 */
export function cellHeightFor(fontScale: number): number {
  const scale = Math.min(Math.max(fontScale, 1), fontScaleLimit.compact);
  const solarLine = Math.max(
    TODAY_CIRCLE,
    SOLAR_DAY_TEXT.lineHeight * scale,
  );
  return Math.ceil(
    solarLine +
      LUNAR_DAY_TEXT.lineHeight * scale +
      CELL_MARKS_HEIGHT +
      CELL_PADDING,
  );
}
