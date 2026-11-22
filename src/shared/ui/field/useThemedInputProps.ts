import { fontScaleLimit, useScaledText, useTheme } from '@shared/theme';

import type { TypographyVariant } from '@shared/theme';

/**
 * Thuộc tính chung của mọi TextInput trong app: cỡ chữ theo máy có trần, màu chữ gợi ý,
 * màu con trỏ và vùng chọn theo màu nhấn.
 */
export function useThemedInputProps(variant: TypographyVariant) {
  const { colors, typography } = useTheme();
  const scaled = useScaledText(typography[variant], fontScaleLimit.content);
  return {
    ...scaled.textProps,
    textStyle: scaled.style,
    placeholderTextColor: colors.textFaint,
    selectionColor: colors.primary,
    cursorColor: colors.primary,
  };
}
