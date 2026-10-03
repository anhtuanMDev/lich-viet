import { useMemo } from 'react';
import { getDayDetail } from '@core/lunar';
import type { DayDetail, SolarDate } from '@core/lunar';

/** Chỉ tính lại khi ngày thực sự đổi (so theo giá trị, không theo tham chiếu object). */
export function useDayDetail({ year, month, day }: SolarDate): DayDetail {
  return useMemo(() => getDayDetail({ year, month, day }), [year, month, day]);
}
