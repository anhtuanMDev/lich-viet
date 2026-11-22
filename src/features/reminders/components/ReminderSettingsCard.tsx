import { useCallback } from 'react';

import {
  updateReminderSettings,
  useSettings,
} from '@features/settings/settingsStore';
import { runInBackground } from '@shared/async/runInBackground';
import {
  ActionRow,
  FieldGroup,
  Icon,
  ListRow,
  Section,
  SegmentedControl,
  TimeStepper,
} from '@shared/ui';

import { notifier } from '../notifier';
import {
  ensureNotificationPermission,
  useNotificationPermission,
} from '../permission';

import type { LunarPhaseReminder } from '@core/reminders';
import type { SegmentOption, TimeValue } from '@shared/ui';

const LUNAR_PHASE_OPTIONS: readonly SegmentOption<LunarPhaseReminder>[] = [
  { value: 'off', label: 'Tắt' },
  { value: 'sameDay', label: 'Đúng ngày' },
  { value: 'dayBefore', label: 'Trước 1 ngày' },
];

/** Mục "Nhắc lịch" trong Cài đặt. */
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

  const sendTestNotification = useCallback(async () => {
    if (await ensureNotificationPermission()) {
      await notifier.showNow({
        title: 'Lịch Việt',
        body: 'Thông báo đang hoạt động. Bạn sẽ được nhắc vào giờ đã chọn.',
        url: 'lichviet://today',
      });
    }
  }, []);
  const sendTest = useCallback(
    () => runInBackground(sendTestNotification(), 'reminders'),
    [sendTestNotification],
  );
  const { request } = permission;
  const requestPermission = useCallback(
    () => runInBackground(request(), 'reminders'),
    [request],
  );

  const isBlocked =
    permission.state === 'denied' || permission.state === 'undetermined';

  return (
    <>
      <Section
        title="Nhắc lịch"
        footer="Nhắc từng sự kiện được chọn khi thêm hoặc sửa sự kiện. Mọi lời nhắc trong cùng một ngày gộp thành một thông báo."
      >
        {isBlocked ? (
          <ListRow
            leading={<Icon name="notifications" size={22} color="danger" />}
            title={
              permission.state === 'denied'
                ? 'Thông báo đang bị tắt'
                : 'Chưa bật thông báo'
            }
            subtitle="Bạn sẽ không nhận được lời nhắc."
            value="Bật"
            action={{ onPress: requestPermission }}
            presentation={{ valueColor: 'primary' }}
          />
        ) : null}
        <ListRow
          title="Giờ nhắc mỗi ngày"
          trailing={
            <TimeStepper
              label="Giờ nhắc"
              value={reminders.time}
              onChange={setTime}
            />
          }
        />
        <ActionRow
          label="Gửi thông báo thử"
          materialIcon="notifications"
          onPress={sendTest}
        />
      </Section>
      <Section title="Mùng 1 và rằm" separators={false}>
        <FieldGroup>
          <SegmentedControl
            options={LUNAR_PHASE_OPTIONS}
            value={reminders.lunarPhase}
            onChange={setLunarPhase}
          />
        </FieldGroup>
      </Section>
    </>
  );
}
