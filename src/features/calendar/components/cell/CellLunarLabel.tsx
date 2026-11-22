import { View } from 'react-native';

import { lunarCellLabel } from '@core/date/format';
import { lunarMarkOf } from '@core/lunar';
import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import { AppText, MoonMark } from '@shared/ui';

import { lunarDayColor } from '../../dayColors';

import type { MonthGridCell } from '@core/lunar';

const MOON_MARK_SIZE = 7;

/** Ngày âm nhỏ dưới số dương lịch; mùng 1 / rằm có ký hiệu trăng và in đậm. */
export function CellLunarLabel({ cell }: { readonly cell: MonthGridCell }) {
  const styles = useStyles();
  const mark = lunarMarkOf(cell.lunar);
  return (
    <View style={styles.row}>
      {mark ? <MoonMark kind={mark} size={MOON_MARK_SIZE} /> : null}
      <AppText
        variant="caption"
        color={lunarDayColor(cell)}
        maxFontSizeMultiplier={fontScaleLimit.compact}
        numberOfLines={1}
        style={mark ? styles.strong : null}
      >
        {lunarCellLabel(cell.lunar)}
      </AppText>
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: theme.spacing.xxs,
  },
  strong: { fontWeight: '600' },
}));
