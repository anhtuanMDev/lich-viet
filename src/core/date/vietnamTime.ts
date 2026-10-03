import { VIETNAM_TIMEZONE } from '@core/lunar';
import type { MonthNumber, SolarDate } from '@core/lunar';

const MS_PER_HOUR = 3_600_000;

/**
 * Ngày hiện tại theo giờ Việt Nam (UTC+7, không có giờ mùa hè), bất kể múi giờ
 * đang cài trên máy – người dùng ở nước ngoài vẫn thấy đúng ngày âm ở quê nhà.
 */
export function todayInVietnam(now: number = Date.now()): SolarDate {
  const shifted = new Date(now + VIETNAM_TIMEZONE * MS_PER_HOUR);
  return {
    year: shifted.getUTCFullYear(),
    month: (shifted.getUTCMonth() + 1) as MonthNumber,
    day: shifted.getUTCDate(),
  };
}

/** Số mili-giây tới 0h ngày hôm sau theo giờ Việt Nam – dùng để đổi "hôm nay" đúng lúc nửa đêm. */
export function msUntilNextVietnamMidnight(now: number = Date.now()): number {
  const msPerDay = 24 * MS_PER_HOUR;
  const local = now + VIETNAM_TIMEZONE * MS_PER_HOUR;
  return msPerDay - (((local % msPerDay) + msPerDay) % msPerDay);
}
