import { Pressable } from 'react-native';
import { createThemedStyles } from '@shared/theme';
import type { ColorTokens } from '@shared/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly disabled?: boolean;
}

const LABEL_COLOR: Readonly<Record<ButtonVariant, keyof ColorTokens>> = {
  primary: 'onPrimary',
  secondary: 'primary',
  danger: 'holiday',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <AppText variant="heading" color={LABEL_COLOR[variant]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const useStyles = createThemedStyles(t => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.md,
  },
  primary: {
    backgroundColor: t.colors.primary,
  },
  secondary: {
    backgroundColor: t.colors.primarySoft,
  },
  danger: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
}));
