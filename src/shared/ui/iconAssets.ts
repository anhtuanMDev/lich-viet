// File sinh tự động bởi scripts/generate-ui-icons.js - đừng sửa tay.
import type { ImageSourcePropType } from 'react-native';
import type { IconName } from './iconPaths';

export const iosIcons: Readonly<Record<IconName, ImageSourcePropType>> = {
  chevron_right: require('./icons/ios/chevron_right.png'),
  chevron_left: require('./icons/ios/chevron_left.png'),
  keyboard_arrow_down: require('./icons/ios/keyboard_arrow_down.png'),
  add: require('./icons/ios/add.png'),
  close: require('./icons/ios/close.png'),
  settings: require('./icons/ios/settings.png'),
  check: require('./icons/ios/check.png'),
  delete: require('./icons/ios/delete.png'),
  ios_share: require('./icons/ios/ios_share.png'),
  download: require('./icons/ios/download.png'),
  star: require('./icons/ios/star.png'),
  calendar_month: require('./icons/ios/calendar_month.png'),
  swap_horiz: require('./icons/ios/swap_horiz.png'),
  notifications: require('./icons/ios/notifications.png'),
  remove: require('./icons/ios/remove.png'),
  open_in_new: require('./icons/ios/open_in_new.png'),
};

export const androidIcons: Readonly<Record<IconName, ImageSourcePropType>> = {
  chevron_right: require('./icons/android/chevron_right.png'),
  chevron_left: require('./icons/android/chevron_left.png'),
  keyboard_arrow_down: require('./icons/android/keyboard_arrow_down.png'),
  add: require('./icons/android/add.png'),
  close: require('./icons/android/close.png'),
  settings: require('./icons/android/settings.png'),
  check: require('./icons/android/check.png'),
  delete: require('./icons/android/delete.png'),
  ios_share: require('./icons/android/ios_share.png'),
  download: require('./icons/android/download.png'),
  star: require('./icons/android/star.png'),
  calendar_month: require('./icons/android/calendar_month.png'),
  swap_horiz: require('./icons/android/swap_horiz.png'),
  notifications: require('./icons/android/notifications.png'),
  remove: require('./icons/android/remove.png'),
  open_in_new: require('./icons/android/open_in_new.png'),
};
