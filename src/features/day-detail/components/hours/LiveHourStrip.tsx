import { useVietnamHourNow } from '../../hooks/useVietnamHourNow';

import { HourStripView } from './HourStripView';

import type { AuspiciousHour } from '@core/lunar';

/** Dải giờ của hôm nay: vạch "bây giờ" chạy theo giờ Việt Nam. */
export function LiveHourStrip({
  hours,
}: {
  readonly hours: readonly AuspiciousHour[];
}) {
  return <HourStripView hours={hours} currentHour={useVietnamHourNow()} />;
}
