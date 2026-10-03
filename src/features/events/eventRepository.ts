import { useCallback } from 'react';
import { decodeEvents, mergeEvents } from '@core/events';
import type { CalendarEvent, MergeResult } from '@core/events';
import { reportError } from '@shared/crash';
import {
  createPersistentStore,
  storageBackend,
  useStore,
  useStoreSelector,
} from '@shared/storage';

/**
 * Cửa ngõ duy nhất tới dữ liệu sự kiện. Màn hình, nhắc lịch, widget… chỉ đi qua đây,
 * nên nếu sau này cần đổi MMKV sang SQLite thì chỉ phải viết lại file này.
 */

export type EventDraft = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>;

const NO_EVENTS: readonly CalendarEvent[] = [];

const eventsStore = createPersistentStore<readonly CalendarEvent[]>({
  backend: storageBackend,
  key: 'events',
  version: 1,
  decode: (data, version) => {
    if (version !== 1) {
      return null;
    }
    const { events, dropped } = decodeEvents(data);
    if (dropped > 0) {
      reportError(
        new Error(`Bỏ qua ${dropped} sự kiện không hợp lệ`),
        'events:decode',
      );
    }
    return events;
  },
  fallback: NO_EVENTS,
});

/** Hermes không có crypto.randomUUID; id chỉ cần duy nhất trên một máy. */
const createId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const eventRepository = {
  list: (): readonly CalendarEvent[] => eventsStore.get(),

  get: (id: string): CalendarEvent | undefined =>
    eventsStore.get().find(event => event.id === id),

  create(draft: EventDraft, now: number = Date.now()): CalendarEvent {
    const event: CalendarEvent = {
      ...draft,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    eventsStore.set(prev => [...prev, event]);
    return event;
  },

  update(id: string, draft: EventDraft, now: number = Date.now()): void {
    eventsStore.set(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...draft, updatedAt: now } : event,
      ),
    );
  },

  remove(id: string): void {
    eventsStore.set(prev => prev.filter(event => event.id !== id));
  },

  /** Nhập từ bản sao lưu: gộp theo id, giữ bản sửa sau cùng, không xoá sự kiện đang có. */
  importEvents(incoming: readonly CalendarEvent[]): MergeResult {
    const result = mergeEvents(eventsStore.get(), incoming);
    if (result.added > 0 || result.updated > 0) {
      eventsStore.set(result.events);
    }
    return result;
  },

  subscribe: eventsStore.subscribe,
};

export const useEvents = (): readonly CalendarEvent[] => useStore(eventsStore);

export function useEvent(id: string | undefined): CalendarEvent | undefined {
  const select = useCallback(
    (events: readonly CalendarEvent[]) =>
      id === undefined ? undefined : events.find(event => event.id === id),
    [id],
  );
  return useStoreSelector(eventsStore, select);
}
