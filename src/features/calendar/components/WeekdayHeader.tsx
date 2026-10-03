import { memo } from 'react';
import { View } from 'react-native';
import { weekdayShort } from '@core/date/format';
import type { Weekday, WeekStart } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText } from '@shared/ui';

const orderFrom = (start: WeekStart): Weekday[] =>
  Array.from({ length: 7 }, (_, i) => ((start + i) % 7) as Weekday);

export const WeekdayHeader = memo(function WeekdayHeaderView({
  weekStart,
}: {
  readonly weekStart: WeekStart;
}) {
  const styles = useStyles();
  return (
    <View style={styles.row} importantForAccessibility="no-hide-descendants">
      {orderFrom(weekStart).map(weekday => (
        <AppText
          key={weekday}
          variant="label"
          color={weekday === 0 ? 'holiday' : 'textMuted'}
          align="center"
          style={styles.cell}
        >
          {weekdayShort(weekday)}
        </AppText>
      ))}
    </View>
  );
});

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    paddingVertical: t.spacing.sm,
  },
  cell: {
    flex: 1,
  },
}));
