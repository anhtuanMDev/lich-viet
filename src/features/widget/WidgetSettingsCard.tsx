import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { requestPinWidget } from 'react-native-android-widget';

import { ActionRow, Section } from '@shared/ui';

import { TODAY_WIDGET_NAME } from './android/TodayWidget';

const IOS_GUIDE =
  'Giữ ngón tay trên màn hình chính, bấm “Sửa” rồi “Thêm tiện ích” và tìm “Lịch Việt”. ' +
  'Cỡ nhỏ hiện ngày hôm nay, cỡ vừa có thêm sự kiện sắp tới.';

const ANDROID_GUIDE =
  'Xem ngày âm và sự kiện sắp tới ngay trên màn hình chính. Kéo rộng widget để hiện thêm danh sách sắp tới.';

const ANDROID_FALLBACK =
  'Trình khởi chạy của máy không hỗ trợ thêm tự động. Giữ ngón tay trên màn hình chính, chọn “Tiện ích” và tìm “Lịch Việt”.';

export function WidgetSettingsCard() {
  const [fallback, setFallback] = useState(false);

  const pinWidget = useCallback(async () => {
    const accepted = await requestPinWidget({
      widgetName: TODAY_WIDGET_NAME,
    }).catch(() => false);
    setFallback(!accepted);
  }, []);

  if (Platform.OS === 'ios') {
    return <Section title="Widget màn hình chính" footer={IOS_GUIDE} />;
  }
  return (
    <Section
      title="Widget màn hình chính"
      footer={fallback ? ANDROID_FALLBACK : ANDROID_GUIDE}
    >
      <ActionRow label="Thêm widget" materialIcon="add" onPress={pinWidget} />
    </Section>
  );
}
