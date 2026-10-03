import { createMMKV } from 'react-native-mmkv';
import type { KeyValueBackend } from './persistentStore';

/** Một instance MMKV cho toàn app. Tách riêng để widget đọc chung qua App Group sau này. */
export const storageBackend: KeyValueBackend = createMMKV({ id: 'lich-viet' });
