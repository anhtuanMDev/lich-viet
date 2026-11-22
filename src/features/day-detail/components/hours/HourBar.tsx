import { View } from 'react-native';

import { BRANCHES } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';

import { positionOf } from '../../hourStrip';

import type { EarthlyBranch } from '@core/lunar';

const PERCENT = 100;

/**
 * 12 ô bằng nhau (mỗi ô 2 giờ). Giờ tốt là thanh dày màu nhấn, giờ thường chỉ là vạch mảnh:
 * phân biệt bằng hình, không chỉ bằng màu. Vạch đứng là giờ hiện tại.
 */
export function HourBar({
  good,
  currentHour,
}: {
  readonly good: ReadonlySet<EarthlyBranch>;
  readonly currentHour: number | null;
}) {
  const styles = useStyles();
  return (
    <View style={styles.track}>
      {BRANCHES.map(branch => (
        <View
          key={branch}
          style={[styles.segment, good.has(branch) && styles.good]}
        />
      ))}
      {currentHour === null ? null : (
        <View
          style={[
            styles.now,
            { left: `${String(positionOf(currentHour) * PERCENT)}%` },
          ]}
        />
      )}
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  track: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 8 },
  segment: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.textFaint,
  },
  good: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  now: {
    position: 'absolute',
    top: -5,
    width: 2,
    marginLeft: -1,
    height: 18,
    borderRadius: 1,
    backgroundColor: theme.colors.text,
  },
}));
