import { Platform, Pressable, View } from 'react-native';

import { createThemedStyles, useTheme } from '@shared/theme';

import { Icon } from './Icon';
import { useTabBarSpace } from './tabBarSpace';

import type { IconName } from './Icon';

/** Khoảng cần chừa cuối danh sách để hàng cuối không nằm dưới nút nổi (56dp + lề). */
export const FAB_CLEARANCE = 96;

export interface FabProps {
  readonly icon: IconName;
  readonly label: string;
  readonly onPress: () => void;
}

/**
 * Nút nổi Material 3 (56dp, bo 16) cho hành động chính của màn hình. Chỉ hiện trên Android;
 * iOS đặt hành động đó ở thanh tiêu đề.
 */
export function Fab({ icon, label, onPress }: FabProps) {
  const styles = useStyles();
  const { colors, spacing } = useTheme();
  const tabBarSpace = useTabBarSpace();
  if (Platform.OS !== 'android') {
    return null;
  }
  return (
    <View
      style={[styles.anchor, { bottom: tabBarSpace + spacing.lg }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        android_ripple={{ color: colors.primary, borderless: false }}
        style={styles.fab}
      >
        <Icon name={icon} size={24} color="onPrimaryContainer" />
      </Pressable>
    </View>
  );
}

const useStyles = createThemedStyles(t => ({
  anchor: {
    position: 'absolute',
    right: t.spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.primaryContainer,
    elevation: 3,
  },
}));
