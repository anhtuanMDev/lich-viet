import { Platform } from 'react-native';

import type { ColorTokens } from '@shared/theme';

/**
 * Màu nhãn ô nhập: đỏ khi lỗi; Material tô màu nhấn khi đang nhập; còn lại màu chữ phụ.
 */
export function fieldLabelColor({
  isInvalid,
  isFocused,
}: {
  readonly isInvalid: boolean;
  readonly isFocused: boolean;
}): keyof ColorTokens {
  if (isInvalid) {
    return 'danger';
  }
  return isFocused && Platform.OS === 'android' ? 'primary' : 'textMuted';
}
