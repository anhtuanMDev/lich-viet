import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { eventsByDay } from '@core/events';
import type { CalendarEvent } from '@core/events';
import { getMonthGrid, isSameSolarDate } from '@core/lunar';
import type { JulianDay, MonthNumber, SolarDate, WeekStart } from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { DayCell } from './DayCell';

const NO_EVENT_DAYS: ReadonlyMap<JulianDay, readonly CalendarEvent[]> =
  new Map();

export interface MonthGridProps {
  readonly year: number;
  readonly month: MonthNumber;
  readonly weekStart: WeekStart;
  readonly today: SolarDate;
  readonly events: readonly CalendarEvent[];
  readonly width: number;
  readonly cellHeight: number;
  readonly onPressDay: (date: SolarDate) => void;
}

export const MonthGrid = memo(function MonthGridView({
  year,
  month,
  weekStart,
  today,
  events,
  width,
  cellHeight,
  onPressDay,
}: MonthGridProps) {
  const styles = useStyles();
  // Nhận year/month dạng số (không phải object) để memo so sánh theo giá trị.
  const cells = useMemo(
    () => getMonthGrid({ year, month }, weekStart),
    [year, month, weekStart],
  );
  const eventDays = useMemo(() => {
    const first = cells[0];
    const last = cells[cells.length - 1];
    return first && last
      ? eventsByDay(events, first.jd, last.jd)
      : NO_EVENT_DAYS;
  }, [cells, events]);
  const cellWidth = width / 7;

  return (
    <View style={[styles.grid, { width }]}>
      {cells.map(cell => (
        <DayCell
          key={cell.jd}
          cell={cell}
          isToday={isSameSolarDate(cell.solar, today)}
          hasEvent={eventDays.has(cell.jd)}
          width={cellWidth}
          height={cellHeight}
          onPress={onPressDay}
        />
      ))}
    </View>
  );
});

const useStyles = createThemedStyles(() => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));
