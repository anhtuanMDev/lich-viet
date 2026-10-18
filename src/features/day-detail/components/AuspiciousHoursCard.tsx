import { View } from 'react-native';
import { spokenHour } from '@core/a11y';
import { formatHourRange } from '@core/date/format';
import type { AuspiciousHour } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText, Card } from '@shared/ui';

export function AuspiciousHoursCard({
  hours,
}: {
  readonly hours: readonly AuspiciousHour[];
}) {
  const styles = useStyles();
  return (
    <Card title="Giờ hoàng đạo">
      <View style={styles.grid}>
        {hours.map(hour => (
          <View
            key={hour.branch}
            style={styles.item}
            accessible
            accessibilityLabel={spokenHour(hour)}
          >
            <AppText variant="heading">{hour.branch}</AppText>
            {/* "15h-17h" ba cột trên màn hẹp + chữ to sẽ dính sang cột bên. */}
            <AppText
              variant="label"
              color="textMuted"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {formatHourRange(hour)}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const useStyles = createThemedStyles(t => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: t.spacing.md,
  },
  item: {
    width: '33.33%',
    alignItems: 'center',
    paddingHorizontal: t.spacing.xs,
  },
}));
