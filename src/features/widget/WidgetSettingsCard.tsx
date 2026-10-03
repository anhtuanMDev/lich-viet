import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { requestPinWidget } from 'react-native-android-widget';
import { AppText, Button, Card } from '@shared/ui';
import { TODAY_WIDGET_NAME } from './android/TodayWidget';

const IOS_GUIDE =
  'Giữ ngón tay trên màn hình chính → bấm “Sửa” → “Thêm tiện ích” → tìm “Lịch Việt”. ' +
  'Cỡ nhỏ hiện ngày hôm nay, cỡ vừa có thêm sự kiện sắp tới.';

const ANDROID_FALLBACK =
  'Trình khởi chạy của máy không hỗ trợ thêm tự động. Giữ ngón tay trên màn hình chính → ' +
  '“Tiện ích” → tìm “Lịch Việt”.';

export function WidgetSettingsCard() {
  const [fallback, setFallback] = useState(false);

  const pinWidget = useCallback(async () => {
    const accepted = await requestPinWidget({
      widgetName: TODAY_WIDGET_NAME,
    }).catch(() => false);
    setFallback(!accepted);
  }, []);

  return (
    <Card title="Widget màn hình chính">
      {Platform.OS === 'ios' ? (
        <AppText color="textMuted">{IOS_GUIDE}</AppText>
      ) : (
        <>
          <AppText color="textMuted">
            Xem ngày âm và sự kiện sắp tới ngay trên màn hình chính. Kéo rộng
            widget để hiện thêm danh sách sắp tới.
          </AppText>
          <Button label="Thêm widget" variant="secondary" onPress={pinWidget} />
          {fallback ? (
            <AppText color="textMuted">{ANDROID_FALLBACK}</AppText>
          ) : null}
        </>
      )}
    </Card>
  );
}
