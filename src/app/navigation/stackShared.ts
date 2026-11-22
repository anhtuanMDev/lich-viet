import { Platform } from 'react-native';

import { TITLES } from './titles';

import type { HeaderAction } from './headerOptions';
import type { RootStackParamList } from './types';
import type { NavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/** Tiêu đề lớn (iOS) cho màn gốc của tab và Cài đặt. */
export const LARGE_TITLE: NativeStackNavigationOptions = {
  headerLargeTitleEnabled: Platform.OS === 'ios',
};

/** Màn trong stack của tab mở màn ở stack gốc (navigate tự chuyển lên navigator cha). */
const toRoot = (navigation: unknown) =>
  navigation as NavigationProp<RootStackParamList>;

/**
 * Nút "+" (thêm sự kiện) và nút cài đặt trên thanh tiêu đề của Hôm nay / Sự kiện.
 * "+" chỉ có trên iOS: Android dùng nút nổi (FAB).
 */
export function addAndSettingsActions(navigation: unknown): HeaderAction[] {
  const root = toRoot(navigation);
  return [
    {
      label: TITLES.addEvent,
      sfSymbol: 'plus',
      icon: 'add',
      iosOnly: true,
      onPress: () => root.navigate('EventEdit'),
    },
    {
      label: TITLES.settings,
      sfSymbol: 'gearshape',
      icon: 'settings',
      onPress: () => root.navigate('Settings'),
    },
  ];
}
