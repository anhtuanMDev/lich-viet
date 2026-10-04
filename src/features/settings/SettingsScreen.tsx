import { useCallback } from 'react';
import { Linking } from 'react-native';
import type { WeekStart } from '@core/lunar';
import { BackupCard } from '@features/backup/BackupCard';
import { AndroidDeliveryCard } from '@features/reminders/components/AndroidDeliveryCard';
import { ReminderSettingsCard } from '@features/reminders/components/ReminderSettingsCard';
import { WidgetSettingsCard } from '@features/widget/WidgetSettingsCard';
import { runInBackground } from '@shared/async/runInBackground';
import type { ThemeMode } from '@shared/theme';
import {
  AppText,
  Button,
  Card,
  Screen,
  SegmentedControl,
  SwitchRow,
} from '@shared/ui';
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

/** Bản công khai của docs/privacy-policy.md (trang trong repo portfolio, deploy Vercel). */
const PRIVACY_POLICY_URL =
  'https://portfolio-three-theta-41.vercel.app/lich-viet/privacy-policy/';

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
  const setCrashReports = useCallback(
    (crashReports: boolean) => updateSettings({ crashReports }),
    [],
  );
  const openPrivacyPolicy = useCallback(
    () =>
      runInBackground(Linking.openURL(PRIVACY_POLICY_URL), 'privacy-policy'),
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
      <Card title="Báo cáo lỗi">
        <SwitchRow
          label="Gửi báo cáo lỗi"
          value={settings.crashReports}
          onChange={setCrashReports}
        />
        <AppText color="textMuted">
          Khi ứng dụng gặp lỗi, thông tin kỹ thuật (loại máy, phiên bản hệ điều
          hành, vị trí lỗi trong mã) được gửi ẩn danh qua Firebase Crashlytics
          để sửa lỗi. Không bao gồm sự kiện, ghi chú hay thông tin cá nhân của
          bạn.
        </AppText>
      </Card>
      <Card title="Về ứng dụng">
        <AppText color="textMuted">
          Âm lịch tính theo giờ chuẩn Việt Nam (UTC+7), thuật toán của TS. Hồ
          Ngọc Đức. Hỗ trợ từ năm 1900 đến 2100. Sự kiện và cài đặt chỉ nằm trên
          máy và trong bản sao lưu của chính bạn (Google / iCloud).
        </AppText>
        <Button
          label="Chính sách quyền riêng tư"
          variant="secondary"
          onPress={openPrivacyPolicy}
        />
      </Card>
    </Screen>
  );
}
