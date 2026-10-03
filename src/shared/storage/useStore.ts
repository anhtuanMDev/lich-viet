import { useCallback, useSyncExternalStore } from 'react';
import type { PersistentStore } from './persistentStore';

export function useStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get);
}

/**
 * Chỉ render lại khi phần được chọn thay đổi. `selector` phải trả về giá trị có sẵn trong
 * snapshot (hoặc giá trị nguyên thuỷ) – không tạo object mới mỗi lần gọi.
 */
export function useStoreSelector<T, S>(
  store: PersistentStore<T>,
  selector: (state: T) => S,
): S {
  const getSelected = useCallback(
    () => selector(store.get()),
    [store, selector],
  );
  return useSyncExternalStore(store.subscribe, getSelected);
}
