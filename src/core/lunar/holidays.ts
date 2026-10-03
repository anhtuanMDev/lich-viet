import type { LunarDate, MonthNumber, SolarDate } from './types';

export type HolidayKind =
  /** Ngày nghỉ lễ theo Bộ luật Lao động. */
  | 'public'
  /** Ngày truyền thống theo âm lịch (cúng, lễ hội). */
  | 'traditional'
  /** Ngày kỷ niệm, không nghỉ. */
  | 'observance';

export interface Holiday {
  readonly name: string;
  readonly kind: HolidayKind;
}

interface FixedDateHoliday extends Holiday {
  readonly month: MonthNumber;
  readonly day: number;
}

const SOLAR_HOLIDAYS: readonly FixedDateHoliday[] = [
  { month: 1, day: 1, name: 'Tết Dương lịch', kind: 'public' },
  { month: 2, day: 3, name: 'Thành lập Đảng CSVN', kind: 'observance' },
  { month: 2, day: 14, name: 'Lễ Tình nhân', kind: 'observance' },
  { month: 2, day: 27, name: 'Thầy thuốc Việt Nam', kind: 'observance' },
  { month: 3, day: 8, name: 'Quốc tế Phụ nữ', kind: 'observance' },
  { month: 3, day: 26, name: 'Thành lập Đoàn TNCS HCM', kind: 'observance' },
  { month: 4, day: 30, name: 'Giải phóng miền Nam', kind: 'public' },
  { month: 5, day: 1, name: 'Quốc tế Lao động', kind: 'public' },
  { month: 5, day: 19, name: 'Sinh nhật Bác Hồ', kind: 'observance' },
  { month: 6, day: 1, name: 'Quốc tế Thiếu nhi', kind: 'observance' },
  { month: 6, day: 28, name: 'Ngày Gia đình Việt Nam', kind: 'observance' },
  { month: 7, day: 27, name: 'Thương binh Liệt sĩ', kind: 'observance' },
  { month: 9, day: 2, name: 'Quốc khánh', kind: 'public' },
  { month: 10, day: 10, name: 'Giải phóng Thủ đô', kind: 'observance' },
  { month: 10, day: 20, name: 'Phụ nữ Việt Nam', kind: 'observance' },
  { month: 11, day: 20, name: 'Nhà giáo Việt Nam', kind: 'observance' },
  { month: 12, day: 22, name: 'Quân đội Nhân dân VN', kind: 'observance' },
  { month: 12, day: 24, name: 'Lễ Giáng sinh', kind: 'observance' },
];

/** Chỉ áp dụng cho tháng thường, không áp dụng cho tháng nhuận. */
const LUNAR_HOLIDAYS: readonly FixedDateHoliday[] = [
  { month: 1, day: 1, name: 'Tết Nguyên Đán', kind: 'public' },
  { month: 1, day: 2, name: 'Mùng 2 Tết', kind: 'public' },
  { month: 1, day: 3, name: 'Mùng 3 Tết', kind: 'public' },
  { month: 1, day: 15, name: 'Rằm tháng Giêng', kind: 'traditional' },
  { month: 3, day: 3, name: 'Tết Hàn thực', kind: 'traditional' },
  { month: 3, day: 10, name: 'Giỗ Tổ Hùng Vương', kind: 'public' },
  { month: 4, day: 15, name: 'Lễ Phật đản', kind: 'traditional' },
  { month: 5, day: 5, name: 'Tết Đoan ngọ', kind: 'traditional' },
  { month: 7, day: 15, name: 'Lễ Vu Lan', kind: 'traditional' },
  { month: 8, day: 15, name: 'Tết Trung thu', kind: 'traditional' },
  { month: 9, day: 9, name: 'Tết Trùng cửu', kind: 'traditional' },
  { month: 10, day: 10, name: 'Tết Thường tân', kind: 'traditional' },
  { month: 12, day: 23, name: 'Ông Công Ông Táo', kind: 'traditional' },
];

const NEW_YEARS_EVE: Holiday = { name: 'Giao thừa', kind: 'traditional' };

const indexByMonthDay = (list: readonly FixedDateHoliday[]) => {
  const map = new Map<number, Holiday[]>();
  for (const { month, day, name, kind } of list) {
    const key = month * 100 + day;
    map.set(key, [...(map.get(key) ?? []), { name, kind }]);
  }
  return map;
};

const solarIndex = indexByMonthDay(SOLAR_HOLIDAYS);
const lunarIndex = indexByMonthDay(LUNAR_HOLIDAYS);
const EMPTY: readonly Holiday[] = [];

export interface HolidayQuery {
  readonly solar: SolarDate;
  readonly lunar: LunarDate;
  /** Ngày âm của hôm sau – dùng để nhận ra ngày cuối tháng Chạp (Giao thừa/Tất niên). */
  readonly nextLunar: LunarDate;
}

export function holidaysOf({
  solar,
  lunar,
  nextLunar,
}: HolidayQuery): readonly Holiday[] {
  const solarHits = solarIndex.get(solar.month * 100 + solar.day) ?? EMPTY;
  const lunarHits = lunar.isLeapMonth
    ? EMPTY
    : lunarIndex.get(lunar.month * 100 + lunar.day) ?? EMPTY;
  const isNewYearsEve =
    nextLunar.month === 1 && nextLunar.day === 1 && !nextLunar.isLeapMonth;

  if (solarHits.length === 0 && lunarHits.length === 0 && !isNewYearsEve) {
    return EMPTY;
  }
  return [
    ...lunarHits,
    ...(isNewYearsEve ? [NEW_YEARS_EVE] : []),
    ...solarHits,
  ];
}
