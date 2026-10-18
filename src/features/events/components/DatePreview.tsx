import { spokenLunarDate, spokenSolarDate } from '@core/a11y';
import { formatSolar, lunarMonthName, weekdayName } from '@core/date/format';
import type { EventCalendar } from '@core/events';
import { formatCanChi, toJulianDay, weekdayOf, yearCanChi } from '@core/lunar';
import { useAnnounce } from '@shared/a11y';
import type { ConversionResult } from '@shared/date-input';
import { AppText } from '@shared/ui';

interface Preview {
  readonly text: string;
  /** Câu đọc cho trình đọc màn hình (xem core/a11y). */
  readonly spoken: string;
  readonly invalid: boolean;
}

function previewOf(
  calendar: EventCalendar,
  result: ConversionResult,
): Preview | null {
  if (result.status === 'incomplete') {
    return null;
  }
  if (result.status === 'invalid') {
    return { text: result.message, spoken: result.message, invalid: true };
  }
  const { solar, lunar } = result;
  if (calendar === 'lunar') {
    const weekday = weekdayOf(toJulianDay(solar));
    return {
      text: `Dương lịch: ${weekdayName(weekday)}, ${formatSolar(solar)}`,
      spoken: `Dương lịch: ${spokenSolarDate(solar, weekday)}`,
      invalid: false,
    };
  }
  const yearName = formatCanChi(yearCanChi(lunar.year));
  return {
    text: `Âm lịch: ${lunar.day} ${lunarMonthName(
      lunar.month,
      lunar.isLeapMonth,
    )} năm ${yearName}`,
    spoken: `${spokenLunarDate(lunar)}, năm ${yearName}`,
    invalid: false,
  };
}

/** Dòng "tương ứng" bên dưới ô nhập ngày - để người dùng chắc chắn đã chọn đúng ngày. */
export function DatePreview({
  calendar,
  result,
}: {
  readonly calendar: EventCalendar;
  readonly result: ConversionResult;
}) {
  const preview = previewOf(calendar, result);
  // iOS không có live region: tự đọc khi ngày tương ứng / lỗi đổi.
  useAnnounce(preview?.spoken ?? null);
  if (!preview) {
    return null;
  }
  return (
    <AppText
      variant="label"
      color={preview.invalid ? 'holiday' : 'lunarAccent'}
      accessibilityLabel={preview.spoken}
      accessibilityLiveRegion="polite"
    >
      {preview.text}
    </AppText>
  );
}
