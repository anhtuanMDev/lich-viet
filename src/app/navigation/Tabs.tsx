import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { useMemo } from 'react';
import { Platform } from 'react-native';

import { useTheme } from '@shared/theme';

import { CalendarTab } from './tabs/CalendarTab';
import { ConverterTab } from './tabs/ConverterTab';
import { EventsTab } from './tabs/EventsTab';
import { TAB_ICONS } from './tabs/tabIcons';
import { TodayTab } from './tabs/TodayTab';
import { TITLES } from './titles';

import type { TabParamList } from './types';
import type { NativeBottomTabNavigationOptions } from '@react-navigation/bottom-tabs/unstable';
import type { ColorTokens } from '@shared/theme';

const Tab = createNativeBottomTabNavigator<TabParamList>();

/** iOS: thanh tab hệ thống chỉ cần màu nhấn. Android: màu thanh điều hướng Material 3. */
function tabBarOptions(colors: ColorTokens): NativeBottomTabNavigationOptions {
  if (Platform.OS === 'ios') {
    return { headerShown: false, tabBarActiveTintColor: colors.primary };
  }
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.onSecondaryContainer,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarActiveIndicatorColor: colors.secondaryContainer,
    tabBarLabelVisibilityMode: 'labeled',
    tabBarStyle: { backgroundColor: colors.surface },
  };
}

/** Thanh tab native: UITabBar (iOS 26: Liquid Glass) / thanh điều hướng Material 3. */
export function Tabs() {
  const { colors } = useTheme();
  const screenOptions = useMemo(() => tabBarOptions(colors), [colors]);
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Today"
        component={TodayTab}
        options={{ title: TITLES.today, tabBarIcon: TAB_ICONS.today }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarTab}
        options={{ title: TITLES.calendar, tabBarIcon: TAB_ICONS.calendar }}
      />
      <Tab.Screen
        name="Events"
        component={EventsTab}
        options={{ title: TITLES.events, tabBarIcon: TAB_ICONS.events }}
      />
      <Tab.Screen
        name="Converter"
        component={ConverterTab}
        options={{ title: TITLES.converter, tabBarIcon: TAB_ICONS.converter }}
      />
    </Tab.Navigator>
  );
}
