import { DayDetailContent, useDayDetail } from '@features/day-detail';
import { useToday } from '@shared/hooks/useToday';
import { Screen } from '@shared/ui';

export function TodayScreen() {
  const today = useToday();
  const detail = useDayDetail(today);
  return (
    <Screen>
      <DayDetailContent detail={detail} />
    </Screen>
  );
}
