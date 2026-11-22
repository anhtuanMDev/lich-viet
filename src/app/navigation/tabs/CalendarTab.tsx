import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { CalendarScreen } from '@features/calendar';

import { useStackOptions } from '../hooks/useStackOptions';
import { TITLES } from '../titles';

import type { CalendarStackParamList } from '../types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

/**
 * iPad: thanh tab của iPadOS nổi ở trên cùng, đè lên tiêu đề tháng nếu không có thanh tiêu đề.
 * Thanh tiêu đề trống (không chữ, không viền) chừa đúng chỗ đó. iPhone / Android thì ẩn.
 */
const CALENDAR_HOME_OPTIONS: NativeStackNavigationOptions = {
  headerShown: Platform.OS === 'ios' && Platform.isPad,
  headerTitle: '',
  headerShadowVisible: false,
  title: TITLES.calendar,
};

export function CalendarTab() {
  const screenOptions = useStackOptions();
  return (
    <CalendarStack.Navigator screenOptions={screenOptions}>
      {/* Tiêu đề tháng nằm trong nội dung: bấm để chọn tháng, vuốt để đổi tháng. */}
      <CalendarStack.Screen
        name="CalendarHome"
        component={CalendarScreen}
        options={CALENDAR_HOME_OPTIONS}
      />
    </CalendarStack.Navigator>
  );
}
