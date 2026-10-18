import { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImportBackupScreen } from '@features/backup';
import { CalendarScreen } from '@features/calendar';
import { ConverterScreen } from '@features/converter';
import { DayDetailScreen } from '@features/day-detail';
import { EventEditScreen, EventsScreen } from '@features/events';
import { SettingsScreen } from '@features/settings';
import { TodayScreen } from '@features/today';
import { useTheme } from '@shared/theme';
import { TabIcon, TabLabel } from './TabIcon';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// iOS mặc định đọc "Lịch, tab, 2 of 4" (tiếng Anh); nhãn riêng để chỉ đọc tên tab.
const tabOptions = (
  title: string,
  tabBarIcon: BottomTabNavigationOptions['tabBarIcon'],
): BottomTabNavigationOptions => ({
  title,
  tabBarIcon,
  tabBarAccessibilityLabel: title,
});

/** Khoảng đệm thêm dưới thanh tab, ngoài vùng an toàn (thanh điều hướng hệ thống). */
const TAB_BAR_EXTRA_BOTTOM = 8;

function Tabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  // Cộng vào inset (thay vì paddingBottom trong tabBarStyle) để thanh tab tự cao thêm,
  // không ép icon/nhãn.
  const safeAreaInsets = useMemo(
    () => ({ bottom: insets.bottom + TAB_BAR_EXTRA_BOTTOM }),
    [insets.bottom],
  );
  const screenOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textFaint,
      tabBarLabel: TabLabel,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
      },
    }),
    [colors],
  );

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      safeAreaInsets={safeAreaInsets}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={tabOptions('Hôm nay', TabIcon.today)}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={tabOptions('Lịch', TabIcon.calendar)}
      />

      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={tabOptions('Sự kiện', TabIcon.events)}
      />
      <Tab.Screen
        name="Converter"
        component={ConverterScreen}
        options={tabOptions('Đổi ngày', TabIcon.converter)}
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
