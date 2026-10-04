declare const brand: unique symbol;

/** Kiểu "đóng dấu" để không truyền nhầm một number bất kỳ vào chỗ cần số ngày Julius. */
export type Brand<T, B extends string> = T & { readonly [brand]: B };

/** Số ngày Julius (Julian Day Number) - số nguyên, mỗi ngày dương lịch một giá trị. */
export type JulianDay = Brand<number, 'JulianDay'>;

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** 0 = Chủ nhật … 6 = Thứ bảy (giống Date#getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SolarDate {
  readonly year: number;
  readonly month: MonthNumber;
  readonly day: number;
}

export interface LunarDate {
  readonly year: number;
  readonly month: MonthNumber;
  readonly day: number;
  readonly isLeapMonth: boolean;
}

export type HeavenlyStem =
  | 'Giáp'
  | 'Ất'
  | 'Bính'
  | 'Đinh'
  | 'Mậu'
  | 'Kỷ'
  | 'Canh'
  | 'Tân'
  | 'Nhâm'
  | 'Quý';

export type EarthlyBranch =
  | 'Tý'
  | 'Sửu'
  | 'Dần'
  | 'Mão'
  | 'Thìn'
  | 'Tỵ'
  | 'Ngọ'
  | 'Mùi'
  | 'Thân'
  | 'Dậu'
  | 'Tuất'
  | 'Hợi';

export interface CanChi {
  readonly stem: HeavenlyStem;
  readonly branch: EarthlyBranch;
}

export type SolarTermName =
  | 'Xuân phân'
  | 'Thanh minh'
  | 'Cốc vũ'
  | 'Lập hạ'
  | 'Tiểu mãn'
  | 'Mang chủng'
  | 'Hạ chí'
  | 'Tiểu thử'
  | 'Đại thử'
  | 'Lập thu'
  | 'Xử thử'
  | 'Bạch lộ'
  | 'Thu phân'
  | 'Hàn lộ'
  | 'Sương giáng'
  | 'Lập đông'
  | 'Tiểu tuyết'
  | 'Đại tuyết'
  | 'Đông chí'
  | 'Tiểu hàn'
  | 'Đại hàn'
  | 'Lập xuân'
  | 'Vũ thủy'
  | 'Kinh trập';

export interface SolarTermInfo {
  readonly name: SolarTermName;
  /** true nếu tiết khí bắt đầu đúng vào ngày này. */
  readonly startsToday: boolean;
}

export interface AuspiciousHour {
  readonly branch: EarthlyBranch;
  /** Giờ bắt đầu theo đồng hồ (23 với giờ Tý). */
  readonly startHour: number;
  readonly endHour: number;
}

export type DayDeity =
  | 'Thanh Long'
  | 'Minh Đường'
  | 'Thiên Hình'
  | 'Chu Tước'
  | 'Kim Quỹ'
  | 'Kim Đường'
  | 'Bạch Hổ'
  | 'Ngọc Đường'
  | 'Thiên Lao'
  | 'Huyền Vũ'
  | 'Tư Mệnh'
  | 'Câu Trần';

export interface DayQuality {
  readonly deity: DayDeity;
  readonly isAuspicious: boolean;
}
