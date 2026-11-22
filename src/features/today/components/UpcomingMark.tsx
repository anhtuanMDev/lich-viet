import { upcomingMarkOf } from '@core/events';
import { EventDot } from '@features/events';
import { HolidayMark, MoonMark } from '@shared/ui';

import type { UpcomingItem } from '@core/events';

/** Ký hiệu cỡ hàng danh sách: đủ lớn để phân biệt vòng rỗng và đĩa đặc. */
const MARK_SIZE = 12;

/**
 * Ký hiệu đầu hàng "Sắp tới", cùng bộ với lưới lịch và widget: chấm đặc = sự kiện,
 * đĩa trăng = rằm, vòng màu trăng = mùng 1, vòng đỏ = ngày lễ.
 */
export function UpcomingMark({ item }: { readonly item: UpcomingItem }) {
  switch (upcomingMarkOf(item)) {
    case 'event':
      return <EventDot />;
    case 'fullMoon':
      return <MoonMark kind="full" size={MARK_SIZE} />;
    case 'newMoon':
      return <MoonMark kind="new" size={MARK_SIZE} />;
    case 'holiday':
      return <HolidayMark size={MARK_SIZE} />;
  }
}
