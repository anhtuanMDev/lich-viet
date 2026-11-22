import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

/** Vòng tròn rỗng màu ngày lễ - cùng ký hiệu với lưới lịch. */
export function HolidayMark({ size }: { readonly size: number }) {
  const styles = useStyles();
  return (
    <View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

const useStyles = createThemedStyles(theme => ({
  ring: {
    borderWidth: 1.6,
    borderColor: theme.colors.holiday,
  },
}));
