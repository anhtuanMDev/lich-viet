import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { runInBackground } from '@shared/async/runInBackground';
import { ActionRow, Section } from '@shared/ui';

import { androidDeliveryInfo, deviceSettings } from '../notifier';

import type { AndroidDeliveryInfo } from '../notifier';

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

  const footer = [
    info.exactAlarmsDisabled
      ? 'Quyền “Báo thức và lời nhắc” đang tắt nên thông báo có thể đến trễ vài phút.'
      : null,
    info.batteryOptimized
      ? `Máy${brand} đang tiết kiệm pin cho Lịch Việt và có thể chặn nhắc lịch khi app không mở. Hãy chọn “Không hạn chế” cho Lịch Việt${
          powerManager ? ' và bật “Tự khởi chạy”' : ''
        }.`
      : null,
    info.batteryOptimized && powerManager === 'appSettings'
      ? 'Trong trang ứng dụng, vào mục Pin rồi bật “Cho phép hoạt động nền” và “Cho phép tự khởi chạy”.'
      : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Section title="Để nhắc lịch đúng giờ" footer={footer}>
      {info.exactAlarmsDisabled ? (
        <ActionRow
          materialIcon="settings"
          label="Cho phép báo thức chính xác"
          onPress={() =>
            runInBackground(deviceSettings.openExactAlarm(), 'reminders')
          }
        />
      ) : null}
      {info.batteryOptimized ? (
        <ActionRow
          materialIcon="settings"
          label="Tắt tối ưu pin"
          onPress={() =>
            runInBackground(
              deviceSettings.openBatteryOptimization(),
              'reminders',
            )
          }
        />
      ) : null}
      {info.batteryOptimized && powerManager ? (
        <ActionRow
          materialIcon="settings"
          label={
            powerManager === 'appSettings'
              ? 'Mở cài đặt pin của Lịch Việt'
              : `Mở quản lý pin${brand}`
          }
          onPress={() =>
            runInBackground(
              deviceSettings.openPowerManager(powerManager),
              'reminders',
            )
          }
        />
      ) : null}
    </Section>
  );
}
