import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { eventsByDay } from '@core/events';
import { fromJulianDay } from '@core/lunar';
import { ActionRow, Section } from '@shared/ui';

import { useEvents } from '../eventRepository';

import { DayEventRow } from './DayEventRow';

import type { JulianDay } from '@core/lunar';

export interface DayEventsSectionProps {
  readonly jd: JulianDay;
  readonly title: string;
  /** Không hiện gì khi ngày không có sự kiện (màn Hôm nay). */
  readonly hideWhenEmpty?: boolean;
}

/** Sự kiện cá nhân rơi vào một ngày + hàng thêm sự kiện cho chính ngày đó. */
export function DayEventsSection({
  jd,
  title,
  hideWhenEmpty = false,
}: DayEventsSectionProps) {
  const navigation = useNavigation();
  const events = useEvents();
  const dayEvents = useMemo(
    () => eventsByDay(events, jd, jd).get(jd) ?? [],
    [events, jd],
  );

  const addEvent = useCallback(
    () => navigation.navigate('EventEdit', { date: fromJulianDay(jd) }),
    [jd, navigation],
  );

  if (hideWhenEmpty && dayEvents.length === 0) {
    return null;
  }
  return (
    <Section title={title} separatorInset="leading">
      {dayEvents.map(event => (
        <DayEventRow key={event.id} event={event} jd={jd} />
      ))}
      {hideWhenEmpty ? null : (
        <ActionRow
          key="add"
          icon="add"
          label="Thêm sự kiện vào ngày này"
          onPress={addEvent}
        />
      )}
    </Section>
  );
}
