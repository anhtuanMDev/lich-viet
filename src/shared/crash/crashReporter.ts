import { getApps } from '@react-native-firebase/app';
import {
  getCrashlytics,
  log,
  recordError,
  setCrashlyticsCollectionEnabled,
} from '@react-native-firebase/crashlytics';
import type { Crashlytics } from '@react-native-firebase/crashlytics';

/*
 * Lớp bọc Crashlytics duy nhất của app – nơi khác không import Firebase trực tiếp.
 *
 * - Chưa có file cấu hình Firebase (google-services.json / GoogleService-Info.plist)
 *   → không có app Firebase mặc định → mọi hàm ở đây thành no-op, app vẫn chạy.
 * - Chỉ gửi lỗi kỹ thuật (stack trace, ngữ cảnh do code đặt). KHÔNG bao giờ đưa nội dung
 *   người dùng nhập (tên sự kiện, ghi chú) vào message/log – xem chính sách quyền riêng tư.
 */

let instance: Crashlytics | null | undefined;

function crashlytics(): Crashlytics | null {
  if (instance === undefined) {
    instance = getApps().length > 0 ? getCrashlytics() : null;
  }
  return instance;
}

/**
 * Gọi sớm nhất có thể (index.js): khởi tạo Crashlytics để nó gắn handler bắt lỗi JS
 * chưa xử lý (crash) và promise bị reject không ai bắt.
 */
export function initCrashReporting(): void {
  crashlytics();
}

/** Bật/tắt gửi báo cáo (lưu phía native, có hiệu lực từ lần mở app kế tiếp với crash native). */
export function setCrashReportingEnabled(enabled: boolean): void {
  const target = crashlytics();
  if (target) {
    setCrashlyticsCollectionEnabled(target, enabled).catch(() => {});
  }
}

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

/**
 * Ghi lỗi không làm sập app (non-fatal). `context` là nhãn cố định trong code
 * (VD 'sync:reminders') để nhóm lỗi trên Crashlytics.
 */
export function reportError(error: unknown, context: string): void {
  if (__DEV__) {
    console.warn(`[${context}]`, error);
  }
  const target = crashlytics();
  if (target) {
    log(target, context);
    recordError(target, toError(error), context);
  }
}
