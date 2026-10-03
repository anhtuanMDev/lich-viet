import { getDaySummary } from './dayInfo';
import type { DaySummary } from './dayInfo';
import { addDays, toJulianDay, weekdayOf } from './julian';
import type { MonthNumber, Weekday } from './types';

export const GRID_SIZE = 42; // 6 tuần × 7 ngày, cố định để lưới không "nhảy" chiều cao.

export interface MonthGridCell extends DaySummary {
  readonly inCurrentMonth: boolean;
}

export interface MonthKey {
  readonly year: number;
  readonly month: MonthNumber;
}

/** Ngày đầu tuần: 1 = Thứ hai (mặc định ở Việt Nam), 0 = Chủ nhật. */
export type WeekStart = Extract<Weekday, 0 | 1>;

const CACHE_LIMIT = 36;
const cache = new Map<string, readonly MonthGridCell[]>();

function buildMonthGrid(
  { year, month }: MonthKey,
  weekStart: WeekStart,
): MonthGridCell[] {
  const first = toJulianDay({ year, month, day: 1 });
  const leading = (weekdayOf(first) - weekStart + 7) % 7;
  const start = addDays(first, -leading);

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const summary = getDaySummary(addDays(start, i));
    cells.push({ ...summary, inCurrentMonth: summary.solar.month === month });
  }
  return cells;
}

/** Lưới 42 ô của một tháng, có LRU cache để vuốt qua lại giữa các tháng không phải tính lại. */
export function getMonthGrid(
  key: MonthKey,
  weekStart: WeekStart,
): readonly MonthGridCell[] {
  const id = `${key.year}-${key.month}-${weekStart}`;
  const hit = cache.get(id);
  if (hit) {
    cache.delete(id);
    cache.set(id, hit);
    return hit;
  }
  const grid = buildMonthGrid(key, weekStart);
  cache.set(id, grid);
  if (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }
  return grid;
}

export const shiftMonth = (
  { year, month }: MonthKey,
  delta: number,
): MonthKey => {
  const index = year * 12 + (month - 1) + delta;
  return {
    year: Math.floor(index / 12),
    month: ((index % 12) + 1) as MonthNumber,
  };
};

export const monthDistance = (from: MonthKey, to: MonthKey): number =>
  (to.year - from.year) * 12 + (to.month - from.month);
