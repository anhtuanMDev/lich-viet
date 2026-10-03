import {
  formatSolar,
  lunarMonthName,
  toIsoDate,
  weekdayName,
} from '@core/date/format';
import { anniversaryAt } from '@core/events';
import { fromJulianDay, jdToLunar, weekdayOf } from '@core/lunar';
import type { JulianDay } from '@core/lunar';
import type { DailyReminder, NotificationContent, ReminderItem } from './types';

const whenLabel = (daysBefore: number): string => {
  if (daysBefore === 0) {
    return 'Hôm nay';
  }
  if (daysBefore === 1) {
    return 'Ngày mai';
  }
  return `Còn ${daysBefore} ngày`;
};

/** "Thứ bảy 03/10 (23/8 âm)" */
function dayLabel(jd: JulianDay): string {
  const solar = fromJulianDay(jd);
  const lunar = jdToLunar(jd);
  const solarText = formatSolar(solar).slice(0, 5);
  return `${weekdayName(weekdayOf(jd))} ${solarText} (${lunar.day}/${
    lunar.month
  }${lunar.isLeapMonth ? 'N' : ''} âm)`;
}

function itemTitle(item: ReminderItem): string {
  if (item.kind === 'event') {
    const anniversary =
      item.event.repeat === 'yearly'
        ? anniversaryAt(item.event, item.occurrence)
        : 0;
    return `${item.event.title}${
      anniversary > 0 ? ` (lần thứ ${anniversary})` : ''
    }`;
  }
  const lunar = jdToLunar(item.occurrence);
  const month = lunarMonthName(lunar.month, lunar.isLeapMonth);
  return item.phase === 'firstDay' ? `Mùng 1 ${month}` : `Rằm ${month}`;
}

/** Một dòng tóm tắt: "Ngày mai: Rằm tháng Tám". */
const itemLine = (item: ReminderItem): string =>
  `${whenLabel(item.daysBefore)}: ${itemTitle(item)}`;

export function notificationContent({
  items,
}: DailyReminder): NotificationContent {
  const [first, ...rest] = items;
  if (!first) {
    return { title: 'Lịch Việt', body: '', url: 'lichviet://today' };
  }
  const url = `lichviet://day/${toIsoDate(fromJulianDay(first.occurrence))}`;
  if (rest.length === 0) {
    return { title: itemLine(first), body: dayLabel(first.occurrence), url };
  }
  return {
    title: `${itemLine(first)} và ${rest.length} việc khác`,
    body: items.map(itemLine).join('\n'),
    url,
  };
}
