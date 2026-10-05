import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { AppText, Button, Card } from '@shared/ui';
import { androidDeliveryInfo, deviceSettings } from '../notifier';
import type { AndroidDeliveryInfo } from '../notifier';
import { runInBackground } from '@shared/async/runInBackground';

/**
 * Chỉ hiện trên Android khi có thứ có thể làm thông báo đến trễ/mất: quyền báo thức chính xác
 * bị tắt, hoặc máy đang tối ưu pin cho app (đặc biệt Xiaomi, Oppo, Vivo, Samsung…).
 */
export function AndroidDeliveryCard() {
  const [info, setInfo] = useState<AndroidDeliveryInfo | null>(null);

  const refresh = useCallback(() => {
    androidDeliveryInfo().then(setInfo, () => setInfo(null));
  }, []);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  if (!info || (!info.exactAlarmsDisabled && !info.batteryOptimized)) {
    return null;
  }
  const brand = info.manufacturer ? ` ${info.manufacturer}` : '';
  const { powerManager } = info;

  return (
    <Card title="Để nhắc lịch đúng giờ">
      {info.exactAlarmsDisabled ? (
        <>
          <AppText color="textMuted">
            Quyền “Báo thức và lời nhắc” đang tắt nên thông báo có thể đến trễ
            vài phút.
          </AppText>
          <Button
            label="Cho phép báo thức chính xác"
            variant="secondary"
            onPress={() =>
              runInBackground(deviceSettings.openExactAlarm(), 'reminders')
            }
          />
        </>
      ) : null}
      {info.batteryOptimized ? (
        <>
          <AppText color="textMuted">
            Máy{brand} đang tiết kiệm pin cho Lịch Việt và có thể chặn nhắc lịch
            khi app không mở. Hãy chọn “Không hạn chế” cho Lịch Việt
            {powerManager ? ' và bật “Tự khởi chạy”' : ''}.
          </AppText>
          <Button
            label="Tắt tối ưu pin"
            variant="secondary"
            onPress={() =>
              runInBackground(
                deviceSettings.openBatteryOptimization(),
                'reminders',
              )
            }
          />
          {powerManager === 'appSettings' ? (
            <AppText color="textMuted">
              Trong trang ứng dụng, vào mục Pin rồi bật “Cho phép hoạt động
              nền” và “Cho phép tự khởi chạy”.
            </AppText>
          ) : null}
          {powerManager ? (
            <Button
              label={
                powerManager === 'appSettings'
                  ? 'Mở cài đặt pin của Lịch Việt'
                  : `Mở quản lý pin${brand}`
              }
              variant="secondary"
              onPress={() =>
                runInBackground(
                  deviceSettings.openPowerManager(powerManager),
                  'reminders',
                )
              }
            />
          ) : null}
        </>
      ) : null}
    </Card>
  );
}
