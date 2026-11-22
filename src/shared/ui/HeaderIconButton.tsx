import { Pressable } from 'react-native';

import { createThemedStyles, useTheme } from '@shared/theme';

import { Icon } from './Icon';

import type { IconName } from './Icon';

export interface HeaderIconButtonProps {
  readonly icon: IconName;
  readonly label: string;
  readonly onPress: () => void;
}

/** Nút icon trên thanh tiêu đề Android (48dp, gợn sóng tròn). iOS dùng nút SF Symbols native. */
export function HeaderIconButton({
  icon,
  label,
  onPress,
}: HeaderIconButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: colors.fill, borderless: true, radius: 20 }}
      style={styles.button}
    >
      <Icon name={icon} size={24} color="textMuted" />
    </Pressable>
  );
}

const useStyles = createThemedStyles(() => ({
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
