// Unit test không chạm tới native: thay MMKV bằng backend trong bộ nhớ.
jest.mock('./src/shared/storage/backend', () => {
  const data = new Map<string, string>();
  return {
    storageBackend: {
      getString: (key: string) => data.get(key),
      set: (key: string, value: string) => {
        data.set(key, value);
      },
    },
  };
});

// Thư viện native: dùng mock đi kèm thư viện / mock tối thiểu.
jest.mock('react-native-notify-kit', () =>
  require('react-native-notify-kit/jest-mock'),
);
jest.mock('react-native-background-fetch', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(() => Promise.resolve(2)),
    finish: jest.fn(),
    registerHeadlessTask: jest.fn(),
  },
}));
jest.mock('react-native-android-widget', () => ({
  requestWidgetUpdate: jest.fn(() => Promise.resolve()),
  requestPinWidget: jest.fn(() => Promise.resolve(true)),
  registerWidgetTaskHandler: jest.fn(),
  FlexWidget: () => null,
  TextWidget: () => null,
}));
jest.mock('@react-native-firebase/app', () => ({
  getApps: jest.fn(() => []),
}));
jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(),
  log: jest.fn(),
  recordError: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve(null)),
}));
