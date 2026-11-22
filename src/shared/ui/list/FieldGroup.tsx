import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import type { ReactNode } from 'react';

/** Khối ô nhập / điều khiển trong một Section: thụt lề theo lề nội dung, các phần tử cách đều. */
export function FieldGroup({ children }: { readonly children?: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.group}>{children}</View>;
}

const useStyles = createThemedStyles(theme => ({
  group: {
    paddingHorizontal: theme.gutter,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
}));
