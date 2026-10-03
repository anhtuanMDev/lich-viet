import { StyleSheet, Text } from 'react-native';

interface TabIconProps {
  readonly color: string;
  readonly size: number;
}

// Tạm dùng ký tự Unicode để không thêm thư viện icon ở giai đoạn đầu;
// thay bằng bộ icon SVG khi có thiết kế chính thức.
const glyph = (symbol: string) =>
  function Icon({ color, size }: TabIconProps) {
    return (
      <Text style={[styles.icon, { color, fontSize: size }]}>{symbol}</Text>
    );
  };

export const TabIcon = {
  today: glyph('◉'),
  calendar: glyph('▦'),
  events: glyph('✦'),
  converter: glyph('⇄'),
} as const;

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
