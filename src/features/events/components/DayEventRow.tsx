import { useNavigation } from '@react-navigation/native';

import { SPOKEN, spokenEvent } from '@core/a11y';
import { anniversaryAt } from '@core/events';
import { ListRow } from '@shared/ui';

import { describeOriginWithAnniversary } from '../formatEvent';

import { EventDot } from './EventDot';

import type { CalendarEvent } from '@core/events';
import type { JulianDay } from '@core/lunar';

/** Một sự kiện trong ngày đang xem; bấm để sửa. */
export function DayEventRow({
  event,
  jd,
}: {
  readonly event: CalendarEvent;
  readonly jd: JulianDay;
}) {
  const navigation = useNavigation();
  const anniversary = event.repeat === 'yearly' ? anniversaryAt(event, jd) : 0;
  return (
    <ListRow
      leading={<EventDot />}
      title={event.title}
      subtitle={describeOriginWithAnniversary(event, anniversary)}
      action={{
        onPress: () => navigation.navigate('EventEdit', { eventId: event.id }),
        hint: SPOKEN.hint.editEvent,
        chevron: true,
      }}
      presentation={{
        // Đang ở chính ngày đó nên không đọc lại ngày diễn ra.
        spokenLabel: spokenEvent({ event, anniversary, next: null }),
      }}
    />
  );
}
