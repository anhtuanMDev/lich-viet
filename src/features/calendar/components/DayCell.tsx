import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SPOKEN, spokenDayCell } from '@core/a11y';
import { createThemedStyles } from '@shared/theme';

import { hasMarkedHoliday } from '../dayColors';

import { CellLunarLabel } from './cell/CellLunarLabel';
import { CellMarks } from './cell/CellMarks';
import { CellSolarDay } from './cell/CellSolarDay';

import type { MonthGridCell, SolarDate } from '@core/lunar';

export interface DayCellProps {
  readonly cell: MonthGridCell;
  readonly isToday: boolean;
  readonly hasEvent: boolean;
  readonly width: number;
  readonly height: number;
  readonly onPress: (date: SolarDate) => void;
}

/**
 * Ô ngày: số dương lịch (hôm nay nằm trong vòng tròn màu nhấn), ngày âm nhỏ bên dưới,
 * mùng 1 / rằm có ký hiệu trăng. Hàng dưới cùng: chấm đặc = sự kiện, vòng rỗng = ngày lễ.
 */
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
  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={spokenDayCell(cell, { isToday, hasEvent })}
      accessibilityHint={SPOKEN.hint.openDay}
      style={[styles.cell, { width, height }]}
    >
      {({ pressed }) => (
        <View style={cell.inCurrentMonth ? null : styles.outside}>
          <CellSolarDay cell={cell} isToday={isToday} isPressed={pressed} />
          <CellLunarLabel cell={cell} />
          <CellMarks hasEvent={hasEvent} hasHoliday={hasMarkedHoliday(cell)} />
        </View>
      )}
    </Pressable>
  );
});

const useStyles = createThemedStyles(theme => ({
  cell: {
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.separator,
  },
  outside: { opacity: 0.35 },
}));
