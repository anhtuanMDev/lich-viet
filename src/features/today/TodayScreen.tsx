import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { View } from 'react-native';

import { DayDetailContent, useDayDetail } from '@features/day-detail';
import { useToday } from '@shared/hooks/useToday';
import { createThemedStyles } from '@shared/theme';
import { Fab, Screen } from '@shared/ui';

import { UpcomingSection } from './UpcomingSection';

export function TodayScreen() {
  const styles = useStyles();
  const navigation = useNavigation();
  const today = useToday();
  const detail = useDayDetail(today);
  const addEvent = useCallback(
    () => navigation.navigate('EventEdit', { date: today }),
    [navigation, today],
  );
  return (
    <View style={styles.root}>
      <Screen fabSpace inTabs>
        <DayDetailContent
          detail={detail}
          isToday
          todayScreen
          afterHeader={<UpcomingSection todayJd={detail.jd} />}
        />
      </Screen>
      <Fab icon="add" label="Thêm sự kiện" onPress={addEvent} />
    </View>
  );
}

const useStyles = createThemedStyles(() => ({
  root: {
    flex: 1,
  },
}));
