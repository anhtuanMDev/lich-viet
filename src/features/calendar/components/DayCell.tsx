import { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { lunarCellLabel } from '@core/date/format';
import type { MonthGridCell, SolarDate } from '@core/lunar';
import { createThemedStyles, fontScaleLimit } from '@shared/theme';
import type { ColorTokens } from '@shared/theme';
import { AppText } from '@shared/ui';

export interface DayCellProps {
  readonly cell: MonthGridCell;
  readonly isToday: boolean;
  readonly hasEvent: boolean;
  readonly width: number;
  readonly height: number;
  readonly onPress: (date: SolarDate) => void;
}

function solarColor(cell: MonthGridCell): keyof ColorTokens {
  const isRedDay =
    cell.weekday === 0 || cell.holidays.some(h => h.kind === 'public');
  return isRedDay ? 'holiday' : 'text';
}

function lunarColor({ lunar }: MonthGridCell): keyof ColorTokens {
  return lunar.day === 1 || lunar.day === 15 ? 'lunarAccent' : 'textFaint';
}

export const DayCell = memo(function DayCellView({
  cell,
  isToday,
  hasEvent,
  width,
  height,
  onPress,
}: DayCellProps) {
  const styles = useStyles();
  const handlePress = useCallback(
    () => onPress(cell.solar),
    [cell.solar, onPress],
  );
  const hasHoliday = cell.holidays.length > 0;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Ngày ${cell.solar.day} tháng ${
        cell.solar.month
      }, âm lịch ${cell.lunar.day} tháng ${cell.lunar.month}${
        hasHoliday ? `, ${cell.holidays[0]?.name}` : ''
      }${hasEvent ? ', có sự kiện' : ''}`}
      style={({ pressed }) => [
        styles.cell,
        { width, height },
        !cell.inCurrentMonth && styles.outside,
        isToday && styles.today,
        pressed && styles.pressed,
      ]}
    >
      {/* Ô cao theo cellHeightFor - chữ phải dùng cùng trần phóng chữ. */}
      <AppText
        variant="heading"
        color={isToday ? 'onPrimary' : solarColor(cell)}
        maxFontSizeMultiplier={fontScaleLimit.compact}
        numberOfLines={1}
      >
        {cell.solar.day}
      </AppText>
      <AppText
        variant="caption"
        color={isToday ? 'onPrimary' : lunarColor(cell)}
        maxFontSizeMultiplier={fontScaleLimit.compact}
        // "1/12N" có thể rộng hơn ô trên màn hẹp.
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {lunarCellLabel(cell.lunar)}
      </AppText>
      {/* Hàng chấm luôn chiếm chỗ để số ngày không bị lệch giữa các ô.
          Chỉ một chấm: sự kiện cá nhân ưu tiên hơn ngày lễ. */}
      <View style={styles.dots}>
        {hasEvent || hasHoliday ? (
          <View
            style={[
              styles.dot,
              isToday
                ? styles.dotOnPrimary
                : hasEvent
                  ? styles.eventDot
                  : styles.holidayDot,
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  );
});

const useStyles = createThemedStyles(t => ({
  cell: {
    alignItems: 'center',
    paddingHorizontal: t.spacing.xxs,
    justifyContent: 'center',
    borderRadius: t.radius.sm,
  },
  outside: {
    opacity: 0.35,
  },
  today: {
    backgroundColor: t.colors.primary,
  },
  pressed: {
    backgroundColor: t.colors.surfaceMuted,
  },
  dots: {
    height: 5,
    marginTop: t.spacing.xxs,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  holidayDot: {
    backgroundColor: t.colors.holiday,
  },
  eventDot: {
    backgroundColor: t.colors.event,
  },
  dotOnPrimary: {
    backgroundColor: t.colors.onPrimary,
  },
}));
