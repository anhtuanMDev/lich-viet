import { formatSolar, lunarMonthName, weekdayName } from '@core/date/format';
import type { EventCalendar } from '@core/events';
import { formatCanChi, toJulianDay, weekdayOf, yearCanChi } from '@core/lunar';
import type { ConversionResult } from '@shared/date-input';
import { AppText } from '@shared/ui';

/** Dòng "tương ứng" bên dưới ô nhập ngày – để người dùng chắc chắn đã chọn đúng ngày. */
export function DatePreview({
  calendar,
  result,
}: {
  readonly calendar: EventCalendar;
  readonly result: ConversionResult;
}) {
  if (result.status === 'incomplete') {
    return null;
  }
  if (result.status === 'invalid') {
    return (
      <AppText variant="label" color="holiday" accessibilityLiveRegion="polite">
        {result.message}
      </AppText>
    );
  }
  const { solar, lunar } = result;
  const text =
    calendar === 'lunar'
      ? `Dương lịch: ${weekdayName(
          weekdayOf(toJulianDay(solar)),
        )}, ${formatSolar(solar)}`
      : `Âm lịch: ${lunar.day} ${lunarMonthName(
          lunar.month,
          lunar.isLeapMonth,
        )} năm ${formatCanChi(yearCanChi(lunar.year))}`;
  return (
    <AppText
      variant="label"
      color="lunarAccent"
      accessibilityLiveRegion="polite"
    >
      {text}
    </AppText>
  );
}
