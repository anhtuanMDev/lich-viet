import { reportError } from '@shared/crash';

/**
 * Chạy một promise không cần chờ kết quả (VD mở Cài đặt, xin quyền sau khi lưu)
 * nhưng vẫn ghi log nếu lỗi – thay cho `void promise` vốn nuốt mất lỗi.
 */
export function runInBackground(task: Promise<unknown>, label: string): void {
  task.catch(error => reportError(error, label));
}
