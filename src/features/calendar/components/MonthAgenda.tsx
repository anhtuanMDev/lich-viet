import { memo, useMemo } from 'react';

import { SPOKEN, spokenAgendaDay } from '@core/a11y';
import { lunarDayTitle } from '@core/date/format';
import { eventsByDay } from '@core/events';
import { getMonthGrid } from '@core/lunar';
import { EventDot } from '@features/events';
import { ListRow, Section } from '@shared/ui';

import { AgendaDateColumn } from './AgendaDateColumn';

import type { CalendarEvent } from '@core/events';
import type {
  MonthGridCell,
  MonthNumber,
  SolarDate,
  WeekStart,
} from '@core/lunar';

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

/** Cột ngày đầu hàng: số ngày + thứ. */
const DATE_COLUMN = 36;
/** Chấm sự kiện cuối hàng - nhỏ như chấm trên lưới lịch. */
const AGENDA_DOT_SIZE = 7;

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
    <Section title="Trong tháng" separatorInset={DATE_COLUMN}>
      {days.map(day => (
        <AgendaRow key={day.cell.jd} day={day} onPress={onPressDay} />
      ))}
    </Section>
  );
});

const AgendaRow = memo(function AgendaRowView({
  day: { cell, events },
  onPress,
}: {
  readonly day: AgendaDay;
  readonly onPress: (date: SolarDate) => void;
}) {
  const names = [
    ...events.map(event => event.title),
    ...cell.holidays.map(holiday => holiday.name),
  ];
  return (
    <ListRow
      leading={<AgendaDateColumn cell={cell} />}
      title={names.join(' · ')}
      subtitle={lunarDayTitle(cell.lunar)}
      trailing={
        events.length > 0 ? <EventDot size={AGENDA_DOT_SIZE} /> : undefined
      }
      action={{ onPress: () => onPress(cell.solar), hint: SPOKEN.hint.openDay }}
      presentation={{
        leadingWidth: DATE_COLUMN,
        spokenLabel: spokenAgendaDay(
          cell,
          events.map(event => event.title),
        ),
      }}
    />
  );
});
