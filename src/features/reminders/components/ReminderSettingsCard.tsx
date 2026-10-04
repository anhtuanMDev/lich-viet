import { useCallback } from 'react';
import type { LunarPhaseReminder } from '@core/reminders';
import {
  updateReminderSettings,
  useSettings,
} from '@features/settings/settingsStore';
import {
  AppText,
  Button,
  Card,
  SegmentedControl,
  TimeStepper,
} from '@shared/ui';
import type { SegmentOption, TimeValue } from '@shared/ui';
import { notifier } from '../notifier';
import {
  ensureNotificationPermission,
  useNotificationPermission,
} from '../permission';
import { runInBackground } from '@shared/async/runInBackground';

const LUNAR_PHASE_OPTIONS: readonly SegmentOption<LunarPhaseReminder>[] = [
  { value: 'off', label: 'Tắt' },
  { value: 'sameDay', label: 'Đúng ngày' },
  { value: 'dayBefore', label: 'Trước 1 ngày' },
];

export function ReminderSettingsCard() {
  const { reminders } = useSettings();
  const permission = useNotificationPermission();

  const setTime = useCallback(
    (time: TimeValue) => updateReminderSettings({ time }),
    [],
  );
  const setLunarPhase = useCallback((lunarPhase: LunarPhaseReminder) => {
    updateReminderSettings({ lunarPhase });
    if (lunarPhase !== 'off') {
      runInBackground(ensureNotificationPermission(), 'reminders');
    }
  }, []);

  const sendTest = useCallback(async () => {
    if (await ensureNotificationPermission()) {
      await notifier.showNow({
        title: 'Lịch Việt',
        body: 'Thông báo đang hoạt động. Bạn sẽ được nhắc vào giờ đã chọn.',
        url: 'lichviet://today',
      });
    }
  }, []);

  return (
    <Card title="Nhắc lịch">
      {permission.state === 'denied' || permission.state === 'undetermined' ? (
        <>
          <AppText color="holiday">
            {permission.state === 'denied'
              ? 'Thông báo đang bị tắt - bạn sẽ không nhận được lời nhắc.'
              : 'Chưa bật thông báo.'}
          </AppText>
          <Button
            label="Bật thông báo"
            variant="secondary"
            onPress={permission.request}
          />
        </>
      ) : null}

      <AppText variant="label" color="textMuted">
        Giờ nhắc mỗi ngày
      </AppText>
      <TimeStepper label="Giờ nhắc" value={reminders.time} onChange={setTime} />

      <AppText variant="label" color="textMuted">
        Nhắc mùng 1 và rằm
      </AppText>
      <SegmentedControl
        options={LUNAR_PHASE_OPTIONS}
        value={reminders.lunarPhase}
        onChange={setLunarPhase}
      />

      <AppText variant="label" color="textMuted">
        Nhắc từng sự kiện được chọn khi thêm/sửa sự kiện. Mọi lời nhắc trong
        cùng một ngày gộp thành một thông báo.
      </AppText>
      <Button
        label="Gửi thông báo thử"
        variant="secondary"
        onPress={sendTest}
      />
    </Card>
  );
}
