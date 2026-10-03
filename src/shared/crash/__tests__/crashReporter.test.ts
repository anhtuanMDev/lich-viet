import { getApps } from '@react-native-firebase/app';
import {
  getCrashlytics,
  recordError,
  setCrashlyticsCollectionEnabled,
} from '@react-native-firebase/crashlytics';
import type * as ReporterModule from '../crashReporter';

type Reporter = typeof ReporterModule;

const mockedGetApps = jest.mocked(getApps);

// crashReporter giữ instance ở cấp module → nạp lại cho từng kịch bản.
function loadReporter(): Reporter {
  let mod!: Reporter;
  jest.isolateModules(() => {
    mod = require('../crashReporter');
  });
  return mod;
}

describe('crashReporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('chưa cấu hình Firebase → không gọi Crashlytics, không ném lỗi', () => {
    mockedGetApps.mockReturnValue([]);
    const { initCrashReporting, reportError, setCrashReportingEnabled } =
      loadReporter();

    initCrashReporting();
    reportError(new Error('x'), 'test');
    setCrashReportingEnabled(false);

    expect(getCrashlytics).not.toHaveBeenCalled();
    expect(recordError).not.toHaveBeenCalled();
  });

  it('có Firebase → ghi lỗi kèm ngữ cảnh, chuyển giá trị không phải Error thành Error', () => {
    mockedGetApps.mockReturnValue([{} as never]);
    const instance = {};
    jest.mocked(getCrashlytics).mockReturnValue(instance as never);
    const { reportError, setCrashReportingEnabled } = loadReporter();

    reportError('chuỗi lỗi', 'sync');
    setCrashReportingEnabled(false);

    expect(recordError).toHaveBeenCalledWith(
      instance,
      new Error('chuỗi lỗi'),
      'sync',
    );
    expect(setCrashlyticsCollectionEnabled).toHaveBeenCalledWith(
      instance,
      false,
    );
    expect(getCrashlytics).toHaveBeenCalledTimes(1);
  });
});
