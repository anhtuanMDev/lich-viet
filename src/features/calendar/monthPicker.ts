import { SUPPORTED_YEAR_RANGE } from '@core/lunar';
import type { MonthNumber } from '@core/lunar';

/** Số năm trên một trang của bảng chọn năm (lưới 3 × 4). */
export const YEARS_PER_PAGE = 12;

export const MONTH_NUMBERS: readonly MonthNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

export const clampYear = (year: number): number =>
  Math.min(SUPPORTED_YEAR_RANGE.max, Math.max(SUPPORTED_YEAR_RANGE.min, year));

/** Năm đầu của trang chứa `year`; các trang đếm từ năm nhỏ nhất được hỗ trợ (1900, 1912…). */
export const yearPageStart = (year: number): number => {
  const { min } = SUPPORTED_YEAR_RANGE;
  return min + Math.floor((clampYear(year) - min) / YEARS_PER_PAGE) * YEARS_PER_PAGE;
};

/** Các năm của trang bắt đầu từ `start`, bỏ những năm vượt quá năm lớn nhất được hỗ trợ. */
export const yearsOfPage = (start: number): readonly number[] =>
  Array.from({ length: YEARS_PER_PAGE }, (_, i) => start + i).filter(
    year => year <= SUPPORTED_YEAR_RANGE.max,
  );
