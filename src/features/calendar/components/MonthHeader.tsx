import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { formatMonthTitle } from '@core/date/format';
import type { MonthKey } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText } from '@shared/ui';

export interface MonthHeaderProps {
  readonly month: MonthKey;
  /** VD: "Tháng 8 - 9 năm Bính Ngọ" */
  readonly lunarSubtitle: string;
  readonly showTodayButton: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onToday: () => void;
}

export const MonthHeader = memo(function MonthHeaderView({
  month,
  lunarSubtitle,
  showTodayButton,
  onPrev,
  onNext,
  onToday,
}: MonthHeaderProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        {showTodayButton ? (
          <Pressable
            onPress={onToday}
            accessibilityRole="button"
            style={styles.todayButton}
          >
            <AppText variant="label" color="primary">
              Hôm nay
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.row}>
        <ArrowButton label="Tháng trước" symbol="‹" onPress={onPrev} />
        <View style={styles.titles} accessibilityRole="header">
          <AppText variant="title" align="center">
            {formatMonthTitle(month.year, month.month)}
          </AppText>
          <AppText variant="label" color="lunarAccent" align="center">
            {lunarSubtitle}
          </AppText>
        </View>
        <ArrowButton label="Tháng sau" symbol="›" onPress={onNext} />
      </View>
    </View>
  );
});

interface ArrowButtonProps {
  readonly label: string;
  readonly symbol: string;
  readonly onPress: () => void;
}

const ArrowButton = memo(function ArrowButtonView({
  label,
  symbol,
  onPress,
}: ArrowButtonProps) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.arrow}
    >
      <AppText variant="title" color="textMuted">
        {symbol}
      </AppText>
    </Pressable>
  );
});

const useStyles = createThemedStyles(t => ({
  container: {
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    paddingHorizontal: t.spacing.md,
  },
  titles: {
    flex: 1,
  },
  todayButton: {
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.primarySoft,
  },
}));
