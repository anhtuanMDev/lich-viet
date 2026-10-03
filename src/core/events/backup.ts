import { decodeEvents } from './decode';
import type { CalendarEvent } from './types';

/**
 * Định dạng file sao lưu thủ công (xuất/nhập). Đổi cấu trúc → tăng BACKUP_FORMAT
 * và vẫn đọc được các định dạng cũ trong parseBackup.
 */
export const BACKUP_APP_ID = 'lich-viet';
export const BACKUP_FORMAT = 1;

export interface BackupFile {
  readonly app: typeof BACKUP_APP_ID;
  readonly format: number;
  readonly exportedAt: string;
  readonly events: readonly CalendarEvent[];
}

export function serializeBackup(
  events: readonly CalendarEvent[],
  now: Date = new Date(),
): string {
  const file: BackupFile = {
    app: BACKUP_APP_ID,
    format: BACKUP_FORMAT,
    exportedAt: now.toISOString(),
    events,
  };
  return JSON.stringify(file);
}

export type ParseBackupResult =
  | {
      readonly ok: true;
      readonly events: CalendarEvent[];
      /** Số bản ghi hỏng bị bỏ qua. */
      readonly dropped: number;
    }
  | { readonly ok: false; readonly error: string };

export function parseBackup(text: string): ParseBackupResult {
  let data: unknown;
  try {
    data = JSON.parse(text.trim());
  } catch {
    return {
      ok: false,
      error: 'Không đọc được dữ liệu. Hãy dán nguyên văn nội dung đã xuất.',
    };
  }
  if (typeof data !== 'object' || data === null) {
    return { ok: false, error: 'Dữ liệu không đúng định dạng sao lưu.' };
  }
  const record = data as Readonly<Record<string, unknown>>;
  if (record.app !== BACKUP_APP_ID) {
    return {
      ok: false,
      error: 'Đây không phải dữ liệu sao lưu của Lịch Việt.',
    };
  }
  if (typeof record.format !== 'number' || record.format > BACKUP_FORMAT) {
    return {
      ok: false,
      error: 'Dữ liệu được tạo từ phiên bản mới hơn. Hãy cập nhật ứng dụng.',
    };
  }
  const { events, dropped } = decodeEvents(record.events);
  return { ok: true, events, dropped };
}

export interface MergeResult {
  readonly events: CalendarEvent[];
  readonly added: number;
  readonly updated: number;
  readonly unchanged: number;
}

/**
 * Gộp sự kiện nhập vào danh sách hiện có theo id:
 * chưa có → thêm; đã có → giữ bản sửa sau cùng (updatedAt lớn hơn).
 * Không bao giờ xoá sự kiện đang có.
 */
export function mergeEvents(
  existing: readonly CalendarEvent[],
  incoming: readonly CalendarEvent[],
): MergeResult {
  const byId = new Map(existing.map(event => [event.id, event]));
  let added = 0;
  let updated = 0;
  let unchanged = 0;
  for (const event of incoming) {
    const current = byId.get(event.id);
    if (!current) {
      byId.set(event.id, event);
      added++;
    } else if (event.updatedAt > current.updatedAt) {
      byId.set(event.id, event);
      updated++;
    } else {
      unchanged++;
    }
  }
  return { events: [...byId.values()], added, updated, unchanged };
}
