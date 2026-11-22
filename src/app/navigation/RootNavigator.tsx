import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { ImportBackupScreen } from '@features/backup';
import { DayDetailScreen } from '@features/day-detail';
import { EventEditScreen } from '@features/events';
import { SettingsScreen } from '@features/settings';

import { useStackOptions } from './hooks/useStackOptions';
import { LARGE_TITLE } from './stackShared';
import { Tabs } from './Tabs';
import { TITLES } from './titles';

import type { RootStackParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Chi tiết ngày: sheet kéo được, mở 3/4 màn hình. Android bo 28dp như bottom sheet Material. */
const DAY_SHEET: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: [0.75, 1],
  sheetGrabberVisible: true,
  sheetCornerRadius: Platform.select({ android: 28 }),
  headerShown: false,
};

export function RootNavigator() {
  const screenOptions = useStackOptions();
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={DAY_SHEET}
      />
      <Stack.Screen
        name="EventEdit"
        component={EventEditScreen}
        options={({ route }) => ({
          presentation: 'modal',
          title: route.params?.eventId ? TITLES.editEvent : TITLES.addEvent,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ ...LARGE_TITLE, title: TITLES.settings }}
      />
      <Stack.Screen
        name="ImportBackup"
        component={ImportBackupScreen}
        options={{ title: TITLES.importBackup }}
      />
    </Stack.Navigator>
  );
}
