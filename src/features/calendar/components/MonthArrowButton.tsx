import { Platform, Pressable } from 'react-native';

import { createThemedStyles, useTheme } from '@shared/theme';
import { Icon } from '@shared/ui';

import type { IconName } from '@shared/ui';

const ICON_SIZE = 26;
const RIPPLE_RADIUS = 20;

export interface MonthArrowButtonProps {
  readonly label: string;
  readonly icon: IconName;
  readonly onPress: () => void;
}

/** Nút sang tháng trước / sau: icon màu nhấn (iOS) hoặc màu phụ (Material). */
export function MonthArrowButton({
  label,
  icon,
  onPress,
}: MonthArrowButtonProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{
        color: colors.fill,
        borderless: true,
        radius: RIPPLE_RADIUS,
      }}
      style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
    >
      <Icon
        name={icon}
        size={ICON_SIZE}
        color={Platform.OS === 'ios' ? 'primary' : 'textMuted'}
      />
    </Pressable>
  );
}

const useStyles = createThemedStyles(theme => ({
  arrow: {
    width: theme.controlSize.touch,
    height: theme.controlSize.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.5 },
}));
