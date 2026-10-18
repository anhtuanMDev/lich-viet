import { StyleSheet, Text } from 'react-native';
import { fontScaleLimit } from '@shared/theme';

interface TabIconProps {
  readonly color: string;
  readonly size: number;
}

// Tạm dùng ký tự Unicode để không thêm thư viện icon ở giai đoạn đầu;
// thay bằng bộ icon SVG khi có thiết kế chính thức.
// `size` đã là kích thước icon (dp) - không phóng theo cỡ chữ máy, nếu không tràn thanh tab.
const glyph = (symbol: string) =>
  function Icon({ color, size }: TabIconProps) {
    return (
      <Text
        allowFontScaling={false}
        // Ký tự trang trí: trình đọc màn hình chỉ đọc tên tab.
        accessible={false}
        importantForAccessibility="no"
        accessibilityElementsHidden
        style={[styles.icon, { color, fontSize: size }]}
      >
        {symbol}
      </Text>
    );
  };

export const TabIcon = {
  today: glyph('◉'),
  calendar: glyph('▦'),
  events: glyph('✦'),
  converter: glyph('⇄'),
} as const;

interface TabLabelProps {
  readonly color: string;
  readonly children: string;
}

/**
 * Thanh tab cao cố định (49dp) nhưng nhãn mặc định phóng theo cỡ chữ máy không giới hạn
 * trên Android → chữ bị cắt. Nhãn riêng có trần phóng chữ và tự co nếu vẫn dài.
 */
export function TabLabel({ color, children }: TabLabelProps) {
  return (
    <Text
      maxFontSizeMultiplier={fontScaleLimit.compact}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      style={[styles.label, { color }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
