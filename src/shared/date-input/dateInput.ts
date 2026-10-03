import {
  SUPPORTED_YEAR_RANGE,
  isValidSolarDate,
  leapMonthOf,
  lunarMonthLength,
  lunarToSolar,
  solarToLunar,
} from '@core/lunar';
import type { LunarDate, MonthNumber, SolarDate } from '@core/lunar';

export type ConversionDirection = 'solarToLunar' | 'lunarToSolar';

export interface ConverterInput {
  readonly direction: ConversionDirection;
  readonly day: string;
  readonly month: string;
  readonly year: string;
  /** Chỉ có ý nghĩa khi đổi âm → dương. */
  readonly isLeapMonth: boolean;
}

export type InvalidField = 'day' | 'month' | 'year';

export type ConversionResult =
  | { readonly status: 'incomplete' }
  | {
      readonly status: 'invalid';
      readonly field: InvalidField;
      readonly message: string;
    }
  | {
      readonly status: 'ok';
      readonly solar: SolarDate;
      readonly lunar: LunarDate;
    };

const INCOMPLETE: ConversionResult = { status: 'incomplete' };

const invalid = (field: InvalidField, message: string): ConversionResult => ({
  status: 'invalid',
  field,
  message,
});

const isMonth = (n: number): n is MonthNumber =>
  Number.isInteger(n) && n >= 1 && n <= 12;

/** Tháng nhuận có thể chọn cho cặp (năm, tháng) âm lịch đang nhập, nếu có. */
export function leapMonthAvailable(month: string, year: string): boolean {
  const m = Number(month);
  const y = Number(year);
  return year.length === 4 && isMonth(m) && leapMonthOf(y) === m;
}

export function convert(input: ConverterInput): ConversionResult {
  if (!input.day || !input.month || input.year.length < 4) {
    return INCOMPLETE;
  }
  const day = Number(input.day);
  const month = Number(input.month);
  const year = Number(input.year);

  if (year < SUPPORTED_YEAR_RANGE.min || year > SUPPORTED_YEAR_RANGE.max) {
    return invalid(
      'year',
      `Chỉ hỗ trợ từ năm ${SUPPORTED_YEAR_RANGE.min} đến ${SUPPORTED_YEAR_RANGE.max}`,
    );
  }
  if (!isMonth(month)) {
    return invalid('month', 'Tháng phải từ 1 đến 12');
  }

  if (input.direction === 'solarToLunar') {
    if (!isValidSolarDate(year, month, day)) {
      return invalid('day', `Tháng ${month}/${year} không có ngày ${day}`);
    }
    const solar: SolarDate = { year, month, day };
    return { status: 'ok', solar, lunar: solarToLunar(solar) };
  }

  const isLeapMonth = input.isLeapMonth && leapMonthOf(year) === month;
  const lunar: LunarDate = { year, month, day, isLeapMonth };
  const solar = lunarToSolar(lunar);
  if (solar === null) {
    const length = lunarMonthLength(year, month, isLeapMonth) ?? 29;
    return invalid(
      'day',
      `Tháng ${month}${
        isLeapMonth ? ' nhuận' : ''
      } âm lịch năm ${year} chỉ có ${length} ngày`,
    );
  }
  return { status: 'ok', solar, lunar };
}
