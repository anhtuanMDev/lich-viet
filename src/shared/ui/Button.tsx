import { Platform, Pressable } from 'react-native';

import { speakable } from '@core/a11y';
import { createThemedStyles, useTheme } from '@shared/theme';

import { AppText } from './AppText';

import type { ButtonSize, ButtonVariant } from './types/button';
import type { ColorTokens, Theme, ThemedStyles } from '@shared/theme';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly disabled?: boolean;
  /** Chiếm hết chiều ngang (mặc định ôm theo chữ). */
  readonly stretch?: boolean;
  readonly size?: ButtonSize;
}

const isIos = Platform.OS === 'ios';
/** Vùng chạm thêm quanh nút 40dp của Material để đủ 48dp. */
const HIT_SLOP = 4;

const LABEL_COLOR: Readonly<Record<ButtonVariant, keyof ColorTokens>> = {
  filled: 'onPrimary',
  tonal: isIos ? 'primary' : 'onSecondaryContainer',
  plain: 'primary',
  destructive: 'danger',
};

export function Button({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  stretch = false,
  size = 'regular',
}: ButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const isSmall = size === 'small';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={speakable(label)}
      accessibilityState={{ disabled }}
      android_ripple={{ color: colors.fill, borderless: false }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        stretch && styles.stretch,
        isSmall && styles.small,
        isIos && pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <AppText
        variant={isSmall && isIos ? 'subhead' : 'button'}
        color={LABEL_COLOR[variant]}
        align="center"
        style={isSmall && isIos ? styles.smallLabel : null}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

/** Lề ngang: Material 24dp cho nút có nền, 12dp cho nút chữ; iOS nút chữ không có lề. */
const PADDING = {
  filled: Platform.select({ android: 24, default: 20 }),
  text: Platform.select({ android: 12, default: 0 }),
  small: Platform.select({ android: 12, default: 14 }),
};

function buttonStyles(theme: Theme) {
  return {
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: theme.controlSize.button,
      paddingHorizontal: PADDING.filled,
      borderRadius: theme.radius.pill,
      overflow: 'hidden',
    },
    filled: { backgroundColor: theme.colors.primary },
    tonal: { backgroundColor: theme.colors.secondaryContainer },
    plain: { paddingHorizontal: PADDING.text },
    destructive: { paddingHorizontal: PADDING.text },
    stretch: { alignSelf: 'stretch' },
    small: {
      minHeight: theme.controlSize.buttonSmall,
      paddingHorizontal: PADDING.small,
    },
    smallLabel: { fontWeight: '600' },
    pressed: { opacity: 0.6 },
    disabled: { opacity: 0.38 },
  } satisfies ThemedStyles;
}

const useStyles = createThemedStyles(buttonStyles);
