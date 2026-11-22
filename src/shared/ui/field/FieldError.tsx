import { Platform } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { AppText } from '../AppText';

/** Dòng lỗi dưới ô nhập (đọc ngay khi xuất hiện trên Android nhờ live region). */
export function FieldError({ message }: { readonly message: string }) {
  const styles = useStyles();
  return (
    <AppText
      variant="footnote"
      color="danger"
      accessibilityLiveRegion="polite"
      style={styles.text}
    >
      {message}
    </AppText>
  );
}

const useStyles = createThemedStyles(theme => ({
  text: {
    paddingHorizontal:
      Platform.OS === 'android' ? theme.spacing.lg : theme.spacing.xs,
  },
}));
