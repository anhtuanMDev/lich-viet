import { DEFAULT_SETTINGS, decodeSettings } from '../settingsStore';

describe('decodeSettings', () => {
  it('giữ trường hợp lệ, thay trường lỗi bằng mặc định', () => {
    expect(decodeSettings({ weekStart: 0, themeMode: 'neon' })).toEqual({
      weekStart: 0,
      themeMode: DEFAULT_SETTINGS.themeMode,
      reminders: DEFAULT_SETTINGS.reminders,
      crashReports: DEFAULT_SETTINGS.crashReports,
    });
  });

  it('đọc được dữ liệu cũ chưa có phần nhắc lịch', () => {
    expect(decodeSettings({ weekStart: 1, themeMode: 'dark' })).toEqual({
      weekStart: 1,
      themeMode: 'dark',
      reminders: DEFAULT_SETTINGS.reminders,
      crashReports: true,
    });
  });

  it('từ chối giờ nhắc không hợp lệ', () => {
    expect(
      decodeSettings({
        reminders: { time: { hour: 25, minute: 0 }, lunarPhase: 'dayBefore' },
      }).reminders,
    ).toEqual({
      time: DEFAULT_SETTINGS.reminders.time,
      lunarPhase: 'dayBefore',
    });
  });

  it('giữ lựa chọn tắt báo cáo lỗi, bỏ giá trị sai kiểu', () => {
    expect(decodeSettings({ crashReports: false }).crashReports).toBe(false);
    expect(decodeSettings({ crashReports: 'no' }).crashReports).toBe(true);
  });

  it('dữ liệu không phải object → mặc định', () => {
    expect(decodeSettings(null)).toBe(DEFAULT_SETTINGS);
    expect(decodeSettings('dark')).toBe(DEFAULT_SETTINGS);
  });
});
