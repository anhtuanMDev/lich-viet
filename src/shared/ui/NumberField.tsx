import { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { createThemedStyles, useTheme } from '@shared/theme';
import { AppText } from './AppText';

export interface NumberFieldProps {
  readonly label: string;
  /** Chuỗi thô người dùng gõ – giữ dạng string để cho phép ô trống khi đang sửa. */
  readonly value: string;
  readonly onChangeValue: (value: string) => void;
  readonly maxLength: number;
  readonly invalid?: boolean;
}

export function NumberField({
  label,
  value,
  onChangeValue,
  maxLength,
  invalid = false,
}: NumberFieldProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const handleChange = useCallback(
    (text: string) => onChangeValue(text.replace(/\D/g, '')),
    [onChangeValue],
  );

  return (
    <View style={styles.container}>
      <AppText variant="label" color="textMuted">
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={maxLength}
        selectTextOnFocus
        accessibilityLabel={label}
        placeholderTextColor={colors.textFaint}
        style={[styles.input, invalid && styles.invalid]}
      />
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  container: {
    flex: 1,
    gap: t.spacing.xs,
  },
  input: {
    ...t.typography.title,
    color: t.colors.text,
    textAlign: 'center',
    backgroundColor: t.colors.surfaceMuted,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.colors.border,
    paddingVertical: t.spacing.sm,
  },
  invalid: {
    borderColor: t.colors.holiday,
  },
}));
