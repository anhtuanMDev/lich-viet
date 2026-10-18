import { lunarMonthName, weekdayName } from '@core/date/format';
import type { CalendarEvent } from '@core/events';
import { formatCanChi } from '@core/lunar';
import type {
  AuspiciousHour,
  DayDetail,
  DaySummary,
  Holiday,
  LunarDate,
  MonthNumber,
  SolarDate,
  Weekday,
} from '@core/lunar';

/*
 * Mọi câu đọc cho trình đọc màn hình (TalkBack / VoiceOver) nằm ở file này.
 *
 * Chữ hiển thị viết tắt cho gọn ("T2", "1/9", "3h-5h", "Dương → Âm"), máy đọc lên sẽ khó hiểu
 * ("tê hai", "một phần chín", "mũi tên phải"). Component chỉ lấy câu từ đây, không tự ghép,
 * để cách đọc thống nhất toàn app và sửa một chỗ là đủ.
 */

/** Nhãn và gợi ý cố định. Gợi ý (hint) đọc sau nhãn, nói bấm vào sẽ làm gì. */
export const SPOKEN = {
  close: 'Đóng',
  settings: 'Cài đặt',
  prevMonth: 'Tháng trước',
  nextMonth: 'Tháng sau',
  prevYear: 'Năm trước',
  nextYear: 'Năm sau',
  prevYearPage: '12 năm trước',
  nextYearPage: '12 năm sau',
  solarToLunar: 'Đổi dương lịch sang âm lịch',
  lunarToSolar: 'Đổi âm lịch sang dương lịch',
  hint: {
    openDay: 'Mở chi tiết ngày',
    editEvent: 'Mở để xem và sửa sự kiện',
    pickMonth: 'Chọn nhanh tháng hoặc năm',
    pickYear: 'Chọn năm khác',
    backToMonths: 'Quay lại chọn tháng',
    goToday: 'Về tháng hiện tại',
  },
} as const;

/**
 * Bỏ ký tự trang trí trong chữ hiển thị trước khi đọc.
 * "+ Thêm sự kiện" → "Thêm sự kiện"; "Cài đặt máy → Google" → "Cài đặt máy, Google".
 */
export function speakable(text: string): string {
  return (
    text
      .replace(/^\s*\+\s*/, '')
      .replace(/\s*[→⇄]\s*/g, ', ')
      .replace(/\s*·\s*/g, ', ')
      .replace(/[▾▴‹›⚙︎◉▦✦]/g, '')
      .replace(/\s{2,}/g, ' ')
      // Mũi tên ở đầu/cuối câu để lại dấu phẩy thừa.
      .replace(/^[\s,]+|[\s,]+$/g, '')
  );
}

/** "mùng 9" cho 10 ngày đầu tháng âm - cách nói quen thuộc. */
const lunarDay = (day: number): string =>
  day <= 10 ? `mùng ${day}` : `ngày ${day}`;

/** "ngày 18 tháng 10 năm 2026"; kèm thứ: "Chủ nhật, ngày 18 tháng 10 năm 2026". */
export function spokenSolarDate(
  { day, month, year }: SolarDate,
  weekday?: Weekday,
): string {
  const date = `ngày ${day} tháng ${month} năm ${year}`;
  return weekday === undefined ? date : `${weekdayName(weekday)}, ${date}`;
}

/** "mùng 9 tháng Chín âm lịch" */
export const spokenLunarDate = ({ day, month, isLeapMonth }: LunarDate) =>
  `${lunarDay(day)} ${lunarMonthName(month, isLeapMonth)} âm lịch`;

/** "Tháng 10 năm 2026" */
export const spokenMonth = (year: number, month: MonthNumber) =>
  `Tháng ${month} năm ${year}`;

/** "Giờ Dần, từ 3 giờ đến 5 giờ" */
export const spokenHour = ({ branch, startHour, endHour }: AuspiciousHour) =>
  `Giờ ${branch}, từ ${startHour} giờ đến ${endHour} giờ`;

