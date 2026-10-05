import { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import type { FocusEvent, TextInputProps } from 'react-native';
import { createThemedStyles, useTheme } from '@shared/theme';
import { AppText } from './AppText';
import { useRevealFocusedInput } from './revealInput';

export interface TextFieldProps
  extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  readonly label: string;
  readonly error?: string | null;
}

export function TextField({
  label,
  error,
  multiline,
  onFocus,
  ...rest
}: TextFieldProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const reveal = useRevealFocusedInput();
  const handleFocus = useCallback(
    (e: FocusEvent) => {
      reveal();
      onFocus?.(e);
    },
    [onFocus, reveal],
  );
  return (
    <View style={styles.container}>
      <AppText variant="label" color="textMuted">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textFaint}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.multiline,
          error ? styles.invalid : null,
        ]}
        {...rest}
        onFocus={handleFocus}
      />
      {error ? (
        <AppText
          variant="label"
          color="holiday"
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  container: {
    gap: t.spacing.xs,
  },
  input: {
    ...t.typography.body,
    color: t.colors.text,
    backgroundColor: t.colors.surfaceMuted,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.colors.border,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  invalid: {
    borderColor: t.colors.holiday,
  },
}));
