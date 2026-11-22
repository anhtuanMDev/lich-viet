import { View } from 'react-native';

import { BRANCHES } from '@core/lunar';
import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import { AppText } from '@shared/ui';

import type { EarthlyBranch } from '@core/lunar';

/** Tên 12 giờ dưới dải: giờ tốt chữ đậm màu chính, giờ thường chữ phụ (vẫn đủ tương phản). */
export function HourLabels({
  good,
}: {
  readonly good: ReadonlySet<EarthlyBranch>;
}) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      {BRANCHES.map(branch => (
        <AppText
          key={branch}
          variant="caption"
          color={good.has(branch) ? 'text' : 'textMuted'}
          align="center"
          numberOfLines={1}
          maxFontSizeMultiplier={fontScaleLimit.strip}
          style={[styles.label, good.has(branch) && styles.good]}
        >
          {branch}
        </AppText>
      ))}
    </View>
  );
}

const useStyles = createThemedStyles(() => ({
  row: { flexDirection: 'row' },
  label: { flex: 1 },
  good: { fontWeight: '600' },
}));
