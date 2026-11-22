import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

/** Chấm tròn đặc màu sự kiện - cùng ký hiệu với chấm trên lưới lịch. */
export function EventDot({ size = 9 }: { readonly size?: number }) {
  const styles = useStyles();
  return (
    <View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

const useStyles = createThemedStyles(t => ({
  dot: {
    backgroundColor: t.colors.event,
  },
}));
