import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

/**
 * Hàng ký hiệu cuối ô: chấm đặc = sự kiện cá nhân, vòng rỗng = ngày lễ. Luôn chiếm chỗ để
 * các ô thẳng hàng.
 */
export function CellMarks({
  hasEvent,
  hasHoliday,
}: {
  readonly hasEvent: boolean;
  readonly hasHoliday: boolean;
}) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      {hasEvent ? <View style={[styles.mark, styles.event]} /> : null}
      {hasHoliday ? <View style={[styles.mark, styles.holiday]} /> : null}
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    height: 5,
    marginTop: theme.spacing.xxs,
  },
  mark: { width: 5, height: 5, borderRadius: 2.5 },
  event: { backgroundColor: theme.colors.event },
  holiday: { borderWidth: 1.2, borderColor: theme.colors.holiday },
}));
