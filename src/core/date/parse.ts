import { isValidSolarDate } from '@core/lunar';
import type { MonthNumber, SolarDate } from '@core/lunar';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Đọc chuỗi YYYY-MM-DD; trả về null nếu sai định dạng hoặc ngày không tồn tại. */
export function parseIsoDate(value: string): SolarDate | null {
  const match = ISO_DATE.exec(value);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return isValidSolarDate(year, month, day)
    ? { year, month: month as MonthNumber, day }
    : null;
}
