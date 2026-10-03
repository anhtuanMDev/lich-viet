import type { WeekStart } from '@core/lunar';
import type {
  LunarPhaseReminder,
  ReminderSettings,
  ReminderTime,
} from '@core/reminders';
import {
  createPersistentStore,
  storageBackend,
  useStore,
} from '@shared/storage';
import type { ThemeMode } from '@shared/theme';

export interface Settings {
  readonly weekStart: WeekStart;
  readonly themeMode: ThemeMode;
  readonly reminders: ReminderSettings;
  /** Gửi báo cáo lỗi kỹ thuật (Crashlytics). Người dùng tắt được trong Cài đặt. */
  readonly crashReports: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  weekStart: 1,
  themeMode: 'system',
  reminders: {
    time: { hour: 7, minute: 0 },
    lunarPhase: 'off',
  },
  crashReports: true,
};

const isWeekStart = (value: unknown): value is WeekStart =>
  value === 0 || value === 1;
const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'system' || value === 'light' || value === 'dark';

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null;

const isReminderTime = (value: unknown): value is ReminderTime =>
  isRecord(value) &&
  Number.isInteger(value.hour) &&
  Number.isInteger(value.minute) &&
  (value.hour as number) >= 0 &&
  (value.hour as number) <= 23 &&
  (value.minute as number) >= 0 &&
  (value.minute as number) <= 59;

const isLunarPhaseReminder = (value: unknown): value is LunarPhaseReminder =>
  value === 'off' || value === 'sameDay' || value === 'dayBefore';

function decodeReminders(value: unknown): ReminderSettings {
  const defaults = DEFAULT_SETTINGS.reminders;
  if (!isRecord(value)) {
    return defaults;
  }
  return {
    time: isReminderTime(value.time)
      ? { hour: value.time.hour, minute: value.time.minute }
      : defaults.time,
    lunarPhase: isLunarPhaseReminder(value.lunarPhase)
      ? value.lunarPhase
      : defaults.lunarPhase,
  };
}

/** Giải mã từng trường: trường lỗi/thiếu lấy mặc định, không bỏ cả bộ cài đặt. */
export function decodeSettings(data: unknown): Settings {
  if (!isRecord(data)) {
    return DEFAULT_SETTINGS;
  }
  const record = data;
  return {
    weekStart: isWeekStart(record.weekStart)
      ? record.weekStart
      : DEFAULT_SETTINGS.weekStart,
    themeMode: isThemeMode(record.themeMode)
      ? record.themeMode
      : DEFAULT_SETTINGS.themeMode,
    // Trường thêm sau phiên bản đầu: dữ liệu cũ không có → lấy mặc định, không cần tăng version.
    reminders: decodeReminders(record.reminders),
    crashReports:
      typeof record.crashReports === 'boolean'
        ? record.crashReports
        : DEFAULT_SETTINGS.crashReports,
  };
}

export const settingsStore = createPersistentStore<Settings>({
  backend: storageBackend,
  key: 'settings',
  version: 1,
  decode: decodeSettings,
  fallback: DEFAULT_SETTINGS,
});

export const useSettings = (): Settings => useStore(settingsStore);

export function updateSettings(patch: Partial<Settings>): void {
  settingsStore.set(prev => ({ ...prev, ...patch }));
}

export function updateReminderSettings(patch: Partial<ReminderSettings>): void {
  settingsStore.set(prev => ({
    ...prev,
    reminders: { ...prev.reminders, ...patch },
  }));
}
