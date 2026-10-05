/*
 * Chọn cách mở cài đặt pin của hãng. Logic thuần để test được; phần gọi hệ điều hành ở notifier.ts.
 */

/**
 * Hãng dùng ColorOS (OnePlus từ OxygenOS 12 dùng chung nền ColorOS). Danh sách màn hình quản lý
 * pin mà notify-kit cài sẵn cho các hãng này là tên cũ (com.coloros.safecenter, com.oppo.safe…):
 * ColorOS mới đã đổi/khoá nên không mở được, thư viện lại nuốt lỗi → bấm nút không có gì xảy ra.
 * Trên ColorOS mới, mục pin (hoạt động nền, tự khởi chạy) nằm ngay trong Thông tin ứng dụng.
 */
const COLOROS_BRANDS: ReadonlySet<string> = new Set([
  'oppo',
  'realme',
  'oneplus',
]);

export const isColorOsBrand = (manufacturer: string | null): boolean =>
  manufacturer !== null && COLOROS_BRANDS.has(manufacturer.trim().toLowerCase());

/**
 * - `appSettings`: mở Thông tin ứng dụng của Lịch Việt (luôn mở được).
 * - `oem`: thử màn hình quản lý pin của hãng, không được thì lùi về Thông tin ứng dụng.
 * - `null`: hãng không có màn hình riêng → không hiện nút.
 */
export type PowerManagerRoute = 'appSettings' | 'oem';

export const powerManagerRoute = (
  manufacturer: string | null,
  hasOemScreen: boolean,
): PowerManagerRoute | null => {
  if (isColorOsBrand(manufacturer)) {
    return 'appSettings';
  }
  return hasOemScreen ? 'oem' : null;
};
