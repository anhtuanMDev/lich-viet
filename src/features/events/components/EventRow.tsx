import { memo } from 'react';

import { SPOKEN, spokenEvent } from '@core/a11y';
import { anniversaryAt } from '@core/events';
import { fromJulianDay, weekdayOf } from '@core/lunar';
import { ListRow } from '@shared/ui';

import {
  describeDaysAway,
  describeOriginWithAnniversary,
  describeSolarDay,
  shortDaysAway,
} from '../formatEvent';

import type { CalendarEvent } from '@core/events';
import type { JulianDay } from '@core/lunar';

export interface EventRowProps {
  readonly event: CalendarEvent;
  /** Lần diễn ra kế tiếp; null với sự kiện một lần đã qua. */
  readonly next: { readonly date: JulianDay; readonly daysAway: number } | null;
  readonly onPress: (id: string) => void;
}

/** Chỉ hai dòng cho tên sự kiện dài; phần còn lại cắt bằng "…". */
const TITLE_LINES = 2;

/**
 * Tên sự kiện, dòng phụ là lần diễn ra kế tiếp và ngày gốc (âm/dương, lặp);
 * cuối hàng là số ngày còn lại.
 */
export const EventRow = memo(function EventRowView({
  event,
  next,
  onPress,
}: EventRowProps) {
  const anniversary =
    next && event.repeat === 'yearly' ? anniversaryAt(event, next.date) : 0;
  const origin = describeOriginWithAnniversary(event, anniversary);

  return (
    <ListRow
      title={event.title}
      subtitle={next ? `${describeSolarDay(next.date)}\n${origin}` : origin}
      value={next ? shortDaysAway(next.daysAway) : undefined}
      action={{
        onPress: () => onPress(event.id),
        hint: SPOKEN.hint.editEvent,
        chevron: true,
      }}
      presentation={{
        titleLines: TITLE_LINES,
        valueColor: next && next.daysAway <= 1 ? 'primary' : 'textMuted',
        spokenLabel: spokenEvent({
          event,
          anniversary,
          next: next && {
            date: fromJulianDay(next.date),
            weekday: weekdayOf(next.date),
            daysAway: describeDaysAway(next.daysAway),
          },
        }),
      }}
    />
  );
});
