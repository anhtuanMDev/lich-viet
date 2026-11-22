import { lunarMarkOf } from '@core/lunar';

import type { MonthGridCell } from '@core/lunar';
import type { ColorTokens } from '@shared/theme';

/** Chủ nhật và ngày nghỉ lễ in số màu đỏ son, như lịch giấy. */
export const isRedDay = (cell: Pick<MonthGridCell, 'weekday' | 'holidays'>) =>
  cell.weekday === 0 ||
  cell.holidays.some(holiday => holiday.kind === 'public');

/** Có ngày lễ đáng đánh dấu (lễ nghỉ, lễ truyền thống) - ngày kỷ niệm thì không. */
export const hasMarkedHoliday = (cell: Pick<MonthGridCell, 'holidays'>) =>
  cell.holidays.some(holiday => holiday.kind !== 'observance');

/** Màu số dương lịch trong ô. */
export function solarDayColor(
  cell: MonthGridCell,
  isToday: boolean,
): keyof ColorTokens {
  if (isToday) {
    return 'onPrimary';
  }
  return isRedDay(cell) ? 'holiday' : 'text';
}

/** Màu ngày âm trong ô: mùng 1 / rằm nổi màu trăng. */
export const lunarDayColor = (cell: MonthGridCell): keyof ColorTokens =>
  lunarMarkOf(cell.lunar) ? 'lunarAccent' : 'textMuted';
