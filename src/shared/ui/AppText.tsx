import { Text } from 'react-native';
import type { TextProps } from 'react-native';
import { useTheme } from '@shared/theme';
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
  ...rest
}: AppTextProps) {
  const theme = useTheme();
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[
        theme.typography[variant],
        { color: theme.colors[color] },
        align && { textAlign: align },
        style,
      ]}
    />
  );
}
