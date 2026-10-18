import { SUPPORTED_YEAR_RANGE, monthDistance, shiftMonth } from '@core/lunar';
import type { MonthKey } from '@core/lunar';
import { fontScaleLimit, typography } from '@shared/theme';

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

/** Tỉ lệ chiều cao/chiều rộng của một ô ngày. */
const CELL_ASPECT_RATIO = 1.05;

/** Hàng chấm (5) + khoảng cách phía trên (2) trong ô ngày - xem DayCell. */
const CELL_DOTS_HEIGHT = 7;
/** Khoảng hở tối thiểu trên + dưới để chữ không chạm mép ô "hôm nay". */
const CELL_MIN_PADDING = 6;

/**
 * Chiều cao ô ngày: theo tỉ lệ chiều rộng, nhưng không thấp hơn phần chữ bên trong.
 * Chữ to (cỡ chữ máy) hoặc màn hẹp (cỡ hiển thị máy lớn → ít dp) mà giữ ô theo tỉ lệ
 * thì số ngày/ngày âm tràn sang ô bên dưới.
 */
export function cellHeightFor(width: number, fontScale: number): number {
  const scale = Math.min(Math.max(fontScale, 1), fontScaleLimit.compact);
  const content =
    (typography.heading.lineHeight + typography.caption.lineHeight) * scale +
    CELL_DOTS_HEIGHT +
    CELL_MIN_PADDING;
  return Math.ceil(Math.max((width / 7) * CELL_ASPECT_RATIO, content));
}
