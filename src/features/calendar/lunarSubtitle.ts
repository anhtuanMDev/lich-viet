import { formatCanChi, getMonthGrid, yearCanChi } from '@core/lunar';
import type { MonthKey, WeekStart } from '@core/lunar';

const monthLabel = (month: number, isLeap: boolean): string =>
  `${month}${isLeap ? ' nhuận' : ''}`;

/**
 * Các tháng âm lịch mà một tháng dương lịch đi qua, VD:
 * "Tháng 8 – 9 năm Bính Ngọ" hoặc "Tháng Chạp Ất Tỵ – tháng 1 Bính Ngọ".
 */
export function lunarSubtitle(key: MonthKey, weekStart: WeekStart): string {
  const inMonth = getMonthGrid(key, weekStart).filter(
    cell => cell.inCurrentMonth,
  );
  const first = inMonth[0]?.lunar;
  const last = inMonth[inMonth.length - 1]?.lunar;
  if (!first || !last) {
    return '';
  }

  const firstLabel = monthLabel(first.month, first.isLeapMonth);
  const lastLabel = monthLabel(last.month, last.isLeapMonth);
  if (first.year !== last.year) {
    return `Tháng ${firstLabel} ${formatCanChi(
      yearCanChi(first.year),
    )} – tháng ${lastLabel} ${formatCanChi(yearCanChi(last.year))}`;
  }
  const range =
    firstLabel === lastLabel ? firstLabel : `${firstLabel} – ${lastLabel}`;
  return `Tháng ${range} năm ${formatCanChi(yearCanChi(first.year))}`;
}
