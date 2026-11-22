import { Platform, TextInput, View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { AppText } from './AppText';
import { fieldLabelColor } from './field/fieldLabelColor';
import { fieldFrameStyles } from './field/fieldStyles';
import { useFieldFocus } from './field/useFieldFocus';
import { useThemedInputProps } from './field/useThemedInputProps';

import type { Theme, ThemedStyles } from '@shared/theme';

export interface NumberFieldProps {
  readonly label: string;
  /** Chuỗi thô người dùng gõ - giữ dạng string để cho phép ô trống khi đang sửa. */
  readonly value: string;
  readonly onChangeValue: (value: string) => void;
  readonly maxLength: number;
  readonly invalid?: boolean;
}

const isAndroid = Platform.OS === 'android';
const keepDigits = (text: string): string => text.replaceAll(/\D/g, '');

/** Ô nhập số (ngày, tháng, năm) - cùng kiểu khung với TextField của từng nền tảng. */
export function NumberField({
  label,
  value,
  onChangeValue,
  maxLength,
  invalid: isInvalid = false,
}: NumberFieldProps) {
  const styles = useStyles();
  const { textStyle, ...inputProps } = useThemedInputProps('bodyStrong');
  const { isFocused, handleFocus, handleBlur } = useFieldFocus();

  return (
    <View style={styles.container}>
      <AppText
        variant="footnote"
        color={fieldLabelColor({ isInvalid, isFocused })}
        align="center"
      >
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={text => onChangeValue(keepDigits(text))}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={maxLength}
        selectTextOnFocus
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityLabel={label}
        {...inputProps}
        style={[
          textStyle,
          styles.frame,
          styles.input,
          isAndroid && isFocused && styles.focused,
          isInvalid && styles.invalid,
        ]}
      />
    </View>
  );
}

function numberFieldStyles(theme: Theme) {
  return {
    ...fieldFrameStyles(theme),
    container: { flex: 1, gap: theme.spacing.xs },
    input: {
      color: theme.colors.text,
      textAlign: 'center',
      minHeight: theme.controlSize.field,
      paddingVertical: theme.spacing.sm,
      fontVariant: ['tabular-nums'],
    },
  } satisfies ThemedStyles;
}

const useStyles = createThemedStyles(numberFieldStyles);
