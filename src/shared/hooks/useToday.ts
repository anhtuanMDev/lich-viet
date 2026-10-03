import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { isSameSolarDate } from '@core/lunar';
import type { SolarDate } from '@core/lunar';
import {
  msUntilNextVietnamMidnight,
  todayInVietnam,
} from '@core/date/vietnamTime';

/**
 * "Hôm nay" theo giờ Việt Nam, tự cập nhật lúc nửa đêm và khi app quay lại foreground
 * (timer JS không chạy khi app ở nền). Giữ nguyên tham chiếu nếu ngày không đổi
 * để các component memo không render lại.
 */
export function useToday(): SolarDate {
  const [today, setToday] = useState(todayInVietnam);

  useEffect(() => {
    const refresh = () =>
      setToday(prev => {
        const next = todayInVietnam();
        return isSameSolarDate(prev, next) ? prev : next;
      });

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        refresh();
        schedule();
      }, msUntilNextVietnamMidnight() + 1000);
    };
    schedule();

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  return today;
}
