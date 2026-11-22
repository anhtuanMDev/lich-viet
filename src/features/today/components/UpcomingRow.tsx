import { useNavigation } from '@react-navigation/native';

import { SPOKEN, spokenSolarDate } from '@core/a11y';
import { formatLunarShort } from '@core/date/format';
import { describeDaysAway, shortDaysAway } from '@features/events';
import { ListRow } from '@shared/ui';

import { shortSolarDay } from '../upcoming';

import { UpcomingMark } from './UpcomingMark';

import type { UpcomingItem } from '@core/events';

/** Dòng phụ: sự kiện âm lịch thì kèm ngày âm gốc trước ngày dương. */
const subtitleOf = (item: UpcomingItem): string =>
  item.kind === 'event'
    ? `${formatLunarShort(item.day.lunar)} âm lịch · ${shortSolarDay(item.day)}`
    : shortSolarDay(item.day);

const spokenOf = (item: UpcomingItem): string =>
  [
    item.title,
    spokenSolarDate(item.day.solar, item.day.weekday),
    describeDaysAway(item.daysAway),
  ].join('. ');

/** Một ngày sắp tới; bấm mở sự kiện (nếu là sự kiện) hoặc chi tiết ngày. */
export function UpcomingRow({ item }: { readonly item: UpcomingItem }) {
  const navigation = useNavigation();
  const { eventId } = item;
  const open = () =>
    eventId
      ? navigation.navigate('EventEdit', { eventId })
      : navigation.navigate('DayDetail', { date: item.day.solar });
  return (
    <ListRow
      leading={<UpcomingMark item={item} />}
      title={item.title}
      subtitle={subtitleOf(item)}
      value={shortDaysAway(item.daysAway)}
      action={{
        onPress: open,
        hint: eventId ? SPOKEN.hint.editEvent : SPOKEN.hint.openDay,
      }}
      presentation={{
        valueColor: item.daysAway <= 1 ? 'primary' : 'textMuted',
        spokenLabel: spokenOf(item),
      }}
    />
  );
}
