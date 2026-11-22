import { useMemo } from 'react';
import { View } from 'react-native';

import { spokenDayHero } from '@core/a11y';
import { lunarDayTitle, solarDayTitle } from '@core/date/format';
import { moonPhaseOf } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText, Moon } from '@shared/ui';

import type { DayDetail } from '@core/lunar';

/** Trăng đúng pha + ngày âm + ngày dương. Đọc thành một câu (đầu trang, nên là heading). */
export function DayHeader({
  detail,
  inSheet = false,
}: {
  readonly detail: DayDetail;
  readonly inSheet?: boolean;
}) {
  const styles = useStyles();
  const { jd, solar, lunar, weekday, holidays } = detail;
  const phase = useMemo(() => moonPhaseOf(jd), [jd]);
  const isRedDay =
    weekday === 0 || holidays.some(holiday => holiday.kind === 'public');

  return (
    <View
      style={[styles.container, inSheet && styles.inSheet]}
      accessible
      accessibilityRole="header"
      accessibilityLabel={spokenDayHero(detail)}
    >
      <Moon phase={phase} size={44} />
      <View style={styles.text}>
        <AppText variant="title">{lunarDayTitle(lunar)}</AppText>
        <AppText variant="subhead" color={isRedDay ? 'holiday' : 'textMuted'}>
          {solarDayTitle(solar, weekday)}
        </AppText>
        {holidays.map(holiday => (
          <AppText
            key={holiday.name}
            variant="subhead"
            color={holiday.kind === 'observance' ? 'text' : 'holiday'}
          >
            {holiday.name}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.lg,
    paddingHorizontal: t.gutter,
    paddingTop: t.spacing.sm,
  },
  inSheet: {
    paddingTop: t.spacing.xxl,
  },
  text: {
    flex: 1,
    gap: 2,
  },
}));
