import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Đọc to `message` cho trình đọc màn hình mỗi khi nó đổi (bỏ qua lần render đầu).
 *
 * Android: chữ có `accessibilityLiveRegion` đã tự được đọc khi đổi → mặc định chỉ chạy trên
 * iOS (VoiceOver không có live region). `always` cho chỗ không có chữ live region
 * (VD: vuốt sang tháng khác trên lưới lịch).
 */
export function useAnnounce(
  message: string | null,
  { always = false }: { always?: boolean } = {},
): void {
  const previous = useRef(message);
  useEffect(() => {
    if (message === previous.current) {
      return;
    }
    previous.current = message;
    if (message && (always || Platform.OS === 'ios')) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message, always]);
}
