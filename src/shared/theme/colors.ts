import { Platform } from 'react-native';

/**
 * Vai màu dùng chung cho cả hai hệ điều hành. Giá trị khác nhau theo nền tảng:
 * iOS theo màu hệ thống của Apple (nền trắng/đen, nhãn xám), Android theo vai màu
 * Material 3 sinh từ màu đỏ son (nền và bề mặt ánh hồng nhẹ theo tông màu chính).
 */
export interface ColorTokens {
  /** Nền màn hình. */
  readonly background: string;
  /** Bề mặt nổi: sheet, hộp thoại, thanh điều hướng Android. */
  readonly surface: string;
  /** Nền ô nhập, rãnh segmented control, trạng thái bấm. */
  readonly fill: string;
  /** Đường kẻ mảnh giữa các hàng (iOS) / viền nhẹ (Android). */
  readonly separator: string;
  /** Viền ô nhập (Android) - đậm hơn separator. */
  readonly outline: string;
  readonly text: string;
  /** Chữ phụ: dòng mô tả, giá trị bên phải. Đủ tương phản cho chữ nhỏ. */
  readonly textMuted: string;
  /** Chữ mờ: ngày ngoài tháng, trạng thái tắt. */
  readonly textFaint: string;
  /** Màu nhấn duy nhất: đỏ son. Cũng là màu Chủ nhật và ngày lễ nghỉ. */
  readonly primary: string;
  readonly onPrimary: string;
  /** Nền nhạt của màu nhấn: nút tonal, ô đang chọn. */
  readonly primaryContainer: string;
  readonly onPrimaryContainer: string;
  /** Chỉ báo tab đang chọn (Android), nền chip chọn. */
  readonly secondaryContainer: string;
  readonly onSecondaryContainer: string;
  /** Chủ nhật, ngày lễ nghỉ. */
  readonly holiday: string;
  /** Chữ thông tin âm lịch (mùng 1, rằm, ngày âm nổi bật). */
  readonly lunarAccent: string;
  /** Phần sáng của mặt trăng. */
  readonly moonLit: string;
  /** Phần tối của mặt trăng - đủ khác nền để thấy hình đĩa. */
  readonly moonShade: string;
  /** Sự kiện cá nhân (giỗ, sinh nhật…). */
  readonly event: string;
  readonly auspicious: string;
  readonly danger: string;
  /** Ô đang chọn của segmented control iOS (nền nổi). */
  readonly segmentThumb: string;
  /** Màu bóng đổ (iOS) - luôn đen, độ mờ đặt ở style. */
  readonly shadow: string;
  /** Lớp mờ phía sau hộp thoại: iOS ~40% đen, Material 3 scrim 32%. */
  readonly scrim: string;
}

const iosLight: ColorTokens = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  fill: '#EFEFF1',
  separator: '#D1D1D6',
  outline: '#C7C7CC',
  text: '#000000',
  textMuted: '#6E6E73',
  textFaint: '#AEAEB2',
  primary: '#C8281E',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FBE9E7',
  onPrimaryContainer: '#8E1B14',
  secondaryContainer: '#EFEFF1',
  onSecondaryContainer: '#000000',
  holiday: '#C8281E',
  lunarAccent: '#9A5B00',
  moonLit: '#E2A23B',
  moonShade: '#E5E5EA',
  event: '#2F6FDB',
  auspicious: '#248A3D',
  danger: '#D70015',
  segmentThumb: '#FFFFFF',
  shadow: '#000000',
  scrim: 'rgba(0,0,0,0.4)',
};

const iosDark: ColorTokens = {
  background: '#000000',
  surface: '#1C1C1E',
  fill: '#2C2C2E',
  separator: '#38383A',
  outline: '#48484A',
  text: '#FFFFFF',
  textMuted: '#98989F',
  textFaint: '#5A5A5F',
  primary: '#FF5F52',
  onPrimary: '#FFFFFF',
  primaryContainer: '#3B1613',
  onPrimaryContainer: '#FFB4AB',
  secondaryContainer: '#2C2C2E',
  onSecondaryContainer: '#FFFFFF',
  holiday: '#FF5F52',
  lunarAccent: '#F2B04F',
  moonLit: '#F2C36B',
  moonShade: '#3A3A3C',
  event: '#64A0FF',
  auspicious: '#30D158',
  danger: '#FF6961',
  segmentThumb: '#636366',
  shadow: '#000000',
  scrim: 'rgba(0,0,0,0.4)',
};

const androidLight: ColorTokens = {
  background: '#FFF8F7',
  surface: '#FCEAE7',
  fill: '#F3E0DD',
  separator: '#EBDAD7',
  outline: '#857371',
  text: '#231918',
  textMuted: '#534341',
  textFaint: '#A08C8A',
  primary: '#AF2C21',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFDAD5',
  onPrimaryContainer: '#410001',
  secondaryContainer: '#F7DCD8',
  onSecondaryContainer: '#2C1512',
  holiday: '#AF2C21',
  lunarAccent: '#8B5000',
  moonLit: '#E2A23B',
  moonShade: '#EADBD8',
  event: '#2F62C8',
  auspicious: '#2E6B30',
  danger: '#BA1A1A',
  segmentThumb: '#F7DCD8',
  shadow: '#000000',
  scrim: 'rgba(0,0,0,0.32)',
};

const androidDark: ColorTokens = {
  background: '#1A1110',
  surface: '#271D1C',
  fill: '#3D3231',
  separator: '#3D3231',
  outline: '#A08C8A',
  text: '#F1DFDC',
  textMuted: '#D8C2BF',
  textFaint: '#857371',
  primary: '#FFB4A9',
  onPrimary: '#690002',
  primaryContainer: '#8C1D15',
  onPrimaryContainer: '#FFDAD5',
  secondaryContainer: '#5D3F3B',
  onSecondaryContainer: '#FFDAD5',
  holiday: '#FFB4A9',
  lunarAccent: '#FFB95C',
  moonLit: '#F2C36B',
  moonShade: '#3D3231',
  event: '#AFC6FF',
  auspicious: '#90D88E',
  danger: '#FFB4AB',
  segmentThumb: '#5D3F3B',
  shadow: '#000000',
  scrim: 'rgba(0,0,0,0.32)',
};

export const lightColors: ColorTokens =
  Platform.OS === 'android' ? androidLight : iosLight;
export const darkColors: ColorTokens =
  Platform.OS === 'android' ? androidDark : iosDark;
