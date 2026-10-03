import { syncReminders } from '@features/reminders/syncReminders';
import { syncWidgets } from '@features/widget/syncWidgets';

/**
 * Cập nhật mọi dữ liệu "suy ra" từ sự kiện + cài đặt: lịch nhắc và widget.
 * Hai việc độc lập – một bên lỗi không chặn bên kia.
 */
export async function syncAll(): Promise<void> {
  const results = await Promise.allSettled([syncReminders(), syncWidgets()]);
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(
        `[sync] ${index === 0 ? 'Nhắc lịch' : 'Widget'} lỗi`,
        result.reason,
      );
    }
  });
}
