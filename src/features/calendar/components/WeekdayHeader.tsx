import { memo } from 'react';
import { View } from 'react-native';

import { weekdayShort } from '@core/date/format';
import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import { AppText } from '@shared/ui';

import type { Weekday, WeekStart } from '@core/lunar';

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
          variant="footnote"
          color={weekday === 0 ? 'holiday' : 'textMuted'}
          align="center"
          // Bảy cột chia đều theo ô lịch bên dưới.
          maxFontSizeMultiplier={fontScaleLimit.compact}
          numberOfLines={1}
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
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.xs,
  },
  cell: {
    flex: 1,
  },
}));
