import { todayInVietnam } from '@core/date/vietnamTime';
import { toJulianDay } from '@core/lunar';
import { buildWidgetSnapshot } from '@core/widget';
import type { WidgetSnapshot } from '@core/widget';
import { eventRepository } from '@features/events/eventRepository';

/**
 * iOS: widget không chạy JS nên app tính sẵn nhiều ngày; WidgetKit tự chuyển sang
 * ngày kế tiếp lúc nửa đêm. Hết dữ liệu (lâu không mở app) thì widget nhắc mở app.
 * Android: widget vẽ lại bằng JS mỗi lần cập nhật nên chỉ cần ngày hôm nay.
 */
export const IOS_SNAPSHOT_DAYS = 60;

export function currentSnapshot(
  days: number,
  now: number = Date.now(),
): WidgetSnapshot {
  return buildWidgetSnapshot(
    eventRepository.list(),
    toJulianDay(todayInVietnam(now)),
    days,
    new Date(now),
  );
}
