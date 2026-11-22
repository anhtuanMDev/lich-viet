import { Platform } from 'react-native';

import { darkColors, lightColors } from './colors';

import type { ColorTokens } from './colors';
import type { TextStyle } from 'react-native';

export type { ColorTokens } from './colors';
export { darkColors, lightColors } from './colors';

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
} as const;

/** Lề ngang của nội dung: 20pt theo bảng hệ thống iOS, 16dp theo lưới Material. */
export const gutter = Platform.select({ android: 16, default: 20 });

/**
 * Bề rộng tối đa trên màn rộng (iPad, tablet Android): danh sách không kéo dài quá tầm mắt;
 * lưới tháng giữ ô gần vuông và căn giữa.
 */
export const layout = {
  readableWidth: 820,
  calendarWidth: 600,
} as const;

export const radius = {
  /** Ô nhập: iOS bo 10, Material filled field bo 4 phía trên. */
  field: Platform.select({ android: 4, default: 10 }),
  /** Hộp thoại: Material 28. */
  dialog: Platform.select({ android: 28, default: 14 }),
  pill: 999,
} as const;

/**
 * Kích thước điều khiển theo từng nền tảng: vùng chạm tối thiểu 44pt (Apple) / 48dp
 * (Material), chiều cao hàng danh sách, nút, ô nhập.
 */
export const controlSize = {
  /** Hàng danh sách một dòng: 44pt iOS, 56dp Material. */
  row: Platform.select({ android: 56, default: 44 }),
  /** Nút cỡ thường: 50pt (iOS, capsule lớn), 40dp (Material, vùng chạm 48dp nhờ hitSlop). */
  button: Platform.select({ android: 40, default: 50 }),
  /** Nút gọn (dòng tiêu đề tháng, thanh tiêu đề). */
  buttonSmall: Platform.select({ android: 40, default: 34 }),
  /** Phân đoạn của segmented control. */
  segment: Platform.select({ android: 40, default: 32 }),
  /** Ô nhập một dòng. */
  field: Platform.select({ android: 48, default: 44 }),
  /** Vùng chạm tối thiểu. */
  touch: Platform.select({ android: 48, default: 44 }),
} as const;

type TypeStyle = Pick<
  TextStyle,
  'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'
>;

/**
 * Thang chữ theo hệ thống: SF Pro text styles (iOS) và vai chữ Material 3 (Android).
 * Không có cỡ "display" khổng lồ: thứ bậc dựa vào độ đậm và màu nhiều hơn cỡ chữ.
 */
const iosType = {
  /** Large Title - tiêu đề tháng trên màn Lịch. */
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
  /** Title 3 - ngày âm ở đầu màn Hôm nay / Chi tiết ngày. */
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0.35,
  },
  /** Tiêu đề mục ("Sắp tới", "Giờ hoàng đạo"). */
  headline: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: 0.38,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  bodyStrong: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.08,
  },
  caption: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400',
    letterSpacing: 0.06,
  },
  /** Nhãn nút. */
  button: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
} as const satisfies Record<string, TypeStyle>;

const androidType = {
  /** headlineMedium */
  largeTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
    letterSpacing: 0,
  },
  /** titleLarge */
  title: { fontSize: 22, lineHeight: 28, fontWeight: '400', letterSpacing: 0 },
  /** titleSmall - tiêu đề mục danh sách, tô màu primary ở Section. */
  headline: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  /** bodyLarge */
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0.5 },
  /** titleMedium */
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  /** bodyMedium */
  subhead: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  /** bodySmall */
  footnote: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  /** labelSmall */
  caption: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  /** labelLarge */
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
} as const satisfies Record<keyof typeof iosType, TypeStyle>;

export const typography: Readonly<Record<keyof typeof iosType, TypeStyle>> =
  Platform.OS === 'android' ? androidType : iosType;

export type TypographyVariant = keyof typeof iosType;

/**
 * Trần hệ số phóng chữ theo cài đặt cỡ chữ của máy (Android tới 2x, iOS Dynamic Type tới ~3.1x).
 * Mọi Text/TextInput phải đặt `maxFontSizeMultiplier`, nếu không chữ phóng không giới hạn.
 */
export const fontScaleLimit = {
  /** Chữ nội dung trong bố cục tự giãn (cột, danh sách). */
  content: 1.6,
  /** Chữ trong khung kích thước cố định: ô lịch, thanh tab, chữ số cỡ lớn. */
  compact: 1.3,
  /**
   * Nhãn chia đều một hàng hẹp (12 tên giờ dưới dải giờ, mỗi ô ~30pt): phóng hơn mức này là
   * "Thân", "Tuất" bị cắt. Dòng chú thích bên dưới vẫn phóng đủ cỡ và đọc lại giờ tốt.
   */
  strip: 1.1,
} as const;

export interface Theme {
  readonly dark: boolean;
  readonly colors: ColorTokens;
  readonly spacing: typeof spacing;
  readonly gutter: number;
  readonly radius: typeof radius;
  readonly controlSize: typeof controlSize;
  readonly typography: typeof typography;
}

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  spacing,
  gutter,
  radius,
  controlSize,
  typography,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  spacing,
  gutter,
  radius,
  controlSize,
  typography,
};
