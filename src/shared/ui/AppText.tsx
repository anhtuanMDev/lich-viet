import { Text } from 'react-native';
import type { TextProps } from 'react-native';
import { fontScaleLimit, useScaledText, useTheme } from '@shared/theme';
import type { ColorTokens, TypographyVariant } from '@shared/theme';

export interface AppTextProps extends TextProps {
  readonly variant?: TypographyVariant;
  readonly color?: keyof ColorTokens;
  readonly align?: 'left' | 'center' | 'right';
}

/** Mọi chữ trong app đi qua component này để thống nhất cỡ chữ, màu và hỗ trợ Dynamic Type. */
export function AppText({
  variant = 'body',
  color = 'text',
  align,
  style,
  // Số ngày cỡ 72 đã rất to; phóng thêm 1.6x sẽ tràn khối "tờ lịch".
  maxFontSizeMultiplier = variant === 'display'
    ? fontScaleLimit.compact
    : fontScaleLimit.content,
  ...rest
}: AppTextProps) {
  const theme = useTheme();
  const scaled = useScaledText(
    theme.typography[variant],
    maxFontSizeMultiplier,
  );
  return (
    <Text
      {...rest}
      {...scaled.textProps}
      style={[
        scaled.style,
        { color: theme.colors[color] },
        align && { textAlign: align },
        style,
      ]}
    />
  );
}
