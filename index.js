/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import BackgroundFetch from 'react-native-background-fetch';
import notifee from 'react-native-notify-kit';
import { App } from './src/app/App';
import { initCrashReporting } from './src/shared/crash';
import { backgroundSyncHeadlessTask } from './src/app/background/backgroundSync';
import { widgetTaskHandler } from './src/features/widget/android/widgetTaskHandler';
import { name as appName } from './app.json';

// Trước mọi thứ khác: bắt cả lỗi xảy ra trong tác vụ nền / headless.
initCrashReporting();

// Bấm thông báo khi app ở nền: app được mở lại và linking xử lý điều hướng,
// nên ở đây không cần làm gì - nhưng thư viện yêu cầu phải đăng ký handler.
notifee.onBackgroundEvent(async () => {});

// Android: đồng bộ lịch nhắc + widget cả khi app đã bị tắt.
BackgroundFetch.registerHeadlessTask(backgroundSyncHeadlessTask);

// Android: vẽ widget màn hình chính (chạy headless, không mở app).
registerWidgetTaskHandler(widgetTaskHandler);

AppRegistry.registerComponent(appName, () => App);
