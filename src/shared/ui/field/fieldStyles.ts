import { Platform } from 'react-native';

import type { Theme, ThemedStyles } from '@shared/theme';

const isAndroid = Platform.OS === 'android';

/**
 * Khung ô nhập dùng chung cho TextField và NumberField.
 * iOS: nền xám bo tròn. Android: Material 3 "filled" - nền, bo 2 góc trên, gạch chân.
 */
export function fieldFrameStyles(theme: Theme) {
  return {
    frame: isAndroid
      ? {
          backgroundColor: theme.colors.fill,
          borderTopLeftRadius: theme.radius.field,
          borderTopRightRadius: theme.radius.field,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.textMuted,
        }
      : {
          backgroundColor: theme.colors.fill,
          borderRadius: theme.radius.field,
        },
    focused: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    invalid: isAndroid
      ? { borderBottomWidth: 2, borderBottomColor: theme.colors.danger }
      : { borderWidth: 1, borderColor: theme.colors.danger },
  } satisfies ThemedStyles;
}
