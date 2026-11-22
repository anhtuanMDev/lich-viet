import { View } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import type { MoonShape } from '../moonPath';

/**
 * Phần sáng của trăng chưa tròn hẳn: nửa đĩa sáng + một elip (hình tròn co theo trục ngang)
 * làm đường phân cách sáng tối - tô sáng khi trăng quá nửa, tô tối khi là lưỡi liềm.
 */
export function MoonLitPart({
  shape,
  size,
}: {
  readonly shape: MoonShape;
  readonly size: number;
}) {
  const styles = useStyles();
  const disc = { width: size, height: size, borderRadius: size / 2 };
  return (
    <>
      <View
        style={[
          styles.lit,
          styles.half,
          { width: size / 2, height: size },
          shape.litSide === 'right' ? styles.right : styles.left,
        ]}
      />
      <View
        style={[
          styles.terminator,
          disc,
          shape.isTerminatorLit ? styles.lit : styles.shade,
          { transform: [{ scaleX: shape.terminatorScale }] },
        ]}
      />
    </>
  );
}

const useStyles = createThemedStyles(theme => ({
  lit: { backgroundColor: theme.colors.moonLit },
  shade: { backgroundColor: theme.colors.moonShade },
  half: { position: 'absolute', top: 0 },
  left: { left: 0 },
  right: { right: 0 },
  terminator: { position: 'absolute', top: 0, left: 0 },
}));
