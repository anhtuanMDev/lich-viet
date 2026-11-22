import { weekdayName } from '@core/date/format';

import type { DaySummary } from '@core/lunar';

/** "Thứ hai 23/11" */
export const shortSolarDay = ({ weekday, solar }: DaySummary): string =>
  `${weekdayName(weekday)} ${String(solar.day)}/${String(solar.month)}`;
