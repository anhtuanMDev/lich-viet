import { formatHourRange } from '@core/date/format';

import type { AuspiciousHour } from '@core/lunar';

const HOURS_PER_DAY = 24;
/** Dải bắt đầu từ giờ Tý (23h); mỗi ô dài đúng 2 giờ. */
const STRIP_START_HOUR = 23;
const HOUR_SPAN = 2;

/** Vị trí (0..1) của một giờ trong ngày trên dải bắt đầu từ giờ Tý. */
export function positionOf(hour: number): number {
  const sinceStart =
    (((hour - STRIP_START_HOUR) % HOURS_PER_DAY) + HOURS_PER_DAY) %
    HOURS_PER_DAY;
  return sinceStart / HOURS_PER_DAY;
}

export interface NextGoodHour {
  /** Giờ tốt đang diễn ra (true) hay sắp tới (false). */
  readonly isCurrent: boolean;
  readonly hour: AuspiciousHour;
}

/** Quãng (0..1) từ `now` tới đầu giờ `hour`, vòng sang ngày sau nếu đã qua. */
const distanceTo = (now: number, hour: AuspiciousHour): number => {
  const start = positionOf(hour.startHour);
  return start > now ? start - now : start + 1 - now;
};

const contains = (now: number, hour: AuspiciousHour): boolean => {
  const start = positionOf(hour.startHour);
  return now >= start && now < start + HOUR_SPAN / HOURS_PER_DAY;
};

/** Giờ tốt đang diễn ra, hoặc giờ tốt gần nhất sắp tới, tính từ giờ `currentHour` (0..24). */
export function nextGoodHour(
  hours: readonly AuspiciousHour[],
  currentHour: number,
): NextGoodHour | null {
  const now = positionOf(currentHour);
  const current = hours.find(hour => contains(now, hour));
  if (current) {
    return { isCurrent: true, hour: current };
  }
  const [nearest] = [...hours].sort(
    (first, second) => distanceTo(now, first) - distanceTo(now, second),
  );
  return nearest ? { isCurrent: false, hour: nearest } : null;
}

/** Khoảng trắng không ngắt: "Tuất 19h-21h" luôn nằm trên một dòng, chỉ xuống dòng ở " · ". */
const NBSP = '\u00A0';

/**
 * Dòng dưới dải giờ: hôm nay thì nói giờ tốt đang diễn ra / kế tiếp, ngày khác thì liệt kê
 * các giờ tốt.
 */
export function hourStripFooter(
  hours: readonly AuspiciousHour[],
  currentHour: number | null,
): string {
  const next = currentHour === null ? null : nextGoodHour(hours, currentHour);
  if (!next) {
    return hours
      .map(hour => `${hour.branch}${NBSP}${formatHourRange(hour)}`)
      .join(' · ');
  }
  const lead = next.isCurrent ? 'Đang trong giờ tốt' : 'Giờ tốt kế tiếp';
  return `${lead}: ${next.hour.branch},${NBSP}${formatHourRange(next.hour)}`;
}
