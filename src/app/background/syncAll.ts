import { syncReminders } from '@features/reminders/syncReminders';
import { syncWidgets } from '@features/widget/syncWidgets';
import { reportError } from '@shared/crash';

/**
 * Cập nhật mọi dữ liệu "suy ra" từ sự kiện + cài đặt: lịch nhắc và widget.
 * Hai việc độc lập – một bên lỗi không chặn bên kia.
 */
export async function syncAll(): Promise<void> {
  const results = await Promise.allSettled([syncReminders(), syncWidgets()]);
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      reportError(
        result.reason,
        index === 0 ? 'sync:reminders' : 'sync:widgets',
      );
    }
  });
}
