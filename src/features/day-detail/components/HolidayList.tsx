import { View } from 'react-native';
import type { Holiday } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { Chip } from '@shared/ui';

export function HolidayList({
  holidays,
}: {
  readonly holidays: readonly Holiday[];
}) {
  const styles = useStyles();
  if (holidays.length === 0) {
    return null;
  }
  return (
    <View style={styles.row}>
      {holidays.map(holiday => (
        <Chip
          key={holiday.name}
          label={holiday.name}
          tone={holiday.kind === 'observance' ? 'neutral' : 'primary'}
        />
      ))}
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.spacing.sm,
  },
}));
