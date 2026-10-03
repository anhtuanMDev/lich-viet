import { createPersistentStore } from '../persistentStore';
import type { KeyValueBackend } from '../persistentStore';

const memoryBackend = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  const backend: KeyValueBackend = {
    getString: key => data.get(key),
    set: (key, value) => {
      data.set(key, value);
    },
  };
  return { backend, data };
};

const numberStore = (backend: KeyValueBackend) =>
  createPersistentStore<number>({
    backend,
    key: 'count',
    version: 2,
    decode: (data, v) => (v === 2 && typeof data === 'number' ? data : null),
    fallback: 0,
  });

describe('createPersistentStore', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('dùng fallback khi chưa có dữ liệu', () => {
    expect(numberStore(memoryBackend().backend).get()).toBe(0);
  });

  it('ghi kèm phiên bản và đọc lại được', () => {
    const { backend, data } = memoryBackend();
    numberStore(backend).set(5);
    expect(JSON.parse(data.get('count') ?? '')).toEqual({ v: 2, data: 5 });
    expect(numberStore(backend).get()).toBe(5);
  });

  it.each([
    ['JSON hỏng', '{oops'],
    ['không có envelope', '5'],
    ['phiên bản cũ không giải mã được', JSON.stringify({ v: 1, data: 'x' })],
  ])('rơi về fallback khi %s', (_, raw) => {
    expect(numberStore(memoryBackend({ count: raw }).backend).get()).toBe(0);
  });

  it('báo cho listener khi đổi, không báo khi giá trị giữ nguyên', () => {
    const store = numberStore(memoryBackend().backend);
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    store.set(prev => prev + 1);
    store.set(1);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.set(2);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
