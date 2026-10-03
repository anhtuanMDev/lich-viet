import { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { formatLunarShort, weekdayShort } from '@core/date/format';
import { eventsByDay } from '@core/events';
import type { CalendarEvent } from '@core/events';
import { getMonthGrid } from '@core/lunar';
import type {
  MonthGridCell,
  MonthNumber,
  SolarDate,
  WeekStart,
} from '@core/lunar';
import { createThemedStyles } from '@shared/theme';
import { AppText, Card } from '@shared/ui';

export interface MonthAgendaProps {
  readonly year: number;
  readonly month: MonthNumber;
  readonly weekStart: WeekStart;
  readonly events: readonly CalendarEvent[];
  readonly onPressDay: (date: SolarDate) => void;
}

interface AgendaDay {
  readonly cell: MonthGridCell;
  readonly events: readonly CalendarEvent[];
}

/** Ngày lễ và sự kiện cá nhân trong tháng đang xem, theo thứ tự ngày. */
export const MonthAgenda = memo(function MonthAgendaView({
  year,
  month,
  weekStart,
  events,
  onPressDay,
}: MonthAgendaProps) {
  const days = useMemo((): AgendaDay[] => {
    const inMonth = getMonthGrid({ year, month }, weekStart).filter(
      cell => cell.inCurrentMonth,
    );
    const first = inMonth[0];
    const last = inMonth[inMonth.length - 1];
    if (!first || !last) {
      return [];
    }
    const byDay = eventsByDay(events, first.jd, last.jd);
    return inMonth
      .map(cell => ({ cell, events: byDay.get(cell.jd) ?? [] }))
      .filter(day => day.cell.holidays.length > 0 || day.events.length > 0);
  }, [year, month, weekStart, events]);

  if (days.length === 0) {
    return null;
  }
  return (
    <Card title="Trong tháng">
      {days.map(day => (
        <AgendaRow key={day.cell.jd} day={day} onPress={onPressDay} />
      ))}
    </Card>
  );
});

const AgendaRow = memo(function AgendaRowView({
  day: { cell, events },
  onPress,
}: {
  readonly day: AgendaDay;
  readonly onPress: (date: SolarDate) => void;
}) {
  const styles = useStyles();
  const isRedDay =
    cell.weekday === 0 || cell.holidays.some(h => h.kind === 'public');
  return (
    <Pressable
      onPress={() => onPress(cell.solar)}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.date}>
        <AppText variant="heading" color={isRedDay ? 'holiday' : 'text'}>
          {cell.solar.day}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {weekdayShort(cell.weekday)}
        </AppText>
      </View>
      <View style={styles.names}>
        {cell.holidays.map(holiday => (
          <AppText key={holiday.name}>{holiday.name}</AppText>
        ))}
        {events.map(event => (
          <AppText key={event.id} color="event">
            {event.title}
          </AppText>
        ))}
        <AppText variant="caption" color="lunarAccent">
          Âm lịch {formatLunarShort(cell.lunar)}
        </AppText>
      </View>
    </Pressable>
  );
});

const useStyles = createThemedStyles(t => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.sm,
  },
  pressed: {
    backgroundColor: t.colors.surfaceMuted,
  },
  date: {
    width: 40,
    alignItems: 'center',
  },
  names: {
    flex: 1,
    gap: t.spacing.xxs,
  },
}));
