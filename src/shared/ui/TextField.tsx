import { Platform, TextInput, View } from 'react-native';

import { useAnnounce } from '@shared/a11y';
import { createThemedStyles } from '@shared/theme';

import { FieldError } from './field/FieldError';
import { FieldLabel } from './field/FieldLabel';
import { fieldFrameStyles } from './field/fieldStyles';
import { useFieldFocus } from './field/useFieldFocus';
import { useThemedInputProps } from './field/useThemedInputProps';

import type { Theme, ThemedStyles } from '@shared/theme';
import type { TextInputProps } from 'react-native';

export interface TextFieldProps
  extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  readonly label: string;
  readonly error?: string | null;
}

const isAndroid = Platform.OS === 'android';

/**
 * iOS: ô xám bo tròn, nhãn nhỏ phía trên. Android: ô nhập kiểu "filled" của Material 3 -
 * nhãn nằm trong ô, gạch chân đổi màu khi đang nhập.
 */
export function TextField({
  label,
  error,
  multiline,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const styles = useStyles();
  const { textStyle, ...inputProps } = useThemedInputProps('body');
  const { isFocused, handleFocus, handleBlur } = useFieldFocus({
    onFocus,
    onBlur,
  });
  useAnnounce(error ?? null);
  const isInvalid = Boolean(error);
  const labelText = (
    <FieldLabel label={label} isInvalid={isInvalid} isFocused={isFocused} />
  );

  return (
    <View style={styles.container}>
      {isAndroid ? null : labelText}
      <View
        style={[
          styles.frame,
          styles.framePadding,
          isAndroid && isFocused && styles.focused,
          isInvalid && styles.invalid,
        ]}
      >
        {isAndroid ? labelText : null}
        <TextInput
          accessibilityLabel={label}
          {...inputProps}
          multiline={multiline}
          style={[textStyle, styles.input, multiline && styles.multiline]}
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
      {error ? <FieldError message={error} /> : null}
    </View>
  );
}

/** Ô nhập một dòng: Material đặt nhãn trong ô nên phần chữ thấp hơn ô iOS. */
const INPUT_MIN_HEIGHT = Platform.select({ android: 32, default: 44 });
const INPUT_PADDING_Y = Platform.select({ android: 4, default: 11 });
const MULTILINE_MIN_HEIGHT = 88;

function textFieldStyles(theme: Theme) {
  return {
    ...fieldFrameStyles(theme),
    container: { gap: theme.spacing.xs },
    framePadding: isAndroid
      ? {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.xs,
        }
      : { paddingHorizontal: theme.spacing.md },
    input: {
      color: theme.colors.text,
      minHeight: INPUT_MIN_HEIGHT,
      paddingVertical: INPUT_PADDING_Y,
      paddingHorizontal: 0,
    },
    multiline: { minHeight: MULTILINE_MIN_HEIGHT, textAlignVertical: 'top' },
  } satisfies ThemedStyles;
}

const useStyles = createThemedStyles(textFieldStyles);
