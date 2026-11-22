import { todayInVietnam } from '@core/date/vietnamTime';
import { isSameSolarDate } from '@core/lunar';
import { Screen } from '@shared/ui';

import { DayDetailContent } from './components/DayDetailContent';
import { useDayDetail } from './useDayDetail';

import type { RootStackScreenProps } from '@app/navigation/types';

export function DayDetailScreen({ route }: RootStackScreenProps<'DayDetail'>) {
  const detail = useDayDetail(route.params.date);
  return (
    <Screen>
      <DayDetailContent
        detail={detail}
        inSheet
        // Sheet mở ngắn, không cần tự đổi khi qua nửa đêm như màn Hôm nay.
        isToday={isSameSolarDate(route.params.date, todayInVietnam())}
      />
    </Screen>
  );
}
