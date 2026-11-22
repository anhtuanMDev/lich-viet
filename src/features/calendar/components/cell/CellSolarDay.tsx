import { View } from 'react-native';

import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import { AppText } from '@shared/ui';

import { TODAY_CIRCLE } from '../../constants';
import { solarDayColor } from '../../dayColors';

import type { MonthGridCell } from '@core/lunar';

/** Số dương lịch; hôm nay nằm trong vòng tròn màu nhấn, đang bấm thì nền xám. */
export function CellSolarDay({
  cell,
  isToday,
  isPressed,
}: {
  readonly cell: MonthGridCell;
  readonly isToday: boolean;
  readonly isPressed: boolean;
}) {
  const styles = useStyles();
  return (
    <View
      style={[
        styles.circle,
        isPressed && styles.pressed,
        isToday && styles.today,
      ]}
    >
      {/* Ô cao theo cellHeightFor - chữ phải dùng cùng trần phóng chữ. */}
      <AppText
        variant={isToday ? 'bodyStrong' : 'body'}
        color={solarDayColor(cell, isToday)}
        maxFontSizeMultiplier={fontScaleLimit.compact}
        style={styles.number}
      >
        {cell.solar.day}
      </AppText>
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  circle: {
    alignSelf: 'center',
    minWidth: TODAY_CIRCLE,
    height: TODAY_CIRCLE,
    borderRadius: TODAY_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxs,
  },
  today: { backgroundColor: theme.colors.primary },
  pressed: { backgroundColor: theme.colors.fill },
  number: { fontVariant: ['tabular-nums'] },
}));
