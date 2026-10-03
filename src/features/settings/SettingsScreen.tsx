import { useCallback } from 'react';
import type { WeekStart } from '@core/lunar';
import { BackupCard } from '@features/backup/BackupCard';
import { AndroidDeliveryCard } from '@features/reminders/components/AndroidDeliveryCard';
import { ReminderSettingsCard } from '@features/reminders/components/ReminderSettingsCard';
import { WidgetSettingsCard } from '@features/widget/WidgetSettingsCard';
import type { ThemeMode } from '@shared/theme';
import { AppText, Card, Screen, SegmentedControl } from '@shared/ui';
import type { SegmentOption } from '@shared/ui';
import { updateSettings, useSettings } from './settingsStore';

const THEME_OPTIONS: readonly SegmentOption<ThemeMode>[] = [
  { value: 'system', label: 'Theo máy' },
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
];

// SegmentedControl làm việc với chuỗi; quy đổi về WeekStart ở đây.
type WeekStartOption = 'monday' | 'sunday';
const WEEK_START_OPTIONS: readonly SegmentOption<WeekStartOption>[] = [
  { value: 'monday', label: 'Thứ hai' },
  { value: 'sunday', label: 'Chủ nhật' },
];
const toWeekStart = (option: WeekStartOption): WeekStart =>
  option === 'monday' ? 1 : 0;

export function SettingsScreen() {
  const settings = useSettings();

  const setThemeMode = useCallback(
    (themeMode: ThemeMode) => updateSettings({ themeMode }),
    [],
  );
  const setWeekStart = useCallback(
    (option: WeekStartOption) =>
      updateSettings({ weekStart: toWeekStart(option) }),
    [],
  );

  return (
    <Screen edges={[]}>
      <ReminderSettingsCard />
      <AndroidDeliveryCard />
      <WidgetSettingsCard />
      <BackupCard />
      <Card title="Giao diện">
        <SegmentedControl
          options={THEME_OPTIONS}
          value={settings.themeMode}
          onChange={setThemeMode}
        />
      </Card>
      <Card title="Tuần bắt đầu từ">
        <SegmentedControl
          options={WEEK_START_OPTIONS}
          value={settings.weekStart === 1 ? 'monday' : 'sunday'}
          onChange={setWeekStart}
        />
      </Card>
      <Card title="Về ứng dụng">
        <AppText color="textMuted">
          Âm lịch tính theo giờ chuẩn Việt Nam (UTC+7), thuật toán của TS. Hồ
          Ngọc Đức. Hỗ trợ từ năm 1900 đến 2100. Dữ liệu chỉ nằm trên máy và
          trong bản sao lưu của chính bạn (Google / iCloud) – ứng dụng không gửi
          lên máy chủ nào.
        </AppText>
      </Card>
    </Screen>
  );
}
