import { View } from 'react-native';
import { lunarMonthName, weekdayName } from '@core/date/format';
import { formatCanChi } from '@core/lunar';
import type { DayDetail } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText } from '@shared/ui';
import { HolidayList } from './HolidayList';

/** Khối "tờ lịch": ngày dương thật to, bên dưới là ngày âm – bố cục quen thuộc của lịch bloc. */
export function DayHero({ detail }: { readonly detail: DayDetail }) {
  const styles = useStyles();
  const { solar, lunar, weekday, holidays, canChi } = detail;
  const isRedDay = weekday === 0 || holidays.some(h => h.kind === 'public');

  return (
    <View style={styles.container}>
      <AppText variant="heading" color="textMuted" align="center">
        Tháng {solar.month}, {solar.year}
      </AppText>
      <AppText
        variant="display"
        color={isRedDay ? 'holiday' : 'text'}
        align="center"
        accessibilityLabel={`Ngày ${solar.day} tháng ${solar.month} năm ${solar.year}`}
      >
        {solar.day}
      </AppText>
      <AppText
        variant="title"
        color={isRedDay ? 'holiday' : 'text'}
        align="center"
      >
        {weekdayName(weekday)}
      </AppText>

      <View style={styles.lunar}>
        <AppText variant="title" color="lunarAccent" align="center">
          {lunar.day} {lunarMonthName(lunar.month, lunar.isLeapMonth)}
        </AppText>
        <AppText color="textMuted" align="center">
          Năm {formatCanChi(canChi.year)} · Ngày {formatCanChi(canChi.day)}
        </AppText>
      </View>

      <HolidayList holidays={holidays} />
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  container: {
    alignItems: 'center',
    gap: t.spacing.xs,
    paddingVertical: t.spacing.lg,
  },
  lunar: {
    marginTop: t.spacing.md,
    marginBottom: t.spacing.sm,
    gap: t.spacing.xxs,
  },
}));
