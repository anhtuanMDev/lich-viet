import { useCallback, useEffect, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { deviceSettings, notifier } from './notifier';
import type { PermissionState } from './notifier';
import { syncReminders } from './syncReminders';
import { runInBackground } from '@shared/async/runInBackground';

function explainDenied(): void {
  Alert.alert(
    'Thông báo đang bị tắt',
    'Bật thông báo cho Lịch Việt trong Cài đặt của máy để nhận nhắc lịch.',
    [
      { text: 'Để sau', style: 'cancel' },
      {
        text: 'Mở Cài đặt',
        onPress: () => runInBackground(deviceSettings.openApp(), 'reminders'),
      },
    ],
  );
}

/**
 * Xin quyền đúng lúc người dùng bật một lời nhắc (không xin ngay khi mở app).
 *
 * Luôn gọi xin quyền khi chưa có: Android vẫn cho hỏi lại sau lần từ chối đầu, còn khi
 * người dùng đã chặn hẳn thì hệ điều hành trả về ngay mà không hiện gì (iOS cũng vậy).
 * Chỉ khi vẫn không được mới hướng dẫn mở Cài đặt của máy.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if ((await notifier.permission()) === 'granted') {
    return true;
  }
  if ((await notifier.requestPermission()) === 'granted') {
    // Vừa được cấp quyền: dữ liệu không đổi nên không có gì khác kích hoạt đồng bộ.
    runInBackground(syncReminders(), 'reminders');
    return true;
  }
  explainDenied();
  return false;
}

/** Trạng thái quyền thông báo, tự cập nhật khi người dùng quay lại từ Cài đặt của máy. */
export function useNotificationPermission() {
  const [state, setState] = useState<PermissionState | null>(null);

  const refresh = useCallback(() => {
    notifier.permission().then(setState, () => setState('undetermined'));
  }, []);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', next => {
      if (next === 'active') {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  const request = useCallback(async () => {
    await ensureNotificationPermission();
    refresh();
  }, [refresh]);

  return { state, request };
}
