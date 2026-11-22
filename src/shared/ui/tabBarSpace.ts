import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Chiều cao thanh điều hướng Material 3 (dp), chưa tính vùng cử chỉ của hệ thống. */
const MATERIAL_NAV_BAR = 80;

/**
 * Khoảng nội dung bị thanh tab native che ở cuối màn hình.
 * Android: màn hình trong tab trải xuống dưới thanh điều hướng → phải tự chừa.
 * iOS: ScrollView tự chỉnh inset (contentInsetAdjustmentBehavior) → 0.
 */
export function useTabBarSpace(): number {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'android' ? MATERIAL_NAV_BAR + insets.bottom : 0;
}
