import { View } from 'react-native';

import { weekdayShort } from '@core/date/format';
import { createThemedStyles } from '@shared/theme';
import { AppText } from '@shared/ui';

import { isRedDay } from '../dayColors';

import type { MonthGridCell } from '@core/lunar';

/** Cột ngày đầu hàng "Trong tháng": số ngày dương (đỏ nếu Chủ nhật / nghỉ lễ) + thứ. */
export function AgendaDateColumn({ cell }: { readonly cell: MonthGridCell }) {
  const styles = useStyles();
  return (
    <View style={styles.date}>
      <AppText
        variant="bodyStrong"
        color={isRedDay(cell) ? 'holiday' : 'text'}
        style={styles.number}
      >
        {cell.solar.day}
      </AppText>
      <AppText variant="caption" color="textMuted">
        {weekdayShort(cell.weekday)}
      </AppText>
    </View>
  );
}

const useStyles = createThemedStyles(() => ({
  date: {
    alignItems: 'center',
  },
  number: {
    fontVariant: ['tabular-nums'],
  },
}));
