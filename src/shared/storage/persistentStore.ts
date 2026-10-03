/**
 * Store đồng bộ, bền vững, có phiên bản schema – nền cho mọi dữ liệu người dùng (sự kiện, cài đặt).
 *
 * - Dữ liệu ghi dạng `{ "v": <version>, "data": ... }` dưới một key.
 * - Khi đọc: JSON hỏng / phiên bản lạ / dữ liệu sai kiểu → `decode` trả null → dùng `fallback`,
 *   app không bao giờ crash vì dữ liệu cũ.
 * - Snapshot được giữ trong bộ nhớ và chỉ đổi tham chiếu khi giá trị đổi → hợp với
 *   useSyncExternalStore và React.memo.
 */

/** Phần tối thiểu cần từ MMKV – để test bằng bộ nhớ thường và để đổi backend khi cần. */
export interface KeyValueBackend {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
}

export interface PersistentStoreOptions<T> {
  readonly backend: KeyValueBackend;
  readonly key: string;
  readonly version: number;
  /** Nhận `data` đã parse và phiên bản đã lưu; trả null nếu không dùng được. */
  readonly decode: (data: unknown, storedVersion: number) => T | null;
  readonly fallback: T;
}

export interface PersistentStore<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(listener: () => void): () => void;
}

interface Envelope {
  readonly v: number;
  readonly data: unknown;
}

const isEnvelope = (value: unknown): value is Envelope =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { v?: unknown }).v === 'number' &&
  'data' in value;

export function createPersistentStore<T>({
  backend,
  key,
  version,
  decode,
  fallback,
}: PersistentStoreOptions<T>): PersistentStore<T> {
  let loaded = false;
  let snapshot = fallback;
  const listeners = new Set<() => void>();

  const load = (): T => {
    const raw = backend.getString(key);
    if (raw === undefined) {
      return fallback;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isEnvelope(parsed)) {
        const value = decode(parsed.data, parsed.v);
        if (value !== null) {
          return value;
        }
      }
    } catch {
      // JSON hỏng – rơi xuống fallback bên dưới.
    }
    console.warn(`[storage] Bỏ qua dữ liệu không đọc được ở key "${key}"`);
    return fallback;
  };

  const get = (): T => {
    if (!loaded) {
      snapshot = load();
      loaded = true;
    }
    return snapshot;
  };

  const set = (next: T | ((prev: T) => T)): void => {
    const prev = get();
    const value =
      typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
    if (Object.is(value, prev)) {
      return;
    }
    const envelope: Envelope = { v: version, data: value };
    backend.set(key, JSON.stringify(envelope));
    snapshot = value;
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { get, set, subscribe };
}
