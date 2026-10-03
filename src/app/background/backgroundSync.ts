import BackgroundFetch from 'react-native-background-fetch';
import type { HeadlessEvent } from 'react-native-background-fetch';
import { reportError } from '@shared/crash';
import { syncAll } from './syncAll';

/*
 * Chạy nền định kỳ để "nạp thêm" lịch nhắc và dữ liệu widget khi người dùng lâu không mở app
 * (quan trọng với iOS vì chỉ đặt trước được ~60 ngày). Hệ điều hành quyết định
 * thời điểm chạy thật, nên đây chỉ là lớp bổ sung – mỗi lần mở app vẫn đồng bộ lại.
 */

const TWELVE_HOURS_IN_MINUTES = 12 * 60;

async function runTask(taskId: string): Promise<void> {
  try {
    await syncAll();
  } catch (error) {
    reportError(error, 'sync:background');
  } finally {
    BackgroundFetch.finish(taskId);
  }
}

export async function configureBackgroundSync(): Promise<void> {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: TWELVE_HOURS_IN_MINUTES,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },
    runTask,
    taskId => BackgroundFetch.finish(taskId),
  );
}

/** Android: chạy cả khi app đã bị tắt (Headless JS). Đăng ký trong index.js. */
export async function backgroundSyncHeadlessTask({
  taskId,
  timeout,
}: HeadlessEvent) {
  if (timeout) {
    BackgroundFetch.finish(taskId);
    return;
  }
  await runTask(taskId);
}
