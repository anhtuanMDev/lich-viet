import type {
  AuspiciousHour,
  LunarDate,
  MonthNumber,
  SolarDate,
  Weekday,
} from '@core/lunar';

const WEEKDAY_NAMES: Readonly<Record<Weekday, string>> = {
  0: 'Chủ nhật',
  1: 'Thứ hai',
  2: 'Thứ ba',
  3: 'Thứ tư',
  4: 'Thứ năm',
  5: 'Thứ sáu',
  6: 'Thứ bảy',
};

const WEEKDAY_SHORT: Readonly<Record<Weekday, string>> = {
  0: 'CN',
  1: 'T2',
  2: 'T3',
  3: 'T4',
  4: 'T5',
  5: 'T6',
  6: 'T7',
};

const LUNAR_MONTH_NAMES: Readonly<Record<MonthNumber, string>> = {
  1: 'Giêng',
  2: 'Hai',
  3: 'Ba',
  4: 'Tư',
  5: 'Năm',
  6: 'Sáu',
  7: 'Bảy',
  8: 'Tám',
  9: 'Chín',
  10: 'Mười',
  11: 'Mười một',
  12: 'Chạp',
};

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const weekdayName = (weekday: Weekday): string => WEEKDAY_NAMES[weekday];
export const weekdayShort = (weekday: Weekday): string =>
  WEEKDAY_SHORT[weekday];

/** 03/10/2026 */
export const formatSolar = ({ day, month, year }: SolarDate): string =>
  `${pad2(day)}/${pad2(month)}/${year}`;

export const formatMonthTitle = (year: number, month: MonthNumber): string =>
  `Tháng ${month}, ${year}`;

/** 22/8 hoặc 2/2 nhuận */
export const formatLunarShort = ({
  day,
  month,
  isLeapMonth,
}: LunarDate): string => `${day}/${month}${isLeapMonth ? ' nhuận' : ''}`;

/** "tháng Chạp nhuận" */
export const lunarMonthName = (
  month: MonthNumber,
  isLeapMonth: boolean,
): string => `tháng ${LUNAR_MONTH_NAMES[month]}${isLeapMonth ? ' nhuận' : ''}`;

/** Nhãn trong ô lịch: hiện cả tháng vào mùng 1 để người xem biết đã sang tháng mới. */
export const lunarCellLabel = ({
  day,
  month,
  isLeapMonth,
}: LunarDate): string =>
  day === 1 ? `1/${month}${isLeapMonth ? 'N' : ''}` : String(day);

export const formatHourRange = ({
  startHour,
  endHour,
}: AuspiciousHour): string => `${startHour}h-${endHour}h`;

/** 2026-10-03 - dạng dùng trong deep link. */
export const toIsoDate = ({ year, month, day }: SolarDate): string =>
  `${year}-${pad2(month)}-${pad2(day)}`;
