import { NativeModules, Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { TODAY_WIDGET_NAME, renderTodayWidget } from './android/TodayWidget';
import { IOS_SNAPSHOT_DAYS, currentSnapshot } from './widgetData';

interface WidgetBridgeModule {
  /** Ghi JSON vào App Group và yêu cầu WidgetKit vẽ lại. */
  setSnapshot(json: string): Promise<void>;
}

const widgetBridge = NativeModules.WidgetBridge as
  | WidgetBridgeModule
  | undefined;

/** Đẩy dữ liệu mới nhất cho widget trên màn hình chính (nếu người dùng có đặt widget). */
export async function syncWidgets(): Promise<void> {
  if (Platform.OS === 'android') {
    const [today] = currentSnapshot(1).days;
    if (today) {
      await requestWidgetUpdate({
        widgetName: TODAY_WIDGET_NAME,
        renderWidget: info => renderTodayWidget(today, info.width),
      });
    }
    return;
  }
  if (Platform.OS === 'ios' && widgetBridge) {
    await widgetBridge.setSnapshot(
      JSON.stringify(currentSnapshot(IOS_SNAPSHOT_DAYS)),
    );
  }
}
