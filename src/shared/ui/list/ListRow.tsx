import { Pressable, View } from 'react-native';

import { speakable } from '@core/a11y';
import { createThemedStyles, useTheme } from '@shared/theme';

import { ListRowContent } from './ListRowContent';
import { LEADING_GAP, isIos } from './metrics';

import type { ListRowProps } from '../types/list';

const spokenLabelOf = ({
  title,
  subtitle,
  value,
  presentation,
}: ListRowProps): string =>
  presentation?.spokenLabel ??
  speakable([title, subtitle, value].filter(Boolean).join(', '));

/**
 * Một hàng danh sách đặt thẳng trên nền. Có `action` thì bấm được (nền xám khi bấm trên iOS,
 * gợn sóng trên Android); không có thì đọc gộp cả hàng thành một câu.
 */
export function ListRow(props: ListRowProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const label = spokenLabelOf(props);
  const { action, trailing } = props;

  if (!action) {
    // Hàng có công tắc / nút ở cuối: để trình đọc màn hình chạm được vào phần tử đó.
    const isReadAsOne = trailing === undefined;
    return (
      <View
        style={styles.row}
        accessible={isReadAsOne}
        accessibilityLabel={isReadAsOne ? label : undefined}
      >
        <ListRowContent {...props} />
      </View>
    );
  }
  return (
    <Pressable
      onPress={action.onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={action.hint}
      android_ripple={{ color: colors.fill }}
      style={({ pressed }) => [styles.row, isIos && pressed && styles.pressed]}
    >
      <ListRowContent {...props} />
    </Pressable>
  );
}

const useStyles = createThemedStyles(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LEADING_GAP,
    minHeight: theme.controlSize.row,
    paddingHorizontal: theme.gutter,
    paddingVertical: isIos
      ? theme.spacing.sm + theme.spacing.xxs
      : theme.spacing.sm,
  },
  pressed: {
    backgroundColor: theme.colors.fill,
  },
}));
