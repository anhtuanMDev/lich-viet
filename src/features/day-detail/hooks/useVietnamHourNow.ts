import { useEffect, useState } from 'react';

import { vietnamHourNow } from '@core/date/vietnamTime';

const MINUTE_MS = 60_000;

/** Giờ hiện tại theo giờ Việt Nam (có phần lẻ), cập nhật mỗi phút. */
export function useVietnamHourNow(): number {
  const [hour, setHour] = useState(vietnamHourNow);
  useEffect(() => {
    const timer = setInterval(() => setHour(vietnamHourNow()), MINUTE_MS);
    return () => clearInterval(timer);
  }, []);
  return hour;
}
