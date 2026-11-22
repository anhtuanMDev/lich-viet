import { HourStripView } from './hours/HourStripView';
import { LiveHourStrip } from './hours/LiveHourStrip';

import type { AuspiciousHour } from '@core/lunar';

/** Giờ hoàng đạo của một ngày; hôm nay thì có thêm giờ hiện tại. */
export function HourStrip({
  hours,
  isToday,
}: {
  readonly hours: readonly AuspiciousHour[];
  readonly isToday: boolean;
}) {
  return isToday ? (
    <LiveHourStrip hours={hours} />
  ) : (
    <HourStripView hours={hours} currentHour={null} />
  );
}
