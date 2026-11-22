import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TodayScreen } from '@features/today';

import { headerActions } from '../headerOptions';
import { useStackOptions } from '../hooks/useStackOptions';
import { LARGE_TITLE, addAndSettingsActions } from '../stackShared';
import { TITLES } from '../titles';

import type { TodayStackParamList } from '../types';

const TodayStack = createNativeStackNavigator<TodayStackParamList>();

export function TodayTab() {
  const screenOptions = useStackOptions();
  return (
    <TodayStack.Navigator screenOptions={screenOptions}>
      <TodayStack.Screen
        name="TodayHome"
        component={TodayScreen}
        options={({ navigation }) => ({
          ...LARGE_TITLE,
          title: TITLES.today,
          ...headerActions(addAndSettingsActions(navigation)),
        })}
      />
    </TodayStack.Navigator>
  );
}
