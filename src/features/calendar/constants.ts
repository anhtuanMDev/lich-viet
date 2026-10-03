import { SUPPORTED_YEAR_RANGE, monthDistance, shiftMonth } from '@core/lunar';
import type { MonthKey } from '@core/lunar';

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
export const CELL_ASPECT_RATIO = 1.05;
