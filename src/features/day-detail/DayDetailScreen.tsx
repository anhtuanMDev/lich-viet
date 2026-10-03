import type { RootStackScreenProps } from '@app/navigation/types';
import { Screen } from '@shared/ui';
import { DayDetailContent } from './components/DayDetailContent';
import { useDayDetail } from './useDayDetail';

export function DayDetailScreen({ route }: RootStackScreenProps<'DayDetail'>) {
  const detail = useDayDetail(route.params.date);
  return (
    <Screen edges={[]}>
      <DayDetailContent detail={detail} />
    </Screen>
  );
}
