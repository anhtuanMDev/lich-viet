import { useMemo } from 'react';

import { upcomingItems } from '@core/events';
import { useEvents } from '@features/events';
import { Section } from '@shared/ui';

import { UpcomingRow } from './components/UpcomingRow';

import type { JulianDay } from '@core/lunar';

/** Ba ngày gần nhất cần để ý: sự kiện cá nhân, ngày lễ, mùng 1, rằm - kèm số ngày còn lại. */
export function UpcomingSection({ todayJd }: { readonly todayJd: JulianDay }) {
  const events = useEvents();
  const items = useMemo(
    () => upcomingItems(events, todayJd),
    [events, todayJd],
  );
  return (
    <Section title="Sắp tới" separatorInset="leading">
      {items.map(item => (
        <UpcomingRow key={item.key} item={item} />
      ))}
    </Section>
  );
}
