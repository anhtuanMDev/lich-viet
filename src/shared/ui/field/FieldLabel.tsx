import { Platform } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { AppText } from '../AppText';

import { fieldLabelColor } from './fieldLabelColor';

/** Nhãn ô nhập: iOS đặt trên ô (thụt nhẹ), Material đặt trong ô. */
export function FieldLabel({
  label,
  isInvalid,
  isFocused,
}: {
  readonly label: string;
  readonly isInvalid: boolean;
  readonly isFocused: boolean;
}) {
  const styles = useStyles();
  return (
    <AppText
      variant="footnote"
      color={fieldLabelColor({ isInvalid, isFocused })}
      style={Platform.OS === 'android' ? null : styles.outside}
    >
      {label}
    </AppText>
  );
}

const useStyles = createThemedStyles(theme => ({
  outside: { paddingHorizontal: theme.spacing.xs },
}));
