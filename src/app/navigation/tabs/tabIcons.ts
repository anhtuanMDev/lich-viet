import { Platform } from 'react-native';

import calendarIcon from '../icons/tab-calendar.png';
import converterIcon from '../icons/tab-converter.png';
import eventsIcon from '../icons/tab-events.png';
import todayIcon from '../icons/tab-today.png';

import type { NativeBottomTabNavigationOptions } from '@react-navigation/bottom-tabs/unstable';
import type { ImageSourcePropType } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

type TabIcon = NativeBottomTabNavigationOptions['tabBarIcon'];

/** iOS: SF Symbols (bản tô đặc khi chọn). Android: ảnh PNG Material, thanh tab tự tô màu. */
function tabIcon(
  symbols: { readonly outline: SFSymbol; readonly filled: SFSymbol },
  androidImage: ImageSourcePropType,
): TabIcon {
  if (Platform.OS === 'ios') {
    return ({ focused }) => ({
      type: 'sfSymbol',
      name: focused ? symbols.filled : symbols.outline,
    });
  }
  return { type: 'image', source: androidImage };
}

const MOON = 'moonphase.first.quarter';
const SWAP = 'arrow.left.arrow.right';

/** "Hôm nay" là nửa vầng trăng - dấu hiệu riêng của app. */
export const TAB_ICONS = {
  today: tabIcon({ outline: MOON, filled: MOON }, todayIcon),
  calendar: tabIcon({ outline: 'calendar', filled: 'calendar' }, calendarIcon),
  events: tabIcon({ outline: 'star', filled: 'star.fill' }, eventsIcon),
  converter: tabIcon({ outline: SWAP, filled: SWAP }, converterIcon),
} as const;
