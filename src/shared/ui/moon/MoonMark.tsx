import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import type { LunarMark } from '@core/lunar';

/** Nét vòng tròn rỗng: tỉ lệ với cỡ ký hiệu nhưng không mảnh hơn 1.2dp. */
const MIN_RING_WIDTH = 1.2;
/** Nét vòng = 1/6 đường kính. */
const RING_WIDTH_DIVISOR = 6;

/**
 * Ký hiệu nhỏ cho mùng 1 (vòng tròn rỗng = trăng mới) và rằm (đĩa đặc = trăng tròn):
 * phân biệt bằng hình dạng, không chỉ bằng màu.
 */
export function MoonMark({
  kind,
  size,
}: {
  readonly kind: LunarMark;
  readonly size: number;
}) {
  const styles = useStyles();
  const circle = { width: size, height: size, borderRadius: size / 2 };
  if (kind === 'full') {
    return <View style={[styles.full, circle]} />;
  }
  const borderWidth = Math.max(MIN_RING_WIDTH, size / RING_WIDTH_DIVISOR);
  return <View style={[styles.ring, circle, { borderWidth }]} />;
}

const useStyles = createThemedStyles(theme => ({
  full: {
    backgroundColor: theme.colors.moonLit,
  },
  ring: {
    borderColor: theme.colors.lunarAccent,
  },
}));
