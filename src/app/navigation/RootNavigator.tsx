import { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImportBackupScreen } from '@features/backup';
import { CalendarScreen } from '@features/calendar';
import { ConverterScreen } from '@features/converter';
import { DayDetailScreen } from '@features/day-detail';
import { EventEditScreen, EventsScreen } from '@features/events';
import { SettingsScreen } from '@features/settings';
import { TodayScreen } from '@features/today';
import { useTheme } from '@shared/theme';
import { TabIcon } from './TabIcon';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const { colors } = useTheme();
  const screenOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textFaint,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
      },
    }),
    [colors],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{ title: 'Hôm nay', tabBarIcon: TabIcon.today }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Lịch', tabBarIcon: TabIcon.calendar }}
      />

      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: 'Sự kiện', tabBarIcon: TabIcon.events }}
      />
      <Tab.Screen
        name="Converter"
        component={ConverterScreen}
        options={{ title: 'Đổi ngày', tabBarIcon: TabIcon.converter }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.75, 1],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EventEdit"
        component={EventEditScreen}
        options={({ route }) => ({
          presentation: 'modal',
          title: route.params?.eventId ? 'Sửa sự kiện' : 'Thêm sự kiện',
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
      <Stack.Screen
        name="ImportBackup"
        component={ImportBackupScreen}
        options={{ title: 'Nhập dữ liệu' }}
      />
    </Stack.Navigator>
  );
}