const holidayNames = (holidays: readonly Holiday[]): string[] =>
  holidays.map(h => h.name);

/** Ô ngày trên lưới lịch: "Hôm nay, Chủ nhật, ngày 18 tháng 10 năm 2026. Âm lịch mùng 9 tháng Chín. Tết Trùng cửu. Có sự kiện." */
export function spokenDayCell(
  { solar, lunar, weekday, holidays }: DaySummary,
  { isToday, hasEvent }: { isToday: boolean; hasEvent: boolean },
): string {
  return [
    `${isToday ? 'Hôm nay, ' : ''}${spokenSolarDate(solar, weekday)}`,
    spokenLunarDate(lunar),
    ...holidayNames(holidays),
    ...(hasEvent ? ['Có sự kiện'] : []),
  ].join('. ');
}

/** Khối "tờ lịch" ở đầu Chi tiết ngày, đọc thành một câu thay vì từng mảnh chữ rời. */
export function spokenDayHero({
  solar,
  lunar,
  weekday,
  holidays,
  canChi,
}: DayDetail): string {
  return [
    spokenSolarDate(solar, weekday),
    spokenLunarDate(lunar),
    `Năm ${formatCanChi(canChi.year)}, ngày ${formatCanChi(canChi.day)}`,
    ...holidayNames(holidays),
  ].join('. ');
}

/** Dòng ngày trong "Trong tháng": "Thứ bảy, ngày 10. Giải phóng Thủ đô. Sự kiện: Giỗ ông. Âm lịch mùng 1 tháng Chín." */
export function spokenAgendaDay(
  { solar, lunar, weekday, holidays }: DaySummary,
  eventTitles: readonly string[],
): string {
  return [
    `${weekdayName(weekday)}, ngày ${solar.day}`,
    ...holidayNames(holidays),
    ...eventTitles.map(title => `Sự kiện: ${title}`),
    spokenLunarDate(lunar),
  ].join('. ');
}

/** "mùng 9 tháng Chín âm lịch, lặp lại hằng năm" */
export function spokenEventOrigin({ origin, repeat }: CalendarEvent): string {
  const date =
    origin.calendar === 'lunar'
      ? repeat === 'yearly'
        ? spokenLunarDate(origin.date)
        : `${spokenLunarDate(origin.date)} năm ${origin.date.year}`
      : repeat === 'yearly'
      ? `ngày ${origin.date.day} tháng ${origin.date.month} dương lịch`
      : spokenSolarDate(origin.date);
  return `${date}, ${repeat === 'yearly' ? 'lặp lại hằng năm' : 'một lần'}`;
}

export interface SpokenEventInput {
  readonly event: CalendarEvent;
  /** Lần thứ mấy (giỗ, sinh nhật); 0 = không đọc. */
  readonly anniversary: number;
  /** Lần diễn ra kế tiếp; null với sự kiện đã qua hoặc khi đã đứng trong ngày đó. */
  readonly next: {
    readonly date: SolarDate;
    readonly weekday: Weekday;
    readonly daysAway: string;
  } | null;
}

/** Thẻ sự kiện: "Giỗ ông nội. Mùng 9 tháng Chín âm lịch, lặp lại hằng năm, lần thứ 5. Chủ nhật, ngày 18 tháng 10 năm 2026, hôm nay." */
export function spokenEvent({
  event,
  anniversary,
  next,
}: SpokenEventInput): string {
  const origin = `${spokenEventOrigin(event)}${
    anniversary > 0 ? `, lần thứ ${anniversary}` : ''
  }`;
  return [
    event.title,
    origin,
    ...(next
      ? [
          `${spokenSolarDate(
            next.date,
            next.weekday,
          )}, ${next.daysAway.toLowerCase()}`,
        ]
      : []),
  ].join('. ');
}
