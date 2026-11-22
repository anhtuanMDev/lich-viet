import { useMemo } from 'react';
import { View } from 'react-native';

import { spokenHour } from '@core/a11y';
import { createThemedStyles } from '@shared/theme';
import { Section } from '@shared/ui';

import { hourStripFooter } from '../../hourStrip';

import { HourBar } from './HourBar';
import { HourLabels } from './HourLabels';

import type { AuspiciousHour } from '@core/lunar';

/**
 * Giờ hoàng đạo vẽ thành dải 24 giờ. `currentHour` (chỉ có với hôm nay) thêm vạch "bây giờ"
 * và dòng giờ tốt kế tiếp.
 */
export function HourStripView({
  hours,
  currentHour,
}: {
  readonly hours: readonly AuspiciousHour[];
  readonly currentHour: number | null;
}) {
  const styles = useStyles();
  const good = useMemo(() => new Set(hours.map(hour => hour.branch)), [hours]);
  return (
    <Section title="Giờ hoàng đạo" footer={hourStripFooter(hours, currentHour)}>
      <View
        style={styles.container}
        accessible
        accessibilityLabel={`Giờ hoàng đạo: ${hours
          .map(spokenHour)
          .join('; ')}`}
      >
        <HourBar good={good} currentHour={currentHour} />
        <HourLabels good={good} />
      </View>
    </Section>
  );
}

const useStyles = createThemedStyles(theme => ({
  container: {
    paddingHorizontal: theme.gutter,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
}));
