import { DayEventsSection } from '@features/events';

import { DayHeader } from './DayHeader';
import { DayInfoSection } from './DayInfoSection';
import { HourStrip } from './HourStrip';

import type { DayDetail } from '@core/lunar';
import type { ReactNode } from 'react';

export interface DayDetailContentProps {
  readonly detail: DayDetail;
  /** Ngày đang xem là hôm nay: hiện vạch giờ hiện tại và giờ tốt kế tiếp. */
  readonly isToday?: boolean;
  /**
   * Màn Hôm nay: ẩn mục sự kiện khi trống (thêm sự kiện bằng nút + trên thanh tiêu đề / FAB).
   * Chi tiết ngày luôn có hàng "Thêm sự kiện vào ngày này".
   */
  readonly todayScreen?: boolean;
  /** Chèn ngay dưới phần đầu (màn Hôm nay đặt mục "Sắp tới" ở đây). */
  readonly afterHeader?: ReactNode;
  /** Hiện trong sheet: chừa chỗ cho thanh kéo phía trên. */
  readonly inSheet?: boolean;
}

export function DayDetailContent({
  detail,
  isToday = false,
  todayScreen = false,
  afterHeader,
  inSheet = false,
}: DayDetailContentProps) {
  return (
    <>
      <DayHeader detail={detail} inSheet={inSheet} />
      <DayEventsSection
        jd={detail.jd}
        title={todayScreen ? 'Sự kiện hôm nay' : 'Sự kiện'}
        hideWhenEmpty={todayScreen}
      />
      {afterHeader}
      <DayInfoSection detail={detail} />
      <HourStrip hours={detail.auspiciousHours} isToday={isToday} />
    </>
  );
}
