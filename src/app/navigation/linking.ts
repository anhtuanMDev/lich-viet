import { Linking } from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import { toIsoDate } from '@core/date/format';
import { parseIsoDate } from '@core/date/parse';
import { todayInVietnam } from '@core/date/vietnamTime';
import {
  initialNotificationUrl,
  onNotificationPress,
} from '@features/reminders/notifier';
import type { RootStackParamList } from './types';

/**
 * lichviet://today · calendar · events · convert · settings · event/new · day/2026-10-03
 * Dùng cho widget và thông báo nhắc lịch để mở thẳng tới đúng ngày.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['lichviet://'],
  // Mở app bằng link hoặc bằng cách bấm thông báo nhắc lịch (cả lúc app đã tắt hẳn).
  async getInitialURL() {
    return (await Linking.getInitialURL()) ?? (await initialNotificationUrl());
  },
  subscribe(listener) {
    const linkSubscription = Linking.addEventListener('url', ({ url }) =>
      listener(url),
    );
    const unsubscribeNotification = onNotificationPress(listener);
    return () => {
      linkSubscription.remove();
      unsubscribeNotification();
    };
  },
  config: {
    // Mở thẳng một màn hình con (VD settings, day/…) vẫn có Tabs bên dưới để quay lại.
    initialRouteName: 'Tabs',
    screens: {
      Tabs: {
        screens: {
          Today: 'today',
          Calendar: 'calendar',
          Events: 'events',
          Converter: 'convert',
        },
      },
      DayDetail: {
        path: 'day/:date',
        // Link hỏng (ngày sai) thì mở ngày hôm nay thay vì crash.
        parse: {
          date: (value: string) => parseIsoDate(value) ?? todayInVietnam(),
        },
        stringify: { date: toIsoDate },
      },
      EventEdit: 'event/new',
      Settings: 'settings',
    },
  },
};
