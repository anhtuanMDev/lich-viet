import { formatSolar, weekdayName } from '@core/date/format';
import { fromJulianDay, weekdayOf } from '@core/lunar';
import type { JulianDay } from '@core/lunar';
import type { CalendarEvent } from '@core/events';

/** "10/3 âm lịch · hằng năm", "2/2 nhuận/2023 âm lịch · một lần", "20/10 · hằng năm" */
export function describeOrigin({ origin, repeat }: CalendarEvent): string {
  const { day, month, year } = origin.date;
  const leap =
    origin.calendar === 'lunar' && origin.date.isLeapMonth ? ' nhuận' : '';
  const datePart =
    repeat === 'yearly'
      ? `${day}/${month}${leap}`
      : `${day}/${month}${leap}/${year}`;
  const calendarPart = origin.calendar === 'lunar' ? ' âm lịch' : '';
  return `${datePart}${calendarPart} · ${
    repeat === 'yearly' ? 'hằng năm' : 'một lần'
  }`;
}

export function describeDaysAway(daysAway: number): string {
  if (daysAway === 0) {
    return 'Hôm nay';
  }
  if (daysAway === 1) {
    return 'Ngày mai';
  }
  return `Còn ${daysAway} ngày`;
}

/** "Thứ bảy, 18/04/2026" */
export const describeSolarDay = (jd: JulianDay): string =>
  `${weekdayName(weekdayOf(jd))}, ${formatSolar(fromJulianDay(jd))}`;
