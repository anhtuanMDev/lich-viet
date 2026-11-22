import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import { moonShape } from '../moonPath';

import { MoonLitPart } from './MoonLitPart';

import type { MoonPhase } from '@core/lunar';

/**
 * Mặt trăng đúng pha của ngày - dấu hiệu riêng của Lịch Việt. Vẽ bằng View nên không cần
 * thư viện SVG. Chữ bên cạnh đã nói ngày âm nên ẩn khỏi trình đọc màn hình.
 */
export function Moon({
  phase,
  size,
}: {
  readonly phase: MoonPhase;
  readonly size: number;
}) {
  const styles = useStyles();
  const shape = moonShape(phase);
  return (
    <View
      style={[
        styles.disc,
        { width: size, height: size, borderRadius: size / 2 },
        shape.fill === 'full' && styles.full,
      ]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {shape.fill === 'partial' ? (
        <MoonLitPart shape={shape} size={size} />
      ) : null}
    </View>
  );
}

const useStyles = createThemedStyles(theme => ({
  disc: {
    overflow: 'hidden',
    backgroundColor: theme.colors.moonShade,
  },
  full: {
    backgroundColor: theme.colors.moonLit,
  },
}));
